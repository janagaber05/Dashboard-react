// Messages page logic: moved from components/messages.js
(function () {
  const tbody = document.getElementById("tbody");
  if (!tbody) return; // not on messages page

  // Sample data (replace or extend)
  const messages = createMockMessages(20);

  const PAGE_SIZE = 6;
  let currentPage = 1;
  let filter = "unread"; // 'unread' | 'read'

  const statTotal = document.getElementById("stat-total");
  const statNew = document.getElementById("stat-new");
  const statRead = document.getElementById("stat-read");
  const pagesEl = document.getElementById("pg-pages");
  const metaEl = document.getElementById("pager-meta");

  // Filter controls
  document.querySelectorAll('input[name="filter"]').forEach((r) => {
    r.addEventListener("change", (e) => {
      filter = e.target.value;
      currentPage = 1;
      render();
    });
  });

  // Pager controls
  document.querySelector(".pg-first")?.addEventListener("click", () => {
    currentPage = 1;
    render(true);
  });
  document.querySelector(".pg-next")?.addEventListener("click", () => {
    const totalPages = getPages().length;
    if (currentPage < totalPages) {
      currentPage++;
      render(true);
    }
  });

  render();

  function render(scrollTop) {
    const filtered = messages.filter((m) =>
      filter === "unread" ? m.status === "New" : m.status === "Read"
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    // Stats
    statTotal.textContent = `Total ${messages.length}`;
    statNew.textContent = `New ${messages.filter((m) => m.status === "New").length}`;
    statRead.textContent = `Read ${messages.filter((m) => m.status === "Read").length}`;

    // Rows
    tbody.innerHTML = "";
    pageItems.forEach((m) => tbody.appendChild(row(m)));

    // Pages
    pagesEl.innerHTML = "";
    getPages(totalPages).forEach((p) => {
      const btn = document.createElement("button");
      btn.className = "pg-page" + (p === currentPage ? " active" : "");
      btn.textContent = String(p);
      btn.addEventListener("click", () => {
        currentPage = p;
        render(true);
      });
      pagesEl.appendChild(btn);
    });

    metaEl.textContent = `Showing ${start + 1}-${Math.min(
      start + PAGE_SIZE,
      filtered.length
    )} of ${filtered.length} Messages`;

    if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getPages(totalPages) {
    if (!totalPages) totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  function row(m) {
    const tr = el("div", "tr");
    tr.appendChild(td(m.name));
    tr.appendChild(td(m.email));
    tr.appendChild(td(m.subject));
    tr.appendChild(td(m.date));
    const st = el("div", "td");
    const badge = el("span", "status-badge" + (m.status === "Read" ? " read" : ""));
    badge.textContent = m.status;
    st.appendChild(badge);
    tr.appendChild(st);

    const actions = el("div", "td actions");
    actions.appendChild(icon("../icons/eye.svg", "View", () => viewMessage(m)));
    actions.appendChild(icon("../icons/check.svg", "Mark", () => markRead(m)));
    actions.appendChild(icon("../icons/trash.svg", "Delete", () => removeMessage(m)));
    tr.appendChild(actions);
    return tr;
  }

  function td(text) {
    const d = el("div", "td");
    d.textContent = text;
    return d;
  }

  function icon(src, alt, onClick) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    if (onClick) img.addEventListener("click", onClick);
    return img;
  }

  function viewMessage(m) {
    try {
      localStorage.setItem("selectedMessage", JSON.stringify(m));
    } catch (e) {}
    window.location.href = "./message.html";
  }

  function markRead(m) {
    m.status = "Read";
    render();
  }

  function removeMessage(m) {
    const idx = messages.indexOf(m);
    if (idx >= 0) {
      messages.splice(idx, 1);
      render();
    }
  }

  function el(tag, className) {
    const e = document.createElement("div");
    e.className = className;
    return e;
  }

  function createMockMessages(n) {
    const arr = [];
    const names = ["Salma Ahmed", "Omar Ali", "Reem Hassan", "Nour Adel"];
    const emails = ["mail.com", "email.com", "inbox.com"];
    for (let i = 0; i < n; i++) {
      const name = names[i % names.length];
      const email = `${name.split(" ").join("")}${12 + (i % 10)}@${emails[i % emails.length]}`;
      const subject = "Chance To Work";
      const date = `12/${(5 + (i % 25)).toString().padStart(2, "0")}/25`;
      const status = i % 2 === 0 ? "New" : "Read";
      arr.push({ name, email, subject, date, status });
    }
    return arr;
  }
})();


