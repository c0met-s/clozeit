(function () {
  const STORAGE_KEY = "clozeit-state-v1";
  const EXPORT_VERSION_KEY = "clozeit-export-version-v1";
  const EXPORT_DIRECTORY_DB = "clozeit-export-directory-v1";
  const EXPORT_DIRECTORY_STORE = "handles";
  const EXPORT_DIRECTORY_KEY = "export-directory";


  const foldersEl = document.getElementById("folders");
  const titleEl = document.getElementById("note-title");
  const studyView = document.getElementById("study-view");
  const rawEditor = document.getElementById("raw-editor");
  const addFolderBtn = document.getElementById("add-folder");
  const newNoteBtn = document.getElementById("new-note");
  const deleteNoteBtn = document.getElementById("delete-note");
  const hideRevealedBtn = document.getElementById("hide-revealed");
  const wrongOnlyBtn = document.getElementById("wrong-only");
  const downloadPrintBtn = document.getElementById("download-print");
  const publishJsonBtn = document.getElementById("publish-json");
  const creditsBtn = document.getElementById("credits-button");
  const creditsDialog = document.getElementById("credits-dialog");
  const markHideBtn = document.getElementById("mark-hide");
  const markUnhideBtn = document.getElementById("mark-unhide");
  const markHighlightBtn = document.getElementById("mark-highlight");
  const markClearBtn = document.getElementById("mark-clear");
  const markActionButtons = [markHideBtn, markUnhideBtn, markHighlightBtn, markClearBtn];
  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  const colorButtons = Array.from(document.querySelectorAll("[data-color]"));
  const modeLabel = document.getElementById("mode-label");
  const modeDetail = document.getElementById("mode-detail");

  let state = loadState();
  let activeTokenId = null;
  let cachedSelectionParts = [];
  let customSelecting = false;
  let customSelectionMoved = false;
  let suppressNextClick = false;
  let customSelectionAnchor = null;
  let lastSafeRawText = "";
  let rawEditWarningTimer = null;
  let exportDirectoryHandle = null;

  let lastPointerType = "mouse";
  let longPressTimer = null;
  let longPressHandled = false;
  let mode = normalizeMode(state.mode);
  const customSelectionName = "clozeit-mark-selection";

  const modeCopy = {
    edit: {
      label: "Edit mode",
      detail: "Raw text editing is open. Shift + Space switches to Mark."
    },
    mark: {
      label: "Mark mode",
      detail: "Select exact text. 1 hides, 2 unhides, 3 highlights. Shift + Space opens Edit."
    },
    study: {
      label: "Study mode",
      detail: "Locked view. Click reveals clozes. Right-click marks wrong. Copy and marking hotkeys are off."
    }
  };

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function makeNote(title, text) {
    return {
      id: createId("note"),
      title,
      text,
      tokens: tokenize(text)
    };
  }

  function defaultState() {
    const folderId = createId("folder");
    const note = makeNote("Untitled", "");
    return {
      currentFolderId: folderId,
      currentNoteId: note.id,
      folders: [
        {
          id: folderId,
          name: "Main",
          notes: [note]
        }
      ],
      mode: "mark",
      highlightColor: "yellow",
      reviewWrongOnly: false
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Array.isArray(saved.folders) || saved.folders.length === 0) {
        return defaultState();
      }
      saved.folders.forEach((folder) => {
        folder.notes = Array.isArray(folder.notes) ? folder.notes : [];
        folder.notes.forEach((note) => {
          note.text = typeof note.text === "string" ? note.text : "";
          note.tokens = hydrateNoteTokens(note);
          delete note.marks;
        });
      });
      if (!findFolder(saved.currentFolderId, saved)) {
        saved.currentFolderId = saved.folders[0].id;
      }
      const currentFolder = findFolder(saved.currentFolderId, saved);
      if (!currentFolder.notes.length) {
        const note = makeNote("Untitled", "");
        currentFolder.notes.push(note);
        saved.currentNoteId = note.id;
      }
      if (!findNote(saved.currentNoteId, saved)) {
        saved.currentNoteId = currentFolder.notes[0].id;
      }
      saved.mode = normalizeMode(saved.mode);
      saved.highlightColor = normalizeHighlightColor(saved.highlightColor);
      saved.reviewWrongOnly = Boolean(saved.reviewWrongOnly);
      return saved;
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compactState(state)));
  }

  function captureScrollState() {
    return {
      windowX: window.scrollX,
      windowY: window.scrollY,
      studyTop: studyView.scrollTop,
      studyLeft: studyView.scrollLeft,
      rawTop: rawEditor.scrollTop,
      rawLeft: rawEditor.scrollLeft,
      foldersTop: foldersEl.scrollTop,
      foldersLeft: foldersEl.scrollLeft
    };
  }

  function restoreScrollState(snapshot) {
    window.scrollTo(snapshot.windowX, snapshot.windowY);
    studyView.scrollTop = snapshot.studyTop;
    studyView.scrollLeft = snapshot.studyLeft;
    rawEditor.scrollTop = snapshot.rawTop;
    rawEditor.scrollLeft = snapshot.rawLeft;
    foldersEl.scrollTop = snapshot.foldersTop;
    foldersEl.scrollLeft = snapshot.foldersLeft;
  }

  function preserveScroll(work) {
    const snapshot = captureScrollState();
    const result = work();
    restoreScrollState(snapshot);
    requestAnimationFrame(() => restoreScrollState(snapshot));
    return result;
  }

  function showModeDetail(message, isWarning = false) {
    modeDetail.textContent = message;
    modeDetail.classList.toggle("warning", isWarning);
    if (rawEditWarningTimer) {
      clearTimeout(rawEditWarningTimer);
      rawEditWarningTimer = null;
    }

    if (isWarning) {
      rawEditWarningTimer = setTimeout(() => {
        modeDetail.textContent = modeCopy[mode].detail;
        modeDetail.classList.remove("warning");
      }, 2200);
    }
  }

  function focusWithoutScroll(element) {
    const snapshot = captureScrollState();
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
      restoreScrollState(snapshot);
    }
  }

  function syncModeScroll(fromMode, toMode, sourceTop, sourceLeft) {
    if (fromMode === toMode) return;

    if (fromMode === "edit" && toMode !== "edit") {
      studyView.scrollTop = sourceTop;
      studyView.scrollLeft = sourceLeft;
      requestAnimationFrame(() => {
        studyView.scrollTop = sourceTop;
        studyView.scrollLeft = sourceLeft;
      });
      return;
    }

    if (fromMode !== "edit" && toMode === "edit") {
      rawEditor.scrollTop = sourceTop;
      rawEditor.scrollLeft = sourceLeft;
      requestAnimationFrame(() => {
        rawEditor.scrollTop = sourceTop;
        rawEditor.scrollLeft = sourceLeft;
      });
    }
  }

  function tokenize(text, offset = 0) {
    const parts = text.match(/\s+|[^\s]+/g) || [];
    let wordIndex = 0;
    let cursor = offset;
    return parts.map((value) => {
      const isSpace = /^\s+$/.test(value);
      const token = {
        id: `t-${cursor}`,
        value,
        isSpace,
        wordIndex: isSpace ? null : wordIndex++,
        hidden: false,
        hiddenGroup: null,
        wrong: false,
        hinted: false,
        revealed: false,
        highlight: null
      };
      cursor += value.length;
      return token;
    });
  }

  function normalizeMode(value) {
    return ["edit", "mark", "study"].includes(value) ? value : "mark";
  }

  function normalizeHighlightColor(value) {
    return ["yellow", "green", "blue", "pink"].includes(value) ? value : "yellow";
  }

  function normalizeTokenHighlight(value) {
    if (value === true) return "yellow";
    return normalizeHighlightColor(value) === value ? value : null;
  }

  function normalizeToken(token, fallbackId) {
    const value = typeof token.value === "string" ? token.value : "";
    const isSpace = /^\s+$/.test(value);
    return {
      id: token.id || fallbackId,
      value,
      isSpace,
      wordIndex: token.wordIndex ?? null,
      hidden: Boolean(token.hidden),
      hiddenGroup: typeof token.hiddenGroup === "string" ? token.hiddenGroup : null,
      wrong: Boolean(token.wrong),
      hinted: Boolean(token.hinted),
      revealed: Boolean(token.revealed),
      highlight: normalizeTokenHighlight(token.highlight)
    };
  }

  function hasMarkState(token) {
    return Boolean(token.hidden || token.hiddenGroup || token.wrong || token.hinted || token.revealed || token.highlight);
  }

  function plainToken(value, id = createId("token")) {
    const isSpace = /^\s+$/.test(value);
    return {
      id,
      value,
      isSpace,
      wordIndex: null,
      hidden: false,
      hiddenGroup: null,
      wrong: false,
      hinted: false,
      revealed: false,
      highlight: null
    };
  }

  function tokenizeSegment(text, offset = 0) {
    if (!text) return [];
    return tokenize(text, offset).map((token) => plainToken(token.value, token.id));
  }


  function normalizeTokenIndexes(tokens) {
    let wordIndex = 0;
    tokens.forEach((token) => {
      token.isSpace = /^\s+$/.test(token.value);
      token.wordIndex = token.isSpace ? null : wordIndex++;
      if (token.isSpace) {
        token.hidden = false;
        token.hiddenGroup = null;
        token.wrong = false;
        token.hinted = false;
        token.revealed = false;
      }
    });
    return tokens.filter((token) => token.value.length > 0);
  }

  function tokenRanges(tokens) {
    let offset = 0;
    return tokens.map((token) => {
      const start = offset;
      const end = start + token.value.length;
      offset = end;
      return { token, start, end };
    });
  }

  function markFromToken(token, start, end) {
    const mark = { start, end, id: token.id };
    if (token.hidden) mark.hidden = true;
    if (token.hiddenGroup) mark.hiddenGroup = token.hiddenGroup;
    if (token.wrong) mark.wrong = true;
    if (token.hinted) mark.hinted = true;
    if (token.revealed) mark.revealed = true;
    if (token.highlight) mark.highlight = token.highlight;
    return mark;
  }

  function marksFromTokens(tokens) {
    return tokenRanges(tokens)
      .filter(({ token }) => hasMarkState(token))
      .map(({ token, start, end }) => markFromToken(token, start, end));
  }

  function comparableMarkState(token) {
    return [
      Boolean(token.hidden),
      token.hiddenGroup || "",
      Boolean(token.wrong),
      Boolean(token.hinted),
      Boolean(token.revealed),
      token.highlight || ""
    ].join("|");
  }

  function coalesceAdjacentTokens(tokens) {
    const joined = [];
    tokens.forEach((rawToken, index) => {
      const token = normalizeToken(rawToken, `token-${index}`);
      const previous = joined[joined.length - 1];
      const canJoin = previous && !previous.isSpace && !token.isSpace &&
        hasMarkState(previous) && hasMarkState(token) &&
        comparableMarkState(previous) === comparableMarkState(token);
      if (canJoin) previous.value += token.value;
      else joined.push(token);
    });
    return normalizeTokenIndexes(joined);
  }

  function cleanMarks(text, marks) {
    if (!Array.isArray(marks)) return [];
    return marks.map((mark, index) => {
      const start = Math.max(0, Math.min(text.length, Number(mark.start)));
      const end = Math.max(start, Math.min(text.length, Number(mark.end)));
      if (!Number.isFinite(start) || !Number.isFinite(end) || start === end) return null;
      return {
        start,
        end,
        id: typeof mark.id === "string" ? mark.id : `mark-${start}-${index}`,
        hidden: Boolean(mark.hidden),
        hiddenGroup: typeof mark.hiddenGroup === "string" ? mark.hiddenGroup : null,
        wrong: Boolean(mark.wrong),
        hinted: Boolean(mark.hinted),
        revealed: Boolean(mark.revealed),
        highlight: normalizeTokenHighlight(mark.highlight)
      };
    }).filter(Boolean);
  }

  function tokensFromMarks(text, marks) {
    const normalizedMarks = cleanMarks(text, marks);
    if (!normalizedMarks.length) return tokenize(text);
    const boundaries = new Set([0, text.length]);
    normalizedMarks.forEach((mark) => { boundaries.add(mark.start); boundaries.add(mark.end); });
    const points = [...boundaries].sort((a, b) => a - b);
    const nextTokens = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      const value = text.slice(start, end);
      const activeMarks = normalizedMarks.filter((mark) => mark.start <= start && mark.end >= end);
      if (!activeMarks.length) {
        nextTokens.push(...tokenizeSegment(value, start));
        continue;
      }
      const token = plainToken(value, activeMarks[activeMarks.length - 1].id);
      activeMarks.forEach((mark) => {
        if (mark.hidden) token.hidden = true;
        if (mark.hiddenGroup) token.hiddenGroup = mark.hiddenGroup;
        if (mark.wrong) token.wrong = true;
        if (mark.hinted) token.hinted = true;
        if (mark.revealed) token.revealed = true;
        if (mark.highlight) token.highlight = mark.highlight;
      });
      nextTokens.push(token);
    }
    return coalesceAdjacentTokens(nextTokens);
  }

  function normalizeSavedTokens(text, tokens) {
    if (!Array.isArray(tokens)) return tokenize(text);
    const savedText = tokens.map((token) => token.value || "").join("");
    if (savedText !== text) return mergeTokenState(text, tokens);
    return coalesceAdjacentTokens(tokens.map((token, index) => normalizeToken(token, `t-${index}`)));
  }

  function hydrateNoteTokens(note) {
    if (Array.isArray(note.marks)) return tokensFromMarks(note.text, note.marks);
    return normalizeSavedTokens(note.text, note.tokens);
  }

  function compactNote(note) {
    return { id: note.id, title: note.title, text: note.text, marks: marksFromTokens(note.tokens || []) };
  }

  function compactState(sourceState) {
    return {
      ...sourceState,
      folders: sourceState.folders.map((folder) => ({
        ...folder,
        notes: (folder.notes || []).map(compactNote)
      }))
    };
  }

  function commonPrefixLength(left, right) {
    const limit = Math.min(left.length, right.length);
    let index = 0;
    while (index < limit && left[index] === right[index]) index += 1;
    return index;
  }

  function commonSuffixLength(left, right, prefixLength) {
    const limit = Math.min(left.length, right.length) - prefixLength;
    let length = 0;
    while (length < limit && left[left.length - 1 - length] === right[right.length - 1 - length]) length += 1;
    return length;
  }

  function remapMarksForEdit(oldText, newText, marks) {
    const prefixLength = commonPrefixLength(oldText, newText);
    const suffixLength = commonSuffixLength(oldText, newText, prefixLength);
    const oldChangeEnd = oldText.length - suffixLength;
    const newChangeEnd = newText.length - suffixLength;
    const delta = newText.length - oldText.length;
    const remapped = [];
    cleanMarks(oldText, marks).forEach((mark) => {
      if (mark.end <= prefixLength) remapped.push(mark);
      else if (mark.start >= oldChangeEnd) remapped.push({ ...mark, start: mark.start + delta, end: mark.end + delta });
      else {
        if (mark.start < prefixLength) remapped.push({ ...mark, end: prefixLength });
        if (mark.end > oldChangeEnd) remapped.push({ ...mark, id: `${mark.id}-tail`, start: newChangeEnd, end: mark.end + delta });
      }
    });
    return remapped;
  }

  function mergeTokenState(text, oldTokens) {
    const normalizedOldTokens = Array.isArray(oldTokens)
      ? oldTokens.map((token, index) => normalizeToken(token, `old-${index}`))
      : [];
    const oldText = normalizedOldTokens.map((token) => token.value).join("");
    if (!oldText) return tokenize(text);
    if (oldText === text) return coalesceAdjacentTokens(normalizedOldTokens);
    return tokensFromMarks(text, remapMarksForEdit(oldText, text, marksFromTokens(normalizedOldTokens)));
  }
  function currentFolder() {
    return findFolder(state.currentFolderId, state);
  }

  function currentNote() {
    return findNote(state.currentNoteId, state);
  }

  function findFolder(folderId, sourceState) {
    return sourceState.folders.find((folder) => folder.id === folderId);
  }

  function findNote(noteId, sourceState) {
    for (const folder of sourceState.folders) {
      const note = folder.notes.find((candidate) => candidate.id === noteId);
      if (note) return note;
    }
    return null;
  }

  function titleFromText(text) {
    const firstLine = text.split(/\r?\n/).find((line) => line.trim());
    const title = (firstLine || "Untitled").trim().replace(/\s+/g, " ");
    return title.length > 48 ? `${title.slice(0, 45)}...` : title;
  }

  function render() {
    preserveScroll(() => {
      renderNavigation();
      renderNote();
      saveState();
    });
  }

  function renderNavigation() {
    foldersEl.replaceChildren();
    state.folders.forEach((folder) => {
      const folderBox = document.createElement("section");
      folderBox.className = "folder";

      const folderHeader = document.createElement("div");
      folderHeader.className = "folder-header";

      const folderButton = document.createElement("button");
      folderButton.type = "button";
      folderButton.className = `folder-row${folder.id === state.currentFolderId ? " active" : ""}`;
      folderButton.dataset.folderId = folder.id;
      folderButton.innerHTML = `<span></span><span class="count">${folder.notes.length}</span>`;
      folderButton.firstChild.textContent = folder.name;
      folderHeader.appendChild(folderButton);

      const renameButton = document.createElement("button");
      renameButton.type = "button";
      renameButton.className = "folder-tool";
      renameButton.dataset.renameFolderId = folder.id;
      renameButton.title = "Rename folder";
      renameButton.textContent = "Rename";
      folderHeader.appendChild(renameButton);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "folder-tool danger";
      deleteButton.dataset.deleteFolderId = folder.id;
      deleteButton.title = "Delete folder";
      deleteButton.textContent = "Delete";
      folderHeader.appendChild(deleteButton);

      folderBox.appendChild(folderHeader);

      folder.notes.forEach((note) => {
        const noteButton = document.createElement("button");
        noteButton.type = "button";
        noteButton.className = `note-row${note.id === state.currentNoteId ? " active" : ""}`;
        noteButton.dataset.noteId = note.id;
        noteButton.innerHTML = `<span></span><span class="count">${hiddenCount(note)}</span>`;
        noteButton.firstChild.textContent = note.title || "Untitled";
        folderBox.appendChild(noteButton);
      });

      foldersEl.appendChild(folderBox);
    });
  }

  function hiddenCount(note) {
    const count = note.tokens.filter((token) => token.hidden).length;
    return count ? `${count}` : "";
  }

  function renderNote() {
    const note = currentNote();
    if (!note) return;

    titleEl.value = note.title || "Untitled";
    rawEditor.value = note.text;
    studyView.replaceChildren();
    activeTokenId = note.tokens.some((token) => token.id === activeTokenId) ? activeTokenId : null;

    if (!note.text.trim()) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Paste text here";
      studyView.appendChild(empty);
      return;
    }

    let plainText = "";
    const flushPlainText = () => {
      if (!plainText) return;
      studyView.appendChild(document.createTextNode(plainText));
      plainText = "";
    };

    note.tokens.forEach((token) => {
      const needsElement = mode === "mark" || hasMarkState(token) || token.id === activeTokenId;
      if (!needsElement) {
        plainText += token.value;
        return;
      }

      flushPlainText();
      const span = document.createElement("span");
      span.className = tokenClass(token);
      span.dataset.tokenId = token.id;
      span.textContent = token.value;
      studyView.appendChild(span);
    });
    flushPlainText();
    updateCustomSelectionVisuals();
  }
  function tokenClass(token) {
    const classes = ["token", token.isSpace ? "space" : "word"];
    const reviewHidden = shouldReviewHiddenToken(token);
    if (mode === "mark" && token.id === activeTokenId) {
      classes.push("selected");
    }
    if (token.hidden) classes.push("hidden");
    if (token.wrong) classes.push("wrong");
    if (reviewHidden && !token.revealed) classes.push("covered");
    if (token.revealed || (token.hidden && !reviewHidden)) classes.push("revealed");
    if (token.highlight) classes.push(`highlight-${token.highlight}`);
    return classes.join(" ");
  }

  function shouldReviewHiddenToken(token) {
    return Boolean(token.hidden && (mode !== "study" || !state.reviewWrongOnly || token.wrong));
  }

  function setCurrentFolder(folderId) {
    const folder = findFolder(folderId, state);
    if (!folder) return;
    state.currentFolderId = folder.id;
    if (!folder.notes.some((note) => note.id === state.currentNoteId)) {
      if (!folder.notes.length) {
        folder.notes.push(makeNote("Untitled", ""));
      }
      state.currentNoteId = folder.notes[0].id;
    }
    activeTokenId = null;
    cachedSelectionParts = [];
    render();
  }

  function renameFolder(folderId) {
    const folder = findFolder(folderId, state);
    if (!folder) return;

    const name = prompt("Folder name", folder.name);
    if (name === null) return;

    const nextName = name.trim();
    if (!nextName || nextName === folder.name) return;

    folder.name = nextName;
    render();
  }

  function deleteFolder(folderId) {
    const folder = findFolder(folderId, state);
    if (!folder) return;

    const noteCount = folder.notes.length;
    const confirmed = confirm(
      `Delete folder "${folder.name}" and ${noteCount} note${noteCount === 1 ? "" : "s"}?`
    );
    if (!confirmed) return;

    state.folders = state.folders.filter((candidate) => candidate.id !== folderId);
    if (!state.folders.length) {
      const replacement = defaultState();
      state.folders = replacement.folders;
      state.currentFolderId = replacement.currentFolderId;
      state.currentNoteId = replacement.currentNoteId;
    } else if (state.currentFolderId === folderId) {
      const nextFolder = state.folders[0];
      if (!nextFolder.notes.length) {
        nextFolder.notes.push(makeNote("Untitled", ""));
      }
      state.currentFolderId = nextFolder.id;
      state.currentNoteId = nextFolder.notes[0].id;
    }

    activeTokenId = null;
    cachedSelectionParts = [];
    render();
  }

  function setCurrentNote(noteId) {
    if (!findNote(noteId, state)) return;
    state.currentNoteId = noteId;
    const folder = state.folders.find((candidate) =>
      candidate.notes.some((note) => note.id === noteId)
    );
    state.currentFolderId = folder.id;
    activeTokenId = null;
    cachedSelectionParts = [];
    render();
  }

  function createFolder() {
    const name = prompt("Folder name", "New folder");
    if (name === null) return;
    const folderName = name.trim() || "New folder";
    const note = makeNote("Untitled", "");
    const folder = {
      id: createId("folder"),
      name: folderName,
      notes: [note]
    };
    state.folders.push(folder);
    state.currentFolderId = folder.id;
    state.currentNoteId = note.id;
    activeTokenId = null;
    cachedSelectionParts = [];
    render();
  }

  function createNote(text) {
    const folder = currentFolder();
    const noteText = typeof text === "string" ? text : "";
    const note = makeNote(titleFromText(noteText), noteText);
    folder.notes.unshift(note);
    state.currentNoteId = note.id;
    activeTokenId = null;
    cachedSelectionParts = [];
    render();
    if (!noteText) {
      setMode("edit");
      focusWithoutScroll(rawEditor);
    }
  }

  function deleteCurrentNote() {
    const folder = currentFolder();
    if (!folder || !folder.notes.length) return;
    const note = currentNote();
    const confirmed = confirm(`Delete "${note.title || "Untitled"}"?`);
    if (!confirmed) return;

    folder.notes = folder.notes.filter((candidate) => candidate.id !== note.id);
    if (!folder.notes.length) {
      const replacement = makeNote("Untitled", "");
      folder.notes.push(replacement);
    }
    state.currentNoteId = folder.notes[0].id;
    activeTokenId = null;
    cachedSelectionParts = [];
    render();
  }

  function updateCurrentText(text) {
    const note = currentNote();
    if (!note) return;
    note.text = text;
    note.title = note.title && note.title !== "Untitled" ? note.title : titleFromText(text);
    note.tokens = mergeTokenState(text, note.tokens);
    activeTokenId = null;
    cachedSelectionParts = [];
    render();
  }

  function hiddenTextRanges(note = currentNote()) {
    if (!note) return [];
    let offset = 0;
    const ranges = [];

    note.tokens.forEach((token) => {
      const start = offset;
      const end = start + token.value.length;
      if (token.hidden && !token.isSpace) {
        ranges.push({ start, end, text: token.value });
      }
      offset = end;
    });

    return ranges;
  }

  function rangesOverlap(start, end, range) {
    return start < range.end && end > range.start;
  }

  function pointInsideRange(offset, range) {
    return offset > range.start && offset < range.end;
  }

  function effectiveRawEditRange(event) {
    const start = rawEditor.selectionStart;
    const end = rawEditor.selectionEnd;
    const inputType = event.inputType || "";

    if (start !== end) return { start, end };
    if (inputType === "deleteContentBackward") {
      return { start: Math.max(0, start - 1), end };
    }
    if (inputType === "deleteContentForward") {
      return { start, end: Math.min(rawEditor.value.length, end + 1) };
    }
    if (inputType.startsWith("delete")) {
      return { start, end };
    }
    return { start, end, insertion: true };
  }

  function rawEditTouchesHidden(event) {
    const range = effectiveRawEditRange(event);
    const hiddenRanges = hiddenTextRanges();

    return hiddenRanges.some((hiddenRange) => {
      if (range.insertion && range.start === range.end) {
        return pointInsideRange(range.start, hiddenRange);
      }
      return rangesOverlap(range.start, range.end, hiddenRange);
    });
  }

  function warnProtectedHiddenEdit() {
    rawEditor.value = lastSafeRawText;
    showModeDetail("Hidden text is protected. Unhide it before editing those characters.", true);
  }

  function setMode(nextMode) {
    const previousMode = mode;
    const nextNormalizedMode = normalizeMode(nextMode);
    const sourceTop = previousMode === "edit" ? rawEditor.scrollTop : studyView.scrollTop;
    const sourceLeft = previousMode === "edit" ? rawEditor.scrollLeft : studyView.scrollLeft;

    if (
      (previousMode === "edit" && nextNormalizedMode !== "edit") ||
      (previousMode !== "edit" && nextNormalizedMode === "edit")
    ) {
      applyModeChange(previousMode, nextNormalizedMode, true, sourceTop, sourceLeft);
      return;
    }

    preserveScroll(() => applyModeChange(previousMode, nextNormalizedMode, false, sourceTop, sourceLeft));
  }

  function applyModeChange(previousMode, nextModeValue, shouldSyncScroll, sourceTop, sourceLeft) {
      mode = normalizeMode(nextModeValue);
      state.mode = mode;
      document.body.classList.toggle("mode-edit", mode === "edit");
      document.body.classList.toggle("mode-mark", mode === "mark");
      document.body.classList.toggle("mode-study", mode === "study");
      titleEl.disabled = mode === "study";
      hideRevealedBtn.disabled = mode !== "study";
      hideRevealedBtn.classList.toggle("study-action", mode === "study");
      wrongOnlyBtn.disabled = mode !== "study";
      wrongOnlyBtn.classList.toggle("study-action", mode === "study");
      wrongOnlyBtn.classList.toggle("active", Boolean(state.reviewWrongOnly));
      wrongOnlyBtn.setAttribute("aria-pressed", String(Boolean(state.reviewWrongOnly)));
      updateMarkActions();

      modeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.mode === mode);
        button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
      });

      colorButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.color === state.highlightColor);
        button.setAttribute("aria-pressed", String(button.dataset.color === state.highlightColor));
      });

      modeLabel.textContent = modeCopy[mode].label;
      showModeDetail(modeCopy[mode].detail);

      if (mode !== "mark") {
        activeTokenId = null;
        cachedSelectionParts = [];
        clearNativeSelection();
        clearCustomSelectionVisuals();
      }

      if (mode === "edit") {
        lastSafeRawText = rawEditor.value;
        focusWithoutScroll(rawEditor);
      } else {
        renderNote();
        focusWithoutScroll(studyView);
      }
      if (shouldSyncScroll) {
        syncModeScroll(previousMode, nextModeValue, sourceTop, sourceLeft);
      }
      saveState();
  }

  function hasStudySelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return false;
    }
    return studyView.contains(selection.anchorNode) || studyView.contains(selection.focusNode);
  }

  function wordNodes() {
    return Array.from(studyView.querySelectorAll(".token.word"));
  }

  function clearNativeSelection() {
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
  }

  function clearCustomSelectionVisuals() {
    if (CSS.highlights) {
      CSS.highlights.delete(customSelectionName);
    }
    studyView.querySelectorAll(".token.selected").forEach((node) => {
      node.classList.remove("selected");
    });
  }

  function caretPointFromEvent(event) {
    let node = null;
    let offset = 0;

    if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(event.clientX, event.clientY);
      node = position?.offsetNode || null;
      offset = position?.offset || 0;
    } else if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(event.clientX, event.clientY);
      node = range?.startContainer || null;
      offset = range?.startOffset || 0;
    }

    const coveredTokenEl = event.target instanceof Element
      ? event.target.closest(".token.word.covered")
      : null;
    if (coveredTokenEl && studyView.contains(coveredTokenEl)) {
      const textNode = coveredTokenEl.firstChild;
      const rect = coveredTokenEl.getBoundingClientRect();
      if (textNode?.nodeType === Node.TEXT_NODE && rect.width > 0) {
        const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        return {
          id: coveredTokenEl.dataset.tokenId,
          offset: Math.round(ratio * textNode.textContent.length)
        };
      }
    }

    if (!node) return null;

    const tokenEl = node.nodeType === Node.TEXT_NODE
      ? node.parentElement?.closest(".token.word")
      : node.closest?.(".token.word");

    if (!tokenEl || !studyView.contains(tokenEl)) return null;

    const textNode = tokenEl.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;

    if (node !== textNode) {
      offset = event.clientX < tokenEl.getBoundingClientRect().left + tokenEl.getBoundingClientRect().width / 2
        ? 0
        : textNode.textContent.length;
    }

    return {
      id: tokenEl.dataset.tokenId,
      offset: Math.max(0, Math.min(offset, textNode.textContent.length))
    };
  }

  function compareSelectionPoints(a, b) {
    const ids = wordNodes().map((node) => node.dataset.tokenId);
    const aIndex = ids.indexOf(a.id);
    const bIndex = ids.indexOf(b.id);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.offset - b.offset;
  }

  function customSelectionPartsBetween(anchor, focus) {
    if (!anchor || !focus) return [];

    const [startPoint, endPoint] =
      compareSelectionPoints(anchor, focus) <= 0
        ? [anchor, focus]
        : [focus, anchor];

    const nodes = wordNodes();
    const startIndex = nodes.findIndex((node) => node.dataset.tokenId === startPoint.id);
    const endIndex = nodes.findIndex((node) => node.dataset.tokenId === endPoint.id);
    if (startIndex < 0 || endIndex < 0) return [];

    const parts = [];
    for (let index = startIndex; index <= endIndex; index++) {
      const node = nodes[index];
      const length = node.textContent.length;
      const start = index === startIndex ? startPoint.offset : 0;
      const end = index === endIndex ? endPoint.offset : length;
      if (start < end) {
        parts.push({
          id: node.dataset.tokenId,
          start,
          end
        });
      }
    }
    return parts;
  }

  function updateCustomSelectionVisuals() {
    clearCustomSelectionVisuals();
    if (mode !== "mark" || !cachedSelectionParts.length) return;

    if (!CSS.highlights) {
      const ids = new Set(cachedSelectionParts.map((part) => part.id));
      studyView.querySelectorAll(".token.word").forEach((node) => {
        node.classList.toggle("selected", ids.has(node.dataset.tokenId));
      });
      return;
    }

    const ranges = [];
    cachedSelectionParts.forEach((part) => {
      const node = studyView.querySelector(`[data-token-id="${CSS.escape(part.id)}"]`);
      const textNode = node?.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

      const range = document.createRange();
      range.setStart(textNode, Math.max(0, Math.min(part.start, textNode.textContent.length)));
      range.setEnd(textNode, Math.max(0, Math.min(part.end, textNode.textContent.length)));
      ranges.push(range);
    });

    CSS.highlights.set(customSelectionName, new Highlight(...ranges));
  }

  function selectionPartsFromCurrentSelection() {
    if (mode !== "mark") return [];

    if (cachedSelectionParts.length) return cachedSelectionParts;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return [];
    }

    const range = selection.getRangeAt(0);
    if (!studyView.contains(selection.anchorNode) || !studyView.contains(selection.focusNode)) {
      return [];
    }

    const parts = [];
    studyView.querySelectorAll(".token.word").forEach((node) => {
      const textNode = node.firstChild;
      if (!textNode || !range.intersectsNode(textNode)) return;

      const valueLength = textNode.textContent.length;
      const tokenRange = document.createRange();
      tokenRange.selectNodeContents(textNode);

      let start = 0;
      let end = valueLength;

      if (range.compareBoundaryPoints(Range.START_TO_START, tokenRange) > 0) {
        start = range.startContainer === textNode ? range.startOffset : valueLength;
      }

      if (range.compareBoundaryPoints(Range.END_TO_END, tokenRange) < 0) {
        end = range.endContainer === textNode ? range.endOffset : 0;
      }

      tokenRange.detach();

      if (start < end) {
        parts.push({
          id: node.dataset.tokenId,
          start,
          end
        });
      }
    });
    return parts;
  }

  function updateCachedSelection() {
    if (mode !== "mark") {
      cachedSelectionParts = [];
      updateMarkActions();
      return;
    }

    const parts = selectionPartsFromCurrentSelection();
    if (parts.length) {
      cachedSelectionParts = parts;
      activeTokenId = null;
    }
    updateMarkActions();
  }

  function updateMarkActions() {
    const hasSelection =
      mode === "mark" &&
      hasMarkTarget();

    markActionButtons.forEach((button) => {
      button.disabled = !hasSelection;
    });
  }

  function hasMarkTarget() {
    return Boolean(
      activeTokenId ||
        cachedSelectionParts.length ||
        selectionPartsFromCurrentSelection().length
    );
  }

  function cloneToken(token, value, id = createId("token")) {
    return {
      id,
      value,
      isSpace: token.isSpace,
      wordIndex: token.wordIndex,
      hidden: Boolean(token.hidden),
      hiddenGroup: typeof token.hiddenGroup === "string" ? token.hiddenGroup : null,
      wrong: Boolean(token.wrong),
      hinted: Boolean(token.hinted),
      revealed: Boolean(token.revealed),
      highlight: token.highlight || null
    };
  }

  function fullTokenPartsFromIds(ids, note) {
    return ids
      .map((id) => {
        const token = note.tokens.find((candidate) => candidate.id === id);
        if (!token || token.isSpace) return null;
        return {
          id,
          start: 0,
          end: token.value.length
        };
      })
      .filter(Boolean);
  }

  function hiddenGroupParts(groupId, note) {
    if (!groupId) return [];
    return note.tokens
      .filter((token) => !token.isSpace && token.hiddenGroup === groupId)
      .map((token) => ({
        id: token.id,
        start: 0,
        end: token.value.length
      }));
  }

  function selectedTokenParts(note) {
    const liveParts = selectionPartsFromCurrentSelection();
    if (liveParts.length) return liveParts;
    if (activeTokenId) {
      const activeToken = note.tokens.find((token) => token.id === activeTokenId);
      if (activeToken?.hiddenGroup) {
        return hiddenGroupParts(activeToken.hiddenGroup, note);
      }
      return fullTokenPartsFromIds([activeTokenId], note);
    }
    return cachedSelectionParts;
  }

  function applyToSelectedTokens(action, options = {}) {
    if (mode !== "mark") return;
    const note = currentNote();
    if (!note) return;

    const selectedParts = selectedTokenParts(note);
    const partsById = new Map();
    selectedParts.forEach((part) => {
      const current = partsById.get(part.id);
      if (!current) {
        partsById.set(part.id, part);
        return;
      }
      current.start = Math.min(current.start, part.start);
      current.end = Math.max(current.end, part.end);
    });

    if (!partsById.size) return;

    const context = {
      hiddenGroup: options.groupWhenMultiple && partsById.size > 1 ? createId("group") : null
    };
    const selectedIndexes = note.tokens
      .map((token, index) => (partsById.has(token.id) ? index : -1))
      .filter((index) => index >= 0);
    const firstSelectedIndex = Math.min(...selectedIndexes);
    const lastSelectedIndex = Math.max(...selectedIndexes);

    const nextTokens = [];
    note.tokens.forEach((token, index) => {
      const part = partsById.get(token.id);
      if (token.isSpace && options.includeBetweenSpaces && index > firstSelectedIndex && index < lastSelectedIndex) {
        action(token, context);
        nextTokens.push(token);
        return;
      }
      if (!part || token.isSpace) {
        nextTokens.push(token);
        return;
      }

      const start = Math.max(0, Math.min(part.start, token.value.length));
      const end = Math.max(start, Math.min(part.end, token.value.length));
      if (start === 0 && end === token.value.length) {
        action(token, context);
        nextTokens.push(token);
        return;
      }

      if (start > 0) {
        nextTokens.push(cloneToken(token, token.value.slice(0, start)));
      }

      const selectedToken = cloneToken(token, token.value.slice(start, end), token.id);
      action(selectedToken, context);
      nextTokens.push(selectedToken);

      if (end < token.value.length) {
        nextTokens.push(cloneToken(token, token.value.slice(end)));
      }
    });

    note.tokens = coalesceAdjacentTokens(nextTokens);
    activeTokenId = null;
    cachedSelectionParts = [];
    clearNativeSelection();
    clearCustomSelectionVisuals();
    render();
    updateMarkActions();
  }

  function hideSelected() {
    applyToSelectedTokens((token, context) => {
      token.hidden = true;
      token.hiddenGroup = context.hiddenGroup;
      token.hinted = false;
      token.revealed = false;
    }, { groupWhenMultiple: true });
  }

  function removeHidden() {
    applyToSelectedTokens((token) => {
      token.hidden = false;
      token.hiddenGroup = null;
      token.hinted = false;
      token.revealed = false;
    });
  }

  function toggleHighlight() {
    applyToSelectedTokens((token) => {
      token.highlight = token.highlight === state.highlightColor ? null : state.highlightColor;
    }, { includeBetweenSpaces: true });
  }

  function clearHighlight() {
    applyToSelectedTokens((token) => {
    }, { includeBetweenSpaces: true });
  }

  function hideRevealedWords() {
    if (mode !== "study") return;
    const note = currentNote();
    if (!note) return;

    let changed = false;
    note.tokens.forEach((token) => {
      if (!token.hidden || !token.revealed) return;
      token.hinted = false;
      token.revealed = false;
      changed = true;
    });

    if (changed) {
      render();
    }
  }

  function setHiddenTokenView(note, token, viewState) {
    const nextRevealed = viewState === "revealed";
    const applyState = (candidate) => {
      if (!candidate.hidden) return;
      candidate.hinted = false;
      candidate.revealed = nextRevealed;
    };

    if (token.hiddenGroup) {
      note.tokens.forEach((candidate) => {
        if (candidate.hiddenGroup === token.hiddenGroup) {
          applyState(candidate);
        }
      });
      return;
    }

    applyState(token);
  }

  function setWrongTokenState(note, token, wrongState = !token.wrong) {
    const applyState = (candidate) => {
      if (!candidate.hidden) return;
      candidate.wrong = Boolean(wrongState);
      if (!candidate.wrong && state.reviewWrongOnly) {
        candidate.hinted = false;
        candidate.revealed = false;
      }
    };

    if (token.hiddenGroup) {
      note.tokens.forEach((candidate) => {
        if (candidate.hiddenGroup === token.hiddenGroup) {
          applyState(candidate);
        }
      });
      return;
    }

    applyState(token);
  }

  function toggleWrongToken(note, token) {
    setWrongTokenState(note, token, !token.wrong);
    render();
  }
  function nextHiddenClickState(token) {
    return token.revealed ? "covered" : "revealed";
  }
  function preparePublicData() {
    const publicState = compactState(state);
    publicState.kind = "clozeit-public-data";
    publicState.version = 2;
    publicState.shareId = createId("data");
    publicState.publishedAt = new Date().toISOString();
    publicState.mode = "study";
    publicState.reviewWrongOnly = false;
    publicState.folders.forEach((folder) => {
      folder.notes.forEach((note) => {
        note.marks = note.marks.map(({ wrong, hinted, revealed, ...mark }) => mark);
      });
    });
    return publicState;
  }
  async function publishJsonData() {
    const publicData = preparePublicData();
    const json = `${JSON.stringify(publicData, null, 2)}\n`;
    const fileName = "data.json";

    try {
      const savedToFolder = await saveJsonToExportFolder(fileName, json);
      if (savedToFolder) {
        showModeDetail(`Saved ${fileName} to your export folder. Run the Clozeit publisher to put it online.`);
        return;
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("JSON publish failed. Falling back to download.", error);
      }
    }

    downloadJsonData(fileName, json);
    showModeDetail(`Downloaded ${fileName}. Pick your export folder next time to save it there directly.`);
  }

  async function saveJsonToExportFolder(fileName, json) {
    if (!window.showDirectoryPicker || !window.indexedDB) {
      return false;
    }

    let directoryHandle = exportDirectoryHandle;
    if (directoryHandle && !(await hasExportDirectoryPermission(directoryHandle))) {
      directoryHandle = null;
    }

    if (!directoryHandle) {
      directoryHandle = await window.showDirectoryPicker({
        id: "clozeit-export-folder",
        mode: "readwrite"
      });
      if (!(await hasExportDirectoryPermission(directoryHandle))) {
        return false;
      }
      exportDirectoryHandle = directoryHandle;
      storeExportDirectoryHandle(directoryHandle);
    }

    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
    return true;
  }

  function downloadJsonData(fileName, json) {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function printableFilePart(value) {
    const cleaned = String(value || "Untitled")
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return (cleaned || "Untitled").slice(0, 56);
  }

  function worksheetBlank(value) {
    const answerLength = Array.from(String(value).replace(/\s/g, "")).length;
    const underlineLength = Math.max(8, Math.min(32, answerLength + 3));
    return `[${"_".repeat(underlineLength)}]`;
  }

  function worksheetAtoms(note) {
    const atoms = [];
    const tokens = normalizeSavedTokens(note.text, note.tokens);

    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      if (!token.hidden) {
        atoms.push({ value: token.value, whitespace: token.isSpace });
        continue;
      }

      if (!token.hiddenGroup) {
        atoms.push({ value: worksheetBlank(token.value), whitespace: false });
        continue;
      }

      let answer = token.value;
      let end = index;
      while (end + 1 < tokens.length) {
        let cursor = end + 1;
        let between = "";
        while (cursor < tokens.length && tokens[cursor].isSpace) {
          between += tokens[cursor].value;
          cursor += 1;
        }
        if (cursor >= tokens.length || !tokens[cursor].hidden || tokens[cursor].hiddenGroup !== token.hiddenGroup) {
          break;
        }
        answer += between + tokens[cursor].value;
        end = cursor;
      }

      atoms.push({ value: worksheetBlank(answer), whitespace: false });
      index = end;
    }

    return atoms;
  }

  function wrapPrintableAtoms(atoms, columns = 78) {
    const lines = [""];
    const lineLength = () => lines[lines.length - 1].length;
    const newLine = () => lines.push("");

    atoms.forEach((atom) => {
      if (atom.whitespace) {
        const pieces = atom.value.split(/(\r\n|\r|\n)/);
        pieces.forEach((piece) => {
          if (!piece) return;
          if (/^(\r\n|\r|\n)$/.test(piece)) {
            newLine();
            return;
          }
          lines[lines.length - 1] += piece;
        });
        return;
      }

      if (lineLength() > 0 && lineLength() + atom.value.length > columns) {
        lines[lines.length - 1] = lines[lines.length - 1].replace(/[ \t]+$/, "");
        newLine();
      }
      lines[lines.length - 1] += atom.value;
    });

    return lines.join("\r\n");
  }

  function printableText(note, variant) {
    const isWorksheet = variant === "worksheet";
    const atoms = isWorksheet
      ? worksheetAtoms(note)
      : normalizeSavedTokens(note.text, note.tokens).map((token) => ({
          value: token.value,
          whitespace: token.isSpace
        }));
    const label = isWorksheet ? "CLOZE WORKSHEET" : "ANSWER KEY";
    const title = note.title?.trim() || titleFromText(note.text);
    return `${label}\r\n${title}\r\n${"=".repeat(Math.min(78, Math.max(12, title.length)))}\r\n\r\n${wrapPrintableAtoms(atoms)}\r\n`;
  }

  function downloadTextFile(fileName, text) {
    const blob = new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadPrintTexts() {
    const note = currentNote();
    if (!note) return;

    const stamp = localDateStamp();
    const version = nextExportVersion(stamp);
    const fileBase = `${stamp}-V${version}-${printableFilePart(note.title)}`;
    downloadTextFile(`${fileBase}-worksheet.txt`, printableText(note, "worksheet"));
    downloadTextFile(`${fileBase}-answers.txt`, printableText(note, "answers"));
    showModeDetail(`Downloaded ${fileBase}-worksheet.txt and ${fileBase}-answers.txt.`);
  }
  async function hasExportDirectoryPermission(directoryHandle) {
    const options = { mode: "readwrite" };
    if ((await directoryHandle.queryPermission(options)) === "granted") {
      return true;
    }
    return (await directoryHandle.requestPermission(options)) === "granted";
  }

  function openExportDirectoryDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(EXPORT_DIRECTORY_DB, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(EXPORT_DIRECTORY_STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function loadExportDirectoryHandle() {
    return loadDirectoryHandle(EXPORT_DIRECTORY_KEY);
  }

  async function storeExportDirectoryHandle(directoryHandle) {
    return storeDirectoryHandle(EXPORT_DIRECTORY_KEY, directoryHandle);
  }

  async function loadDirectoryHandle(key) {
    if (!window.indexedDB) return null;
    const db = await openExportDirectoryDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(EXPORT_DIRECTORY_STORE, "readonly");
      const store = transaction.objectStore(EXPORT_DIRECTORY_STORE);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => db.close();
    });
  }

  async function storeDirectoryHandle(key, directoryHandle) {
    if (!window.indexedDB) return;
    try {
      const db = await openExportDirectoryDb();
      const transaction = db.transaction(EXPORT_DIRECTORY_STORE, "readwrite");
      transaction.objectStore(EXPORT_DIRECTORY_STORE).put(directoryHandle, key);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => db.close();
    } catch (error) {
      console.warn("Could not remember folder.", error);
    }
  }
  function localDateStamp(date = new Date()) {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  function nextExportVersion(stamp) {
    let exportRecord = null;
    try {
      exportRecord = JSON.parse(localStorage.getItem(EXPORT_VERSION_KEY));
    } catch (error) {
      exportRecord = null;
    }

    const nextVersion = exportRecord?.stamp === stamp ? Number(exportRecord.version) + 1 : 1;
    const safeVersion = Number.isFinite(nextVersion) && nextVersion > 0 ? nextVersion : 1;
    localStorage.setItem(EXPORT_VERSION_KEY, JSON.stringify({ stamp, version: safeVersion }));
    return safeVersion;
  }

  function handlePaste(event) {
    const target = event.target;
    const typingTarget =
      target === titleEl ||
      target === rawEditor ||
      target.isContentEditable;

    if (typingTarget) return;

    const text = event.clipboardData.getData("text/plain");
    if (!text.trim()) return;

    event.preventDefault();
    const note = currentNote();
    if (!note || note.text.trim()) {
      createNote(text);
      setMode("mark");
      return;
    }
    updateCurrentText(text);
    setMode("mark");
  }

  function clearMarkSelection() {
    activeTokenId = null;
    cachedSelectionParts = [];
    clearNativeSelection();
    clearCustomSelectionVisuals();
    updateMarkActions();
  }

  function shortcutFromEvent(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return "";
    if (event.code === "Digit1" || event.code === "Numpad1") return "hide";
    if (event.code === "Digit2" || event.code === "Numpad2") return "unhide";
    if (event.code === "Digit3" || event.code === "Numpad3") return "highlight";
    if (event.key === "1") return "hide";
    if (event.key === "2") return "unhide";
    if (event.key === "3") return "highlight";
    return event.key.length === 1 ? event.key.toLowerCase() : "";
  }

  function isModeCycleShortcut(event) {
    return (
      event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      (event.code === "Space" || event.key === " ")
    );
  }

  function cycleMarkEditMode() {
    setMode(mode === "edit" ? "mark" : "edit");
  }

  foldersEl.addEventListener("click", (event) => {
    const renameButton = event.target.closest("[data-rename-folder-id]");
    const deleteButton = event.target.closest("[data-delete-folder-id]");
    const folderButton = event.target.closest("[data-folder-id]");
    const noteButton = event.target.closest("[data-note-id]");
    if (renameButton) {
      renameFolder(renameButton.dataset.renameFolderId);
      return;
    }
    if (deleteButton) {
      deleteFolder(deleteButton.dataset.deleteFolderId);
      return;
    }
    if (noteButton) {
      setCurrentNote(noteButton.dataset.noteId);
      return;
    }
    if (folderButton) {
      setCurrentFolder(folderButton.dataset.folderId);
    }
  });

  studyView.addEventListener("click", (event) => {
    if (mode === "edit") return;

    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    if (hasStudySelection()) {
      activeTokenId = null;
      return;
    }

    const tokenEl = event.target.closest(".token.word");
    if (!tokenEl) {
      clearMarkSelection();
      render();
      return;
    }

    const note = currentNote();
    const token = note.tokens.find((candidate) => candidate.id === tokenEl.dataset.tokenId);
    if (!token) return;

    activeTokenId = mode === "mark" ? token.id : null;
    cachedSelectionParts = [];
    if (token.hidden) {
      if (longPressHandled) {
        longPressHandled = false;
        return;
      }
      if (mode === "study" && event.shiftKey) {
        event.preventDefault();
        toggleWrongToken(note, token);
        updateMarkActions();
        return;
      }
      if (shouldReviewHiddenToken(token)) {
        setHiddenTokenView(note, token, nextHiddenClickState(token));
      }
    }
    render();
    updateMarkActions();
  });

  studyView.addEventListener("pointerdown", (event) => {
    lastPointerType = event.pointerType || "mouse";
    if (mode === "edit") return;
    if (mode === "study" && event.pointerType !== "mouse") {
      const tokenEl = event.target.closest(".token.hidden");
      if (tokenEl) {
        const note = currentNote();
        const token = note?.tokens.find((candidate) => candidate.id === tokenEl.dataset.tokenId);
        if (token) {
          clearTimeout(longPressTimer);
          longPressHandled = false;
          longPressTimer = setTimeout(() => {
            if (token.revealed) {
              setWrongTokenState(note, token, !token.wrong);
            } else {
              setHiddenTokenView(note, token, "revealed");
            }
            longPressHandled = true;
            render();
          }, 520);
        }
      }
    }
    if (mode !== "mark" || event.button !== 0) {
      focusWithoutScroll(studyView);
      return;
    }

    const point = caretPointFromEvent(event);
    if (!point) return;

    event.preventDefault();
    focusWithoutScroll(studyView);
    clearNativeSelection();
    clearCustomSelectionVisuals();
    customSelecting = true;
    customSelectionMoved = false;
    customSelectionAnchor = point;
    activeTokenId = null;
    cachedSelectionParts = [];
  });

  document.addEventListener("pointermove", (event) => {
    if (!customSelecting) return;

    event.preventDefault();
    const point = caretPointFromEvent(event);
    if (!point) return;

    const parts = customSelectionPartsBetween(customSelectionAnchor, point);
    if (parts.length) {
      customSelectionMoved = true;
      cachedSelectionParts = parts;
      activeTokenId = null;
      updateCustomSelectionVisuals();
      updateMarkActions();
    }
    clearNativeSelection();
  });

  document.addEventListener("pointerup", (event) => {
    clearTimeout(longPressTimer);
    if (!customSelecting) return;

    event.preventDefault();
    customSelecting = false;
    suppressNextClick = customSelectionMoved;
    customSelectionMoved = false;
    customSelectionAnchor = null;
    clearNativeSelection();
    updateCustomSelectionVisuals();
    updateMarkActions();
  });

  document.addEventListener("pointercancel", () => {
    clearTimeout(longPressTimer);
    longPressHandled = false;
  });

  studyView.addEventListener("contextmenu", (event) => {
    if (mode !== "study") return;
    const tokenEl = event.target.closest(".token.hidden");
    if (!tokenEl) return;

    event.preventDefault();
    if (lastPointerType !== "mouse" || longPressHandled) return;
    const note = currentNote();
    const token = note?.tokens.find((candidate) => candidate.id === tokenEl.dataset.tokenId);
    if (!token) return;

    toggleWrongToken(note, token);
  });

  ["contextmenu", "copy", "cut", "dragstart", "selectstart"].forEach((eventName) => {
    studyView.addEventListener(eventName, (event) => {
      if (mode !== "study") return;
      event.preventDefault();
    });
  });

  titleEl.addEventListener("input", () => {
    const note = currentNote();
    if (!note) return;
    note.title = titleEl.value.trim() || "Untitled";
    saveState();
    renderNavigation();
  });

  rawEditor.addEventListener("beforeinput", (event) => {
    if (rawEditTouchesHidden(event)) {
      event.preventDefault();
      warnProtectedHiddenEdit();
    }
  });

  rawEditor.addEventListener("input", () => {
    const note = currentNote();
    if (!note) return;
    const previousText = note.text;
    const nextText = rawEditor.value;
    const nextTokens = mergeTokenState(nextText, note.tokens);
    const hiddenWasLost = note.tokens.some((token) => token.hidden) &&
      !nextTokens.some((token) => token.hidden);

    if (hiddenWasLost) {
      note.text = previousText;
      rawEditor.value = lastSafeRawText || previousText;
      warnProtectedHiddenEdit();
      return;
    }

    note.text = rawEditor.value;
    note.tokens = coalesceAdjacentTokens(nextTokens);
    lastSafeRawText = note.text;
    saveState();
    renderNavigation();
  });

  creditsBtn.addEventListener("click", () => {
    if (typeof creditsDialog.showModal === "function") {
      creditsDialog.showModal();
    } else {
      creditsDialog.setAttribute("open", "");
    }
  });
  addFolderBtn.addEventListener("click", createFolder);
  newNoteBtn.addEventListener("click", () => createNote(""));
  deleteNoteBtn.addEventListener("click", deleteCurrentNote);
  hideRevealedBtn.addEventListener("click", hideRevealedWords);
  wrongOnlyBtn.addEventListener("click", () => {
    if (mode !== "study") return;
    state.reviewWrongOnly = !state.reviewWrongOnly;
    const note = currentNote();
    if (state.reviewWrongOnly && note) {
      note.tokens.forEach((token) => {
        if (token.hidden && token.wrong) {
          token.hinted = false;
          token.revealed = false;
        }
      });
    }
    render();
    setMode(mode);
  });
  downloadPrintBtn.addEventListener("click", downloadPrintTexts);
  publishJsonBtn.addEventListener("click", publishJsonData);
  markHideBtn.addEventListener("click", hideSelected);
  markUnhideBtn.addEventListener("click", removeHidden);
  markHighlightBtn.addEventListener("click", toggleHighlight);
  markClearBtn.addEventListener("click", clearHighlight);
  markActionButtons.forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
  });
  document.addEventListener("paste", handlePaste);

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.highlightColor = normalizeHighlightColor(button.dataset.color);
      setMode(mode);
    });
  });

  document.addEventListener("selectionchange", updateCachedSelection);

  function handleShortcutKeydown(event) {
    const target = event.target;
    if (isModeCycleShortcut(event)) {
      event.preventDefault();
      cycleMarkEditMode();
      return;
    }

    if (mode !== "mark") return;

    const shortcut = shortcutFromEvent(event);
    if (!shortcut) return;

    const isTyping =
      target === titleEl ||
      target === rawEditor ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable;

    if (isTyping && !hasMarkTarget()) return;

    if (shortcut === "hide") {
      event.preventDefault();
      hideSelected();
    }

    if (shortcut === "unhide") {
      event.preventDefault();
      removeHidden();
    }

    if (shortcut === "highlight") {
      event.preventDefault();
      toggleHighlight();
    }
  }

  window.addEventListener("keydown", handleShortcutKeydown, true);

  loadExportDirectoryHandle()
    .then((handle) => {
      exportDirectoryHandle = handle;
    })
    .catch((error) => {
      console.warn("Could not load remembered export folder.", error);
    });

  render();
  setMode(mode);
})();
