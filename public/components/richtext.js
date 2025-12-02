(function () {
  // Initialize simple WYSIWYG editors on any '.editor' container
  document.querySelectorAll(".editor").forEach((editor) => {
    const area = editor.querySelector(".wys, [contenteditable='true']");
    if (!area) return;
    editor.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cmd]");
      if (!btn) return;
      const cmd = btn.getAttribute("data-cmd");
      if (cmd === "createLink") {
        const url = prompt("Enter URL:");
        if (url) document.execCommand("createLink", false, url);
        return;
      }
      if (cmd === "insertImage") {
        const url = prompt("Image URL:");
        if (url) document.execCommand("insertImage", false, url);
        return;
      }
      document.execCommand(cmd, false, null);
      area.focus();
    });
  });
})();


