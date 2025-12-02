(function () {
  // Read the selected message from localStorage
  let m = null;
  try {
    m = JSON.parse(localStorage.getItem("selectedMessage") || "null");
  } catch (e) {}
  if (!m) {
    // Fallback demo data
    m = {
      name: "Salma Ahmed",
      email: "SalmaAhmed12@mail.com",
      subject: "Website Design Request",
      date: "12/05/25",
      status: "New",
      body:
        "Hi, I loved your portfolio and I’d like you to design a website for my bakery. Please contact me…",
    };
  }

  // Populate fields
  document.getElementById("m-name").textContent = m.name;
  document.getElementById("m-email").textContent = m.email;
  document.getElementById("m-subject").textContent = m.subject;
  document.getElementById("m-date").textContent = m.date || "";
  document.getElementById("m-time").textContent = m.time || "10:29 PM";
  const bodyEl = document.getElementById("m-body");
  bodyEl.textContent = m.body || bodyEl.textContent;

  // Buttons
  document.getElementById("btn-reply").addEventListener("click", () => {
    window.location.href = `mailto:${m.email}?subject=Re:%20${encodeURIComponent(
      m.subject || "Message"
    )}`;
  });
  document.getElementById("btn-read").addEventListener("click", () => {
    m.status = "Read";
    try {
      localStorage.setItem("selectedMessage", JSON.stringify(m));
    } catch (e) {}
    alert("Marked as read");
  });
  document.getElementById("btn-delete").addEventListener("click", () => {
    localStorage.removeItem("selectedMessage");
    window.location.href = "./messages.html";
  });
})();


