(() => {
  const toggle = document.querySelector("[data-library-toggle]");
  const sidebar = document.getElementById("library-sidebar");
  const overlay = document.getElementById("library-overlay");
  if (!toggle || !sidebar || !overlay) return;

  const compactLayout = window.matchMedia("(max-width: 980px), (max-height: 640px)");

  function setOpen(open) {
    const visible = Boolean(open && compactLayout.matches);
    document.body.classList.toggle("library-open", visible);
    overlay.hidden = !visible;
    toggle.setAttribute("aria-expanded", String(visible));
  }

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("library-open")));
  overlay.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-note-id]")) setOpen(false);
  });
  compactLayout.addEventListener("change", () => setOpen(false));
})();