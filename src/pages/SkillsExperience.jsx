import React, { useMemo, useState } from "react";
import "./skillsEx.css";

const initialSkills = [
  { name: "Figma", nameAr: "", level: "Intermediate" },
  { name: "Adobe PhotoShop", nameAr: "", level: "Intermediate" },
  { name: "Adobe Illustrator", nameAr: "", level: "Intermediate" },
  { name: "Adobe After Effect", nameAr: "", level: "Intermediate" },
];

const initialExp = [
  { title: "Front End Course", company: "CLS", date: "2024/2024", desc: "Front end code course located..." },
  { title: "Front End Course", company: "CLS", date: "2024/2024", desc: "Front end code course located..." },
  { title: "Front End Course", company: "CLS", date: "2024/2024", desc: "Front end code course located..." },
];

function Pager({ page, totalPages, onPrev, onNext, onGoto }) {
  return (
    <div className="pg">
      <button onClick={onPrev} className={page === 1 ? "disabled" : ""}>{"«"}</button>
      {[1,2,3].slice(0, totalPages).map((n) => (
        <button key={n} className={"num" + (page === n ? " active" : "")} onClick={() => onGoto(n)}>{n}</button>
      ))}
      <button onClick={onNext} className={page === totalPages ? "disabled" : ""}>{"»"}</button>
    </div>
  );
}

