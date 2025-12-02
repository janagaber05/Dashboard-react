(function () {
  const img = document.getElementById("profile-preview");
  const sideAvatar = document.getElementById("side-avatar");
  const fileInput = document.getElementById("file-photo");
  const btnPhoto = document.getElementById("btn-photo");
  const form = document.getElementById("settings-form");

  const fields = ["name", "job", "bio", "instagram", "facebook", "tiktok", "linkedin", "behance"];

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem("profileSettings") || "null");
      if (saved) {
        fields.forEach((f) => {
          const el = document.getElementById(f);
          if (el && saved[f] != null) el.value = saved[f];
        });
        if (saved.photo) {
          img.src = saved.photo;
          if (sideAvatar) sideAvatar.src = saved.photo;
        }
      }
    } catch (_) {}
  }

  function save() {
    const data = {};
    fields.forEach((f) => (data[f] = document.getElementById(f)?.value || ""));
    if (img && img.src && !img.src.endsWith("logo192.png")) data.photo = img.src;
    localStorage.setItem("profileSettings", JSON.stringify(data));
  }

  btnPhoto.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      if (sideAvatar) sideAvatar.src = reader.result;
      save();
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("btn-remove-photo").addEventListener("click", () => {
    img.src = "../logo192.png";
    if (sideAvatar) sideAvatar.src = "../logo192.png";
    // remove only the photo key from saved settings
    try {
      const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
      delete saved.photo;
      localStorage.setItem("profileSettings", JSON.stringify(saved));
    } catch (_) {
      // ignore
    }
  });

  document.getElementById("btn-save").addEventListener("click", save);
  document.getElementById("btn-reset").addEventListener("click", () => {
    localStorage.removeItem("profileSettings");
    form.reset();
    img.src = "../logo192.png";
    if (sideAvatar) sideAvatar.src = "../logo192.png";
  });

  // Auto-save on input change
  form.addEventListener("input", () => {
    // debounce not necessary for small form
    save();
  });

  load();
})();


