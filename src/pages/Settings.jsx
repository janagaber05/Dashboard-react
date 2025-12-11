import React, { useEffect, useRef, useState } from "react";
import "./settings.css";
import Button from "../components/Button.jsx";

export default function Settings() {
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [job, setJob] = useState("");
  const [jobAr, setJobAr] = useState("");
  const [bio, setBio] = useState("");
  const [bioAr, setBioAr] = useState("");
  const [socials, setSocials] = useState({
    instagram: "", facebook: "", tiktok: "", linkedin: "", behance: ""
  });
  const [photo, setPhoto] = useState("/logo192.png");
  const fileRef = useRef(null);
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
    setName(saved.name || "Jana Ahmed Ahmed Gaber");
    setNameAr(saved.nameAr || "");
    setJob(saved.job || "UX UI Designer | Graphic Designer | Web Designer | Content Creator | Sales");
    setJobAr(saved.jobAr || "");
    setBio(saved.bio || "I’m Jana a hijabi girl with a designer’s eye and a car lover’s heart. I mix pixels and horsepower like it’s an art form. I believe every design (and every car) should have personality, attitude, and a little chaos — just like me.");
    setBioAr(saved.bioAr || "");
    setSocials({
      instagram: saved.instagram || "",
      facebook: saved.facebook || "",
      tiktok: saved.tiktok || "",
      linkedin: saved.linkedin || "",
      behance: saved.behance || ""
    });
    setPhoto(saved.photo || "/logo192.png");
  }, []);

  function save() {
    const savedData = {
      name, nameAr,
      job, jobAr,
      bio, bioAr,
      ...socials,
      photo: photo !== "/logo192.png" ? photo : undefined
    };
    localStorage.setItem("profileSettings", JSON.stringify(savedData));
    
    // Dispatch custom event to update sidebar in real-time
    window.dispatchEvent(new Event("profileSettingsUpdated"));
    
    // eslint-disable-next-line no-alert
    alert("Saved");
  }

  function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const newPhoto = r.result;
      setPhoto(newPhoto);
      // Update localStorage immediately when photo is selected
      const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
      saved.photo = newPhoto;
      localStorage.setItem("profileSettings", JSON.stringify(saved));
      // Dispatch event to update sidebar
      window.dispatchEvent(new Event("profileSettingsUpdated"));
    };
    r.readAsDataURL(file);
  }
  function removePhoto() {
    setPhoto("/logo192.png");
    const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
    delete saved.photo;
    localStorage.setItem("profileSettings", JSON.stringify(saved));
    // Dispatch event to update sidebar
    window.dispatchEvent(new Event("profileSettingsUpdated"));
  }

  return (
    <section className="set-card">
      <div className="set-header">
        <img
          className="set-avatar"
          src={photo}
          alt="Profile"
          onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src="/logo192.png"; }}
        />
        <div>
          <button className="edit-link" onClick={() => fileRef.current?.click()}>✎ Edit Profile Picture</button>
          <button className="edit-link" onClick={removePhoto} style={{ marginLeft: 10 }}>🗑 Remove</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
        <div className="lang-switch">
          <button type="button" className={"lang-btn" + (isArabic ? " active" : "")} onClick={()=>setIsArabic(v=>!v)}>
            {isArabic ? "EN" : "AR"}
          </button>
        </div>
      </div>

      <form className="set-form" onSubmit={(e)=>e.preventDefault()}>
        <div className="field">
          <label>Name:</label>
          <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? nameAr : name} onChange={(e)=> (isArabic ? setNameAr(e.target.value) : setName(e.target.value))} />
        </div>
        <div className="field">
          <label>Job :</label>
          <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? jobAr : job} onChange={(e)=> (isArabic ? setJobAr(e.target.value) : setJob(e.target.value))} />
        </div>
        <div className="field">
          <label>Bio:</label>
          <textarea dir={isArabic ? "rtl" : "ltr"} value={isArabic ? bioAr : bio} onChange={(e)=> (isArabic ? setBioAr(e.target.value) : setBio(e.target.value))} />
        </div>

        <div className="grid2">
          <div className="field">
            <label>Instagram:</label>
            <input placeholder="URL..." value={socials.instagram} onChange={(e)=>setSocials({...socials, instagram: e.target.value})} />
          </div>
          <div className="field">
            <label>Facebook:</label>
            <input placeholder="URL..." value={socials.facebook} onChange={(e)=>setSocials({...socials, facebook: e.target.value})} />
          </div>
          <div className="field">
            <label>TikTok:</label>
            <input placeholder="URL..." value={socials.tiktok} onChange={(e)=>setSocials({...socials, tiktok: e.target.value})} />
          </div>
          <div className="field">
            <label>LinkedIn:</label>
            <input placeholder="URL..." value={socials.linkedin} onChange={(e)=>setSocials({...socials, linkedin: e.target.value})} />
          </div>
          <div className="field">
            <label>Behance:</label>
            <input placeholder="URL..." value={socials.behance} onChange={(e)=>setSocials({...socials, behance: e.target.value})} />
          </div>
        </div>

        <div className="actions">
          <Button variant="primary" onClick={save}>Save</Button>
          <Button variant="soft" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Preview</Button>
        </div>
      </form>
    </section>
  );
}