export default function SkillsExperience() {
  const [skills, setSkills] = useState(initialSkills);
  const [experiences, setExperiences] = useState(initialExp);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillIsArabic, setSkillIsArabic] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: "", nameAr: "", level: "Beginner" });
  const [skillEditIdx, setSkillEditIdx] = useState(null);

  // pagination (simple client chunks)
  const [sPage, setSPage] = useState(1);
  const [ePage, setEPage] = useState(1);
  const perPage = 4;
  const sTotal = Math.max(1, Math.ceil(skills.length / perPage));
  const eTotal = Math.max(1, Math.ceil(experiences.length / perPage));
  const sView = useMemo(() => skills.slice((sPage-1)*perPage, sPage*perPage), [skills, sPage]);
  const eView = useMemo(() => experiences.slice((ePage-1)*perPage, ePage*perPage), [experiences, ePage]);

  function openAddSkill() {
    setSkillForm({ name: "", nameAr: "", level: "Beginner" });
    setSkillEditIdx(null);
    setSkillIsArabic(false);
    setSkillModalOpen(true);
  }
  function openEditSkill(idx) {
    const cur = skills[idx];
    setSkillForm({ name: cur.name || "", nameAr: cur.nameAr || "", level: cur.level || "Beginner" });
    setSkillEditIdx(idx);
    setSkillIsArabic(false);
    setSkillModalOpen(true);
  }
  function saveSkill() {
    const data = { ...skillForm };
    if (skillEditIdx === null) {
      setSkills([data, ...skills]);
    } else {
      setSkills(skills.map((s, i) => i === skillEditIdx ? data : s));
    }
    setSkillModalOpen(false);
  }
  function delSkill(idx) {
    if (!window.confirm("Delete this skill?")) return;
    setSkills(skills.filter((_, i) => i !== idx));
  }

  function addExp() {
    const title = window.prompt("Title");
    if (!title) return;
    const company = window.prompt("Company");
    const date = window.prompt("Date", "2024/2024");
    const desc = window.prompt("Description", "Front end code course located...") || "";
    setExperiences([{ title, company, date, desc }, ...experiences]);
  }
  function editExp(idx) {
    const cur = experiences[idx];
    const title = window.prompt("Edit title", cur.title) || cur.title;
    const company = window.prompt("Edit company", cur.company) || cur.company;
    const date = window.prompt("Edit date", cur.date) || cur.date;
    const desc = window.prompt("Edit description", cur.desc) || cur.desc;
    setExperiences(experiences.map((e, i) => i === idx ? { title, company, date, desc } : e));
  }
  function delExp(idx) {
    if (!window.confirm("Delete this item?")) return;
    setExperiences(experiences.filter((_, i) => i !== idx));
  }

  return (
    <div className="sx-wrap">
      <h2 className="sx-title">Skills</h2>
      <div className="sx-add-row">
        <button className="add-btn" onClick={openAddSkill}>+ Add Skill</button>
      </div>
      <div className="table">
        <div className="thead">
          <div className="th">Name</div>
          <div className="th">Level</div>
          <div className="th">Action</div>
        </div>
        <div className="tbody">
          {sView.map((r, i) => (
            <div className="tr" key={i}>
              <div className="td">{r.name}</div>
              <div className="td">{r.level}</div>
              <div className="td">
                <div className="acts">
                  <img className="tag-ico" onClick={() => openEditSkill((sPage-1)*perPage + i)} src={process.env.PUBLIC_URL + "/icons/pencil-sm.svg"} alt="edit" />
                  <img className="tag-ico" onClick={() => delSkill((sPage-1)*perPage + i)} src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pager
        page={sPage}
        totalPages={sTotal}
        onPrev={() => setSPage(p => Math.max(1, p-1))}
        onNext={() => setSPage(p => Math.min(sTotal, p+1))}
        onGoto={(n) => setSPage(n)}
      />
      <div className="meta">Showing {Math.min(skills.length, (sPage-1)*perPage+1)}-{Math.min(skills.length, sPage*perPage)} of {skills.length} Skills</div>

      <h2 className="sx-title" style={{ marginTop: 26 }}>Experience</h2>
      <div className="sx-add-row">
        <button className="add-btn" onClick={addExp}>+ Add Experience</button>
      </div>
      <div className="table">
        <div className="thead">
          <div className="th">Title</div>
          <div className="th">Company Name</div>
          <div className="th">Date</div>
          <div className="th">Description</div>
          <div className="th">Action</div>
        </div>
        <div className="tbody">
          {eView.map((r, i) => (
            <div className="tr" key={i}>
              <div className="td">{r.title}</div>
              <div className="td">{r.company}</div>
              <div className="td">{r.date}</div>
              <div className="td">{r.desc}</div>
              <div className="td">
                <div className="acts">
                  <img className="tag-ico" onClick={() => editExp((ePage-1)*perPage + i)} src={process.env.PUBLIC_URL + "/icons/pencil-sm.svg"} alt="edit" />
                  <img className="tag-ico" onClick={() => delExp((ePage-1)*perPage + i)} src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pager
        page={ePage}
        totalPages={eTotal}
        onPrev={() => setEPage(p => Math.max(1, p-1))}
        onNext={() => setEPage(p => Math.min(eTotal, p+1))}
        onGoto={(n) => setEPage(n)}
      />
      <div className="meta">Showing {Math.min(experiences.length, (ePage-1)*perPage+1)}-{Math.min(experiences.length, ePage*perPage)} of {experiences.length} Experiences</div>

      {skillModalOpen && (
        <>
          <div className="sx-backdrop" onClick={()=>setSkillModalOpen(false)} />
          <div className="sx-modal" role="dialog" aria-modal="true">
            <h3 className="sx-modal-title">Add Skill</h3>
            <div className="sx-lang">
              <button className={"lang-btn" + (skillIsArabic ? " active" : "")} onClick={()=>setSkillIsArabic(v=>!v)} type="button">
                {skillIsArabic ? "EN" : "AR"}
              </button>
            </div>
            <div className="sx-field">
              <label>Skill Title</label>
              <input
                dir={skillIsArabic ? "rtl" : "ltr"}
                value={skillIsArabic ? (skillForm.nameAr || "") : (skillForm.name || "")}
                onChange={(e)=> setSkillForm(f => ({ ...f, [skillIsArabic ? "nameAr" : "name"]: e.target.value }))}
              />
            </div>
            <div className="sx-field">
              <label>Skill Level:</label>
              <div className="sx-radios">
                {["Beginner","Intermediate","Advanced"].map(l => (
                  <label key={l}><input type="radio" name="lvl" checked={skillForm.level===l} onChange={()=>setSkillForm(f=>({...f, level:l}))} /> {l}</label>
                ))}
              </div>
            </div>
            <div className="sx-actions">
              <button className="btn primary" onClick={saveSkill}>Save</button>
              <button className="btn ghost" onClick={()=>setSkillModalOpen(false)}>Cancel</button>
              {skillEditIdx!==null && <button className="btn danger" onClick={()=>{ delSkill(skillEditIdx); setSkillModalOpen(false);} }>Delete</button>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


