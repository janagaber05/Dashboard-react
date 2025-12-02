import { useEffect, useRef, useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("/logo192.png");
  const fileRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
    setName(saved.name || "");
    setJob(saved.job || "");
    setBio(saved.bio || "");
    setPhoto(saved.photo || "/logo192.png");
  }, []);

  function save() {
    localStorage.setItem(
      "profileSettings",
      JSON.stringify({ name, job, bio, photo: photo !== "/logo192.png" ? photo : undefined })
    );
    alert("Saved");
  }

  function removePhoto() {
    setPhoto("/logo192.png");
    const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
    delete saved.photo;
    localStorage.setItem("profileSettings", JSON.stringify(saved));
  }

  function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <section>
      <h2>Settings</h2>
      <img src={photo} alt="Profile" style={{ width: 96, height: 96, borderRadius: "50%" }} />
      <div>
        <button onClick={() => fileRef.current?.click()}>Edit Profile Picture</button>
        <button onClick={removePhoto}>🗑</button>
        <input ref={fileRef} type="file" hidden accept="image/*" onChange={onPick} />
      </div>
      <div>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Job:</label>
        <input value={job} onChange={(e) => setJob(e.target.value)} />
      </div>
      <div>
        <label>Bio:</label>
        <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <button onClick={save}>Save</button>
    </section>
  );
}


