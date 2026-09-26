(function () {
  const STORAGE_KEY = "clozeit-state-v1";
  const EXPORT_VERSION_KEY = "clozeit-export-version-v1";
  const EXPORT_DIRECTORY_DB = "clozeit-export-directory-v1";
  const EXPORT_DIRECTORY_STORE = "handles";
  const EXPORT_DIRECTORY_KEY = "export-directory";
  const PUBLISH_DIRECTORY_KEY = "publish-directory";
  const FALLBACK_FAVICON_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAIdUlEQVR4AcRXeVDU9xX//BbWg1OirBDtJFXxiIkdScapph5Aq0ZrEqIihzNWQCMlsSYBdjkjh5LREI0BhMaUa0ExcqgspxnBaGyLjO0oFGyTGq6ACkkVOWW3731/u8vCZNr8YSa/2fd95/d93/d93/dYhV6vN+j1Px0oYPHduXMHSUlJ2LhxIzw9Pf8veHh6wARmew8PYz8Tlv2wz8TERHR3d1uMCJgDqKurgwd1VjlPx8d/TEe57izBOQuYyJ9Dhe68Gcp152Tb8vMyJp0sk/ud+DgDri4qeHl5oba21hyECICjCgkJQdn5UgQF7cTMmTOhVCoJrC1gIm+p+1+03E+lcsbOnTugKytFaGgourq6RBAigMzMTOx9MxSzZ89CZWUVcnLyHitkG/2dKjwNR0dHvPXWXmRkZIwF0NDQgHXr1+Gj1HT09H6HufPmYx7BnLlumOe2AEwzZvlEmCh3I3u2cZu/EKxzc1sIljHt5DQDh98/gnVr16Kh4dpYAENDQ7C1tUFvTy8WL34WdnZ2sLW3g729PcltYWfEzLPOhB3sHYSeeVtbW2FvY8I2NmBbG/LLmPUuri4YHR0VfYaGhscCkJg0APRDf38/c4AeMBhIIknQ6/VgG8YsYyAlaPMSMgjgTixnMNGMSUmI/FDb96AP7IM8Eyf/FGJUGoQ7vvP2Plyr/wvVQbmAqqoKVFboUFVZgYqKclRXVYJlVZWkJ51MVwhZJemZZ1zJeuIZVzDN/ct1qCffEeFvyyMbW4WYGjEcmaOjA/bufQMadTg0GgLGDEwTqNVhQhcREQ41QUR4GFjGWKOJwBh+h/obebURU/99f3gTTk5OxjlzTjF2DnAAFMf3/r5Vx2C0qxtHj36EsDANwiMiERkVC7UmGppIxlGEYwSwLCr6XYSrIxEdQ5hsGUeooynYaLG7RATGkRRGbFwbEwdcufIFOjo7hWC4/hpG7t5Fe3sHArZvR0BAALZt2wZ/fz/4+vrCz89f8Ewz+Pj4IMA/AFu3bsV2smeesZ+/P/75ry/Jp4ESLxGGnAFJkqhWDELATWracazx+DV13sEsgQSJ1FRuRIM6UxlRger1JCEM+riGCImfJFq5YbkkSWKCTBtMfYxG5gzI5sDt218jOjoWx44dxY0bN+RsKSQoFApMm+aIgoICnCwsxJkzZ3Dq1EkUFxcLGeP8/HyUlpZAS7ioqAjavDyUlBRDq9UKu+zsLLzwwlKaLMyfOQCOjqVHPzxGqfVFyJ7dcHV9kqcK0AxAX2xMFA4eiMf+uGjExkQifn8coqPUSEiIQ0y0BokJ7yKSipExy5OS4gWfEB+HqMgIfJByCN7er5InA7mUUzAugEePHtGsCulYfoOMgN9u3GA2pEiEjO+IqVOnYBxMmcCTXqm0RnNz8zg7Kysr4UNPyyZJ3xNA/bUGqFQqLFq0UBgmJycJTFHAQIeRzPywlg+06poLwrivrw+HD6cImhsD1QFjBgU3DLwEV6/+GatXrWJ2PFAN0Bk6XmbkOjo6MTAwYOSATto5d+/chYODA9QRYULOu6e55ZaguTEY+GS1zIAxHTdvNmLJL5awzTiQJIrz0aio5Ni4/aJQe+jeCAzajYWLnkVZmU7YNzX9A96vbcUr3pthoDRv8w0Q8sHBQYwMD1MhlmDX7j0YHBwC5PGN2xDyxztgzpyfy4xla01rR0uQm6dFY2MTfP0C0HLrFtXIS/jViyvoBeQhrOMTknDkSIq4hECTamtrpzpowfspR1B69hyKS0qx83c7MGmSUthzQ1NjJENPTw9Uzs4yY9FKVDwGCkC8E7I/gS8dQu3kvJuecP++fZu2ayP4Rr106RId1ZE49N5BUbPcp7PzG8x3c6NDaQttyxysWLFcZEeS5BSMC4CdKOklZDG2WF8DnQGDtM7W1kpx5VpTRu4/eIDk5EM4cCARS5Y8h9bWVixfvhyffVaNBQsX4E9Z2QCN4em5hgbfjP6HD2H6aHVMpHEJjNHw1rp//4FZycSePaGEJAzTGhqoeHjgvLx8PP30U1i3bi02v+ZNazqI058WUZ2O0hNOiQMH3xP60VE99QUc6QC7RzUjGGoMFhGMy4CrqyutbQuZyL+Ghuu4d68HkpUC9pMnQ2ltTY7nISg4EDPpjXf58mW8tGETtmyle8HPV7wlli1bgR5aSi96MZsGUjmr0NHRLjs1tpJE6SF6XADPP++OoqISEkM4C/l9KEJCXoeV8wyMtrdDRy/f1q+/QhAdUM898wwuf16HtNRj+JxewE/RW49fwYWF+Tiengp977fIzkwXvnjJTheehP67/wjeshkXgK+vDz08KrF5sw9+uXwlZs+aRZW+ATY+W3CfruKBT4sxGLgbXWt+g66VXphSdQFP5GjRtexFfEPQF6aBy80m9IbsFbzT9p3oyzyBkaZm/KysAt1e6wFxCBmoPCwyMJnSO0B7dTHN6oOUw7j+t7/D3X0pcnOzQJaYsmYVptH5P3hehymrV+LJxutwjNFgsKoaGB6BS90FuNZ/ASsXFzzML4Ry7hy4Xv8rZhTkYOjKVfQEvY7Rtjaozp4B6FDr7x+A0rgVRQbc3d1RW1sH/kJDQ/DVly3Izjoh72cWEkx9ZROma7NgF7oHEu2UqRvWY3rOCUxLToAVPTYVTtPgEBmOGadyYR+2Dwp7O0yiQ2167idwuVqHJ9I+hBU9+8kVLtbWwn2pO5MQAQQHB+P48UzzA0RofqSGz4X0tAwE7woWI4gA+J9Qeno6Nm3yhlZbICp/ZGQEjxN4N2nzC7Dp5VeRmpYGHpMjEAEwsYouoZqaGrS2dSAwcBdtr5cfKwTSvdHa2oHqqhqsXr2ahxRgDoA5FV3FsbGx0JWX4+LFi48FTH50Oh3Yt2qmiocyw38BAAD///Pc8IgAAAAGSURBVAMAV4XYncAZJfAAAAAASUVORK5CYII=";

  const foldersEl = document.getElementById("folders");
  const titleEl = document.getElementById("note-title");
  const studyView = document.getElementById("study-view");
  const rawEditor = document.getElementById("raw-editor");
  const addFolderBtn = document.getElementById("add-folder");
  const newNoteBtn = document.getElementById("new-note");
  const deleteNoteBtn = document.getElementById("delete-note");
  const hideRevealedBtn = document.getElementById("hide-revealed");
  const wrongOnlyBtn = document.getElementById("wrong-only");
  const exportShareBtn = document.getElementById("export-share");
  const publishJsonBtn = document.getElementById("publish-json");
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
  let publishDirectoryHandle = null;
  let faviconDataUri = "";
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
          note.tokens = normalizeSavedTokens(note.text, note.tokens);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  function tokenize(text) {
    const parts = text.match(/\s+|[^\s]+/g) || [];
    let wordIndex = 0;
    return parts.map((value, index) => {
      const isSpace = /^\s+$/.test(value);
      return {
        id: `t-${index}`,
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

  function plainToken(value) {
    const isSpace = /^\s+$/.test(value);
    return {
      id: createId("token"),
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

  function tokenizeSegment(text) {
    if (!text) return [];
    return tokenize(text).map((token) => plainToken(token.value));
  }

  function tokenizeInsertedSegment(text) {
    return tokenizeSegment(text);
  }

  function normalizeTokenIndexes(tokens) {
    let wordIndex = 0;
    tokens.forEach((token) => {
      token.isSpace = /^\s+$/.test(token.value);
      token.wordIndex = token.isSpace ? null : wordIndex++;
      if (token.isSpace) {
        token.hidden = false;
        token.hiddenGroup = null;
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

  function normalizeSavedTokens(text, tokens) {
    if (!Array.isArray(tokens)) return tokenize(text);

    const savedText = tokens.map((token) => token.value || "").join("");
    if (savedText !== text) {
      return mergeTokenState(text, tokens);
    }

    let wordIndex = 0;
    return tokens.map((token, index) => {
      const value = typeof token.value === "string" ? token.value : "";
      const isSpace = /^\s+$/.test(value);
      return {
        id: token.id || `t-${index}`,
        value,
        isSpace,
        wordIndex: isSpace ? null : wordIndex++,
        hidden: Boolean(token.hidden),
        hiddenGroup: typeof token.hiddenGroup === "string" ? token.hiddenGroup : null,
        wrong: Boolean(token.wrong),
        hinted: Boolean(token.hinted),
        revealed: Boolean(token.revealed),
        highlight: normalizeTokenHighlight(token.highlight)
      };
    });
  }

  function mergeTokenState(text, oldTokens) {
    const normalizedOldTokens = Array.isArray(oldTokens)
      ? oldTokens.map((token, index) => normalizeToken(token, `old-${index}`))
      : [];
    const oldText = normalizedOldTokens.map((token) => token.value).join("");
    if (!oldText) return tokenize(text);
    if (oldText === text) return normalizeSavedTokens(text, normalizedOldTokens);

    const oldTextOffset = text.indexOf(oldText);
    const occupied = [];
    const remappedMarks = tokenRanges(normalizedOldTokens)
      .filter(({ token }) => !token.isSpace && hasMarkState(token))
      .map(({ token, start }) => {
        const estimatedStart = oldTextOffset >= 0 ? oldTextOffset + start : start;
        const matchStart = findBestNonOverlappingMatch(text, token.value, estimatedStart, occupied);
        if (matchStart < 0) return null;
        const match = {
          start: matchStart,
          end: matchStart + token.value.length,
          token
        };
        occupied.push(match);
        return match;
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start);

    if (!remappedMarks.length) return tokenize(text);

    const nextTokens = [];
    let cursor = 0;
    remappedMarks.forEach((mark) => {
      if (mark.start < cursor) return;
      nextTokens.push(...tokenizeInsertedSegment(text.slice(cursor, mark.start)));
      nextTokens.push(cloneToken(mark.token, text.slice(mark.start, mark.end), mark.token.id));
      cursor = mark.end;
    });
    nextTokens.push(...tokenizeInsertedSegment(text.slice(cursor)));

    return normalizeTokenIndexes(nextTokens);
  }

  function findBestNonOverlappingMatch(text, value, estimatedStart, occupied) {
    if (!value) return -1;

    let bestIndex = -1;
    let bestDistance = Infinity;
    let index = text.indexOf(value);

    while (index >= 0) {
      const end = index + value.length;
      const overlaps = occupied.some((range) => index < range.end && end > range.start);
      if (!overlaps) {
        const distance = Math.abs(index - estimatedStart);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      }
      index = text.indexOf(value, index + 1);
    }

    return bestIndex;
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

    note.tokens.forEach((token) => {
      if (token.isSpace && !token.highlight) {
        studyView.appendChild(document.createTextNode(token.value));
        return;
      }

      const span = document.createElement("span");
      span.className = tokenClass(token);
      span.dataset.tokenId = token.id;
      span.textContent = token.value;
      studyView.appendChild(span);
    });
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

    note.tokens = nextTokens;
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
function prepareShareState() {
    const shareState = JSON.parse(JSON.stringify(state));
    shareState.version = 1;
    shareState.shareId = createId("share");
    shareState.exportedAt = new Date().toISOString();
    shareState.mode = "study";
    shareState.reviewWrongOnly = false;
    shareState.folders.forEach((folder) => {
      folder.notes.forEach((note) => {
        note.tokens = normalizeSavedTokens(note.text, note.tokens).map((token) => ({
          ...token,
          hinted: false,
          revealed: false,
          hiddenGroup: token.hidden ? token.hiddenGroup : null,
          wrong: false
        }));
      });
    });
    return shareState;
  }

  function sharePageHtml(shareState) {
    const stateJson = JSON.stringify(shareState).replace(/</g, "\\u003c");
    const faviconHref = faviconDataUri || FALLBACK_FAVICON_DATA_URI;
    const faviconLink = `<link rel="icon" type="image/png" href="${faviconHref}">`;
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Clozeit Study Share</title>
    ${faviconLink}
    <style>
      :root {
        color-scheme: dark;
        --bg: #0b0f14;
        --panel: #121820;
        --panel-2: #0f141b;
        --line: #26313d;
        --text: #eef2f6;
        --muted: #9aa7b4;
        --accent: #7dd3fc;
        --accent-soft: rgba(125, 211, 252, 0.12);
        --highlight-yellow: rgba(244, 211, 94, 0.38);
        --highlight-green: rgba(136, 209, 138, 0.34);
        --highlight-blue: rgba(121, 184, 255, 0.34);
        --highlight-pink: rgba(244, 160, 200, 0.34);
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
      }

      body {
        display: grid;
        grid-template-columns: minmax(190px, 260px) minmax(0, 1fr);
        background: var(--bg);
        color: var(--text);
        font-family: Arial, Helvetica, sans-serif;
      }

      button {
        border: 1px solid var(--line);
        border-radius: 6px;
        min-height: 34px;
        padding: 6px 10px;
        background: #151c25;
        color: var(--text);
        font: inherit;
        cursor: pointer;
      }

      button:hover,
      button.active {
        border-color: var(--accent);
        background: var(--accent-soft);
        color: var(--accent);
      }

      .sidebar {
        min-height: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--line);
        background: var(--panel);
      }

      .sidebar-header,
      .topbar {
        min-height: 58px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--line);
      }

      h1 {
        margin: 0;
        font-size: 18px;
      }

      .folders {
        min-height: 0;
        overflow: auto;
        padding: 10px;
      }

      .folder {
        margin-bottom: 12px;
      }

      .folder-name {
        margin: 2px 0 6px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .note-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 5px;
        text-align: left;
      }

      .count {
        color: var(--muted);
      }

      .workspace {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .note-title {
        min-width: 0;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 18px;
        font-weight: 700;
      }

      .study-view {
        min-height: 0;
        flex: 1;
        overflow: auto;
        padding: 28px;
        background: var(--bg);
        color: var(--text);
        font-size: 19px;
        line-height: 1.8;
        white-space: pre-wrap;
        tab-size: 4;
        user-select: none;
        -webkit-user-select: none;
      }

      .token {
        border-radius: 2px;
        display: inline;
        line-height: inherit;
        padding: 0;
        color: inherit;
      }

      .token.covered,
      .token.hidden.revealed {
        cursor: pointer;
      }

      #wrong-only.active {
        border-color: var(--accent);
        background: var(--accent-soft);
        color: var(--accent);
      }

      .token.wrong {
        text-decoration-line: underline;
        text-decoration-style: dotted;
        text-decoration-color: #f87171;
        text-decoration-thickness: 2px;
        text-underline-offset: 0.32em;
      }

      .token.covered {
        background: transparent;
        color: transparent;
        box-shadow: inset 0 -1px 0 rgba(237, 241, 244, 0.55);
      }
.token.hidden.revealed {
        user-select: none;
      }

      .token.highlight-yellow:not(.covered),
      .token.highlight-green:not(.covered),
      .token.highlight-blue:not(.covered),
      .token.highlight-pink:not(.covered) {
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
      }

      .token.highlight-yellow:not(.covered) {
        background: linear-gradient(to top, var(--highlight-yellow) 0 58%, transparent 58%);
      }

      .token.highlight-green:not(.covered) {
        background: linear-gradient(to top, var(--highlight-green) 0 58%, transparent 58%);
      }

      .token.highlight-blue:not(.covered) {
        background: linear-gradient(to top, var(--highlight-blue) 0 58%, transparent 58%);
      }

      .token.highlight-pink:not(.covered) {
        background: linear-gradient(to top, var(--highlight-pink) 0 58%, transparent 58%);
      }

      .empty {
        color: var(--muted);
      }

      .nav-toggle,
      .drawer-overlay {
        display: none;
      }

      @media (max-width: 720px) {
        body {
          grid-template-columns: 1fr;
          grid-template-rows: minmax(0, 1fr);
        }

        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 20;
          width: min(84vw, 320px);
          max-height: none;
          transform: translateX(-100%);
          transition: transform 160ms ease;
          border-right: 1px solid var(--line);
          box-shadow: 16px 0 40px rgba(0, 0, 0, 0.35);
        }

        body.nav-open .sidebar {
          transform: translateX(0);
        }

        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 10;
          display: block;
          background: rgba(0, 0, 0, 0.48);
        }

        .drawer-overlay[hidden] {
          display: none;
        }

        .workspace {
          min-height: 100vh;
        }

        .topbar {
          min-height: 54px;
          padding: 10px;
        }

        .nav-toggle {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
        }

        .note-title {
          font-size: 16px;
        }

        #hide-revealed {
          flex: 0 0 auto;
        }

        .study-view {
          padding: 18px;
          font-size: 17px;
        }
      }
    </style>
  </head>
  <body>
    <aside class="sidebar" aria-label="Notes navigation">
      <header class="sidebar-header">
        <h1>Clozeit</h1>
      </header>
      <div id="folders" class="folders"></div>
    </aside>
    <div id="drawer-overlay" class="drawer-overlay" hidden></div>

    <main class="workspace">
      <header class="topbar">
        <button id="nav-toggle" class="nav-toggle" type="button" aria-expanded="false" aria-controls="folders">Notes</button>
        <div id="note-title" class="note-title"></div>
        <button id="hide-revealed" type="button">Hide revealed</button>
        <button id="wrong-only" type="button" aria-pressed="false">Wrong only</button>
      </header>
      <article id="study-view" class="study-view" tabindex="0" aria-label="Study note"></article>
    </main>

    <script>
      (function () {
        const INITIAL_STATE = ${stateJson};
        const STORAGE_KEY = 'clozeit-share-state-' + INITIAL_STATE.shareId;
        const foldersEl = document.getElementById('folders');
        const titleEl = document.getElementById('note-title');
        const studyView = document.getElementById('study-view');
        const hideRevealedBtn = document.getElementById('hide-revealed');
        const wrongOnlyBtn = document.getElementById('wrong-only');
        const navToggleBtn = document.getElementById('nav-toggle');
        const drawerOverlay = document.getElementById('drawer-overlay');
        let state = loadState();
        let lastPointerType = 'mouse';
        let longPressTimer = null;
        let longPressHandled = false;

        function clone(value) {
          return JSON.parse(JSON.stringify(value));
        }

        function loadState() {
          try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && saved.shareId === INITIAL_STATE.shareId && Array.isArray(saved.folders)) {
              return saved;
            }
          } catch (error) {
          }
          return clone(INITIAL_STATE);
        }

        function saveState() {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          } catch (error) {
          }
        }

        function isMobileLayout() {
          return window.matchMedia('(max-width: 720px)').matches;
        }

        function setDrawerOpen(open) {
          const nextOpen = Boolean(open) && isMobileLayout();
          document.body.classList.toggle('nav-open', nextOpen);
          drawerOverlay.hidden = !nextOpen;
          navToggleBtn.setAttribute('aria-expanded', String(nextOpen));
        }

        function currentFolder() {
          return state.folders.find(function (folder) {
            return folder.id === state.currentFolderId;
          }) || state.folders[0];
        }

        function currentNote() {
          const folder = currentFolder();
          if (!folder) return null;
          return folder.notes.find(function (note) {
            return note.id === state.currentNoteId;
          }) || folder.notes[0] || null;
        }

        function hiddenCount(note) {
          const count = note.tokens.filter(function (token) {
            return token.hidden;
          }).length;
          return count ? String(count) : '';
        }

        function setCurrentNote(folderId, noteId) {
          state.currentFolderId = folderId;
          state.currentNoteId = noteId;
          render();
        }

        function tokenClass(token) {
          const classes = ['token', token.isSpace ? 'space' : 'word'];
          const reviewHidden = shouldReviewHiddenToken(token);
          if (token.hidden) classes.push('hidden');
          if (token.wrong) classes.push('wrong');
          if (reviewHidden && !token.revealed) classes.push('covered');
          if (token.revealed || (token.hidden && !reviewHidden)) classes.push('revealed');
          if (token.highlight) classes.push('highlight-' + token.highlight);
          return classes.join(' ');
        }

        function shouldReviewHiddenToken(token) {
          return Boolean(token.hidden && (!state.reviewWrongOnly || token.wrong));
        }

        function setHiddenTokenView(note, token, viewState) {
          const nextRevealed = viewState === 'revealed';
          const applyState = function (candidate) {
            if (!candidate.hidden) return;
            candidate.hinted = false;
            candidate.revealed = nextRevealed;
          };

          if (token.hiddenGroup) {
            note.tokens.forEach(function (candidate) {
              if (candidate.hiddenGroup === token.hiddenGroup) {
                applyState(candidate);
              }
            });
            return;
          }

          applyState(token);
        }

        function setWrongTokenState(note, token, wrongState) {
          const applyState = function (candidate) {
            if (!candidate.hidden) return;
            candidate.wrong = Boolean(wrongState);
            if (!candidate.wrong && state.reviewWrongOnly) {
              candidate.hinted = false;
              candidate.revealed = false;
            }
          };

          if (token.hiddenGroup) {
            note.tokens.forEach(function (candidate) {
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
          return token.revealed ? 'covered' : 'revealed';
        }
function renderNavigation() {
          foldersEl.replaceChildren();
          state.folders.forEach(function (folder) {
            const section = document.createElement('section');
            section.className = 'folder';

            const name = document.createElement('div');
            name.className = 'folder-name';
            name.textContent = folder.name || 'Folder';
            section.appendChild(name);

            folder.notes.forEach(function (note) {
              const button = document.createElement('button');
              button.type = 'button';
              button.className = 'note-row' + (note.id === state.currentNoteId ? ' active' : '');
              button.dataset.folderId = folder.id;
              button.dataset.noteId = note.id;

              const label = document.createElement('span');
              label.textContent = note.title || 'Untitled';
              button.appendChild(label);

              const count = document.createElement('span');
              count.className = 'count';
              count.textContent = hiddenCount(note);
              button.appendChild(count);

              section.appendChild(button);
            });

            foldersEl.appendChild(section);
          });
        }

        function renderNote() {
          const note = currentNote();
          studyView.replaceChildren();
          titleEl.textContent = note ? note.title || 'Untitled' : 'Untitled';

          if (!note || !note.text.trim()) {
            const empty = document.createElement('p');
            empty.className = 'empty';
            empty.textContent = 'No text in this note';
            studyView.appendChild(empty);
            return;
          }

          note.tokens.forEach(function (token) {
            if (token.isSpace && !token.highlight) {
              studyView.appendChild(document.createTextNode(token.value));
              return;
            }

            const span = document.createElement('span');
            span.className = tokenClass(token);
            span.dataset.tokenId = token.id;
            span.textContent = token.value;
            studyView.appendChild(span);
          });
        }

        function render() {
          renderNavigation();
          renderNote();
          wrongOnlyBtn.classList.toggle('active', Boolean(state.reviewWrongOnly));
          wrongOnlyBtn.setAttribute('aria-pressed', String(Boolean(state.reviewWrongOnly)));
          saveState();
        }

        foldersEl.addEventListener('click', function (event) {
          const button = event.target.closest('[data-note-id]');
          if (!button) return;
          setCurrentNote(button.dataset.folderId, button.dataset.noteId);
          setDrawerOpen(false);
        });

        navToggleBtn.addEventListener('click', function () {
          setDrawerOpen(!document.body.classList.contains('nav-open'));
        });

        drawerOverlay.addEventListener('click', function () {
          setDrawerOpen(false);
        });

        window.addEventListener('resize', function () {
          if (!isMobileLayout()) setDrawerOpen(false);
        });

        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') setDrawerOpen(false);
        });

        studyView.addEventListener('click', function (event) {
          const tokenEl = event.target.closest('.token.hidden');
          if (!tokenEl) return;

          const note = currentNote();
          if (!note) return;

          const token = note.tokens.find(function (candidate) {
            return candidate.id === tokenEl.dataset.tokenId;
          });
          if (!token) return;

          if (longPressHandled) {
            longPressHandled = false;
            return;
          }

          if (event.shiftKey) {
            event.preventDefault();
            toggleWrongToken(note, token);
            return;
          }

          if (!shouldReviewHiddenToken(token)) return;

          const isTouchLike = lastPointerType !== 'mouse' || window.matchMedia('(pointer: coarse)').matches;
          setHiddenTokenView(note, token, nextHiddenClickState(token));
          render();
        });

        studyView.addEventListener('pointerdown', function (event) {
          lastPointerType = event.pointerType || 'mouse';
          if (event.pointerType === 'mouse') return;

          const tokenEl = event.target.closest('.token.hidden');
          if (!tokenEl) return;

          const note = currentNote();
          if (!note) return;

          const token = note.tokens.find(function (candidate) {
            return candidate.id === tokenEl.dataset.tokenId;
          });
          if (!token) return;

          clearTimeout(longPressTimer);
          longPressHandled = false;
          longPressTimer = setTimeout(function () {
            if (token.revealed) {
              setWrongTokenState(note, token, !token.wrong);
            } else {
              setHiddenTokenView(note, token, 'revealed');
            }
            longPressHandled = true;
            render();
          }, 520);
        });

        ['pointerup', 'pointercancel'].forEach(function (eventName) {
          studyView.addEventListener(eventName, function () {
            clearTimeout(longPressTimer);
          });
        });


        studyView.addEventListener('contextmenu', function (event) {
          const tokenEl = event.target.closest('.token.hidden');
          if (!tokenEl) return;

          event.preventDefault();
          if (lastPointerType !== 'mouse' || longPressHandled) return;
          const note = currentNote();
          if (!note) return;

          const token = note.tokens.find(function (candidate) {
            return candidate.id === tokenEl.dataset.tokenId;
          });
          if (!token) return;

          toggleWrongToken(note, token);
        });

        hideRevealedBtn.addEventListener('click', function () {
          const note = currentNote();
          if (!note) return;
          note.tokens.forEach(function (token) {
            if (token.hidden) {
              token.hinted = false;
              token.revealed = false;
            }
          });
          render();
        });

        wrongOnlyBtn.addEventListener('click', function () {
          state.reviewWrongOnly = !state.reviewWrongOnly;
          const note = currentNote();
          if (state.reviewWrongOnly && note) {
            note.tokens.forEach(function (token) {
              if (token.hidden && token.wrong) {
                token.hinted = false;
                token.revealed = false;
              }
            });
          }
          render();
        });

        ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach(function (eventName) {
          studyView.addEventListener(eventName, function (event) {
            event.preventDefault();
          });
        });

        render();
      })();
    </script>
  </body>
</html>`;
  }

  function preparePublicData() {
    const publicState = JSON.parse(JSON.stringify(state));
    publicState.kind = "clozeit-public-data";
    publicState.version = 1;
    publicState.shareId = createId("data");
    publicState.publishedAt = new Date().toISOString();
    publicState.mode = "study";
    publicState.reviewWrongOnly = false;
    publicState.folders.forEach((folder) => {
      folder.notes.forEach((note) => {
        note.tokens = normalizeSavedTokens(note.text, note.tokens).map((token) => ({
          ...token,
          hinted: false,
          revealed: false,
          hiddenGroup: token.hidden ? token.hiddenGroup : null,
          wrong: false
        }));
      });
    });
    return publicState;
  }

  async function publishJsonData() {
    const publicData = preparePublicData();
    const json = `${JSON.stringify(publicData, null, 2)}\n`;
    const fileName = "data.json";

    try {
      const savedToFolder = await saveJsonToPublishFolder(fileName, json);
      if (savedToFolder) {
        showModeDetail(`Published ${fileName} to your public site folder.`);
        return;
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("JSON publish failed. Falling back to download.", error);
      }
    }

    downloadJsonData(fileName, json);
    showModeDetail(`Downloaded ${fileName}. Pick the public folder next time to write it directly.`);
  }

  async function saveJsonToPublishFolder(fileName, json) {
    if (!window.showDirectoryPicker || !window.indexedDB) {
      return false;
    }

    let directoryHandle = publishDirectoryHandle;
    if (directoryHandle && !(await hasExportDirectoryPermission(directoryHandle))) {
      directoryHandle = null;
    }

    if (!directoryHandle) {
      directoryHandle = await window.showDirectoryPicker({
        id: "clozeit-public-folder",
        mode: "readwrite"
      });
      if (!(await hasExportDirectoryPermission(directoryHandle))) {
        return false;
      }
      publishDirectoryHandle = directoryHandle;
      storePublishDirectoryHandle(directoryHandle);
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
  async function exportSharePage() {
    const shareState = prepareShareState();
    const html = sharePageHtml(shareState);
    const stamp = localDateStamp();
    const version = nextExportVersion(stamp);
    const fileName = `${stamp}-V${version}.html`;

    try {
      const savedToFolder = await saveSharePageToExportFolder(fileName, html);
      if (savedToFolder) {
        showModeDetail(`Exported ${fileName} to your export folder.`);
        return;
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("Folder export failed. Falling back to download.", error);
      }
    }

    downloadSharePage(fileName, html);
    showModeDetail(`Downloaded ${fileName}. Pick an export folder next time to save there directly.`);
  }

  async function saveSharePageToExportFolder(fileName, html) {
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
    await writable.write(html);
    await writable.close();
    return true;
  }

  function downloadSharePage(fileName, html) {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  async function loadPublishDirectoryHandle() {
    return loadDirectoryHandle(PUBLISH_DIRECTORY_KEY);
  }

  async function storePublishDirectoryHandle(directoryHandle) {
    return storeDirectoryHandle(PUBLISH_DIRECTORY_KEY, directoryHandle);
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
  async function loadFaviconDataUri() {
    try {
      const response = await fetch("favicon.png");
      if (!response.ok) throw new Error("Icon fetch failed");
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return loadFaviconDataUriFromImage();
    }
  }

  function loadFaviconDataUriFromImage() {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 128;
          canvas.height = 128;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, 128, 128);
          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          resolve("");
        }
      };
      image.onerror = () => resolve("");
      image.src = "favicon.png";
    });
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
    note.tokens = nextTokens;
    lastSafeRawText = note.text;
    saveState();
    renderNavigation();
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
  exportShareBtn.addEventListener("click", exportSharePage);
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

  loadPublishDirectoryHandle()
    .then((handle) => {
      publishDirectoryHandle = handle;
    })
    .catch((error) => {
      console.warn("Could not load remembered public folder.", error);
    });

  loadFaviconDataUri()
    .then((dataUri) => {
      faviconDataUri = dataUri;
    });

  render();
  setMode(mode);
})();
