// Sidebar navigation and burger toggle (component)
window.addEventListener("DOMContentLoaded", () => {
  // Active nav item
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      navItems.forEach((n) => n.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });

  // Burger controls
  const menuBtn = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".backdrop");
  function openMenu() {
    if (!sidebar) return;
    sidebar.classList.add("open");
    backdrop && backdrop.classList.add("active");
    document.body.classList.add("no-scroll");
  }
  function closeMenu() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    backdrop && backdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
  function toggleMenu() {
    if (!sidebar) return;
    if (sidebar.classList.contains("open")) closeMenu();
    else openMenu();
  }
  menuBtn && menuBtn.addEventListener("click", toggleMenu);
  backdrop && backdrop.addEventListener("click", closeMenu);
  navItems.forEach((n) => n.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
});


