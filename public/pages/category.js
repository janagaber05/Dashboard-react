(function () {
  // WYSIWYG handlers
  document.querySelectorAll(".editor").forEach((editor) => {
    const area = editor.querySelector(".wys");
    editor.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-cmd]");
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

  // Tabs (visual only)
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tt) => tt.classList.remove("active"));
      t.classList.add("active");
    });
  });

  // Populate sample list with pagination
  const items = [
    { type: "Category", name: "Web Design", desc: "Projects related to web design" },
    { type: "Tags", name: "UX/UI", desc: "Posts related to UX/UI" },
    { type: "Pages", name: "3D Modeling", desc: "Pages related to 3D projects" },
    { type: "Category", name: "Brand", desc: "Brand design work" },
    { type: "Tags", name: "Animation", desc: "Motion content" },
  ];
  const pageSize = 3;
  let page = 1;
  const tbody = document.getElementById("cat-tbody");
  const pagesEl = document.getElementById("cat-pages");
  const metaEl = document.getElementById("cat-meta");

  function renderList() {
    tbody.innerHTML = "";
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);
    slice.forEach((it) => {
      const tr = document.createElement("div");
      tr.className = "tr";
      tr.innerHTML = `
        <div class="td">${it.type}</div>
        <div class="td">${it.name}</div>
        <div class="td">${it.desc}</div>
        <div class="td actions">
          <img src="../icons/eye.svg" alt="View" />
          <img src="../icons/check.svg" alt="Ok" />
          <img src="../icons/trash.svg" alt="Delete" />
        </div>`;
      tbody.appendChild(tr);
    });
    // pagination
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    pagesEl.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const b = document.createElement("button");
      b.className = "pg-page" + (i === page ? " active" : "");
      b.textContent = String(i);
      b.addEventListener("click", () => {
        page = i;
        renderList();
      });
      pagesEl.appendChild(b);
    }
    metaEl.textContent = `Showing ${start + 1}-${Math.min(start + pageSize, items.length)} of ${items.length}`;
  }

  document.querySelector(".pg-first")?.addEventListener("click", () => {
    page = 1;
    renderList();
  });
  document.querySelector(".pg-next")?.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    if (page < totalPages) {
      page++;
      renderList();
    }
  });

  renderList();
})();


