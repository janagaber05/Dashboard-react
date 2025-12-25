import React, { useMemo, useState, useEffect } from "react";
import "./skillsEx.css";
import RichTextEditor from "../components/RichTextEditor.jsx";
import { supabase } from "../utils/supabase";

function Pager({ page, totalPages, onPrev, onNext, onGoto }) {
  return (
    <div className="pg">
      <button onClick={onPrev} className={page === 1 ? "disabled" : ""}>{"«"}</button>
      {Array.from({ length: totalPages }, (_, n) => n + 1).map((n) => (
        <button key={n} className={"num" + (page === n ? " active" : "")} onClick={() => onGoto(n)}>{n}</button>
      ))}
      <button onClick={onNext} className={page === totalPages ? "disabled" : ""}>{"»"}</button>
    </div>
  );
}

export default function SkillsExperience() {
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [expLoading, setExpLoading] = useState(true);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillIsArabic, setSkillIsArabic] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: "", nameAr: "", level: "Beginner" });
  const [skillEditId, setSkillEditId] = useState(null);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expIsArabic, setExpIsArabic] = useState(false);
  const [expForm, setExpForm] = useState({
    title: "", titleAr: "", company: "", from: "", to: "", desc: "", descAr: ""
  });
  const [expEditId, setExpEditId] = useState(null);
  const [education, setEducation] = useState([]);
  const [educationLoading, setEducationLoading] = useState(true);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [educationForm, setEducationForm] = useState({
    type: "education",
    year_start: "",
    year_end: ""
  });
  const [educationEditId, setEducationEditId] = useState(null);

  useEffect(() => {
    loadSkills();
    loadExperiences();
    loadEducation();
  }, []);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      setSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  const loadExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setExperiences([]);
    } finally {
      setExpLoading(false);
    }
  };

  const loadEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist (PGRST205), silently continue with empty array
        // Don't log errors for missing tables - this is expected until table is created
        if (error.code === 'PGRST205' || error.message?.includes('not find the table') || error.message?.includes('schema cache')) {
          setEducation([]);
          setEducationLoading(false);
          return; // Exit early, don't throw
        }
        // For other errors, still don't log - just set empty array
        setEducation([]);
      } else {
        setEducation(data || []);
      }
    } catch (error) {
      // Silently handle all errors - table might not exist yet
      setEducation([]);
    } finally {
      setEducationLoading(false);
    }
  };

  // Calculate year_display on frontend
  const calculateYearDisplay = (yearStart, yearEnd) => {
    if (!yearStart) return "";
    if (!yearEnd || yearStart === yearEnd) {
      return yearStart;
    }
    return `${yearStart}-${yearEnd}`;
  };

  // pagination (simple client chunks)
  const [sPage, setSPage] = useState(1);
  const [ePage, setEPage] = useState(1);
  const [edPage, setEdPage] = useState(1);
  const perPage = 4;
  const sTotal = Math.max(1, Math.ceil(skills.length / perPage));
  const eTotal = Math.max(1, Math.ceil(experiences.length / perPage));
  const edTotal = Math.max(1, Math.ceil(education.length / perPage));
  const sView = useMemo(() => skills.slice((sPage-1)*perPage, sPage*perPage), [skills, sPage]);
  const eView = useMemo(() => experiences.slice((ePage-1)*perPage, ePage*perPage), [experiences, ePage]);
  const edView = useMemo(() => education.slice((edPage-1)*perPage, edPage*perPage), [education, edPage]);

  function openAddSkill() {
    setSkillForm({ name: "", nameAr: "", level: "Beginner" });
    setSkillEditId(null);
    setSkillIsArabic(false);
    setSkillModalOpen(true);
  }
  function openEditSkill(skill) {
    setSkillForm({ name: skill.name || "", nameAr: skill.nameAr || "", level: skill.level || "Beginner" });
    setSkillEditId(skill.id);
    setSkillIsArabic(false);
    setSkillModalOpen(true);
  }
  async function saveSkill() {
    try {
      const data = { ...skillForm };
      if (skillEditId === null) {
        const { error } = await supabase.from('skills').insert([data]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').update(data).eq('id', skillEditId);
        if (error) throw error;
      }
      await loadSkills();
      setSkillModalOpen(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill: ' + error.message);
    }
  }
  async function delSkill(id) {
    if (!window.confirm("Delete this skill?")) return;
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      await loadSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill: ' + error.message);
    }
  }

  function addExp() {
    setExpForm({ title:"", titleAr:"", company:"", from:"", to:"", desc:"", descAr:"" });
    setExpEditId(null);
    setExpIsArabic(false);
    setExpModalOpen(true);
  }
  function editExp(exp) {
    setExpForm({
      title: exp.title || "", titleAr: exp.titleAr || "", company: exp.company || "",
      from: exp.from || "", to: exp.to || "", desc: exp.desc || "", descAr: exp.descAr || ""
    });
    setExpEditId(exp.id);
    setExpIsArabic(false);
    setExpModalOpen(true);
  }
  async function saveExp() {
    try {
      const data = { ...expForm };
      if (expEditId === null) {
        const { error } = await supabase.from('experience').insert([data]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('experience').update(data).eq('id', expEditId);
        if (error) throw error;
      }
      await loadExperiences();
      setExpModalOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience: ' + error.message);
    }
  }
  async function delExp(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;
      await loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience: ' + error.message);
    }
  }

  function addEducation() {
    setEducationForm({ type: "education", year_start: "", year_end: "" });
    setEducationEditId(null);
    setEducationModalOpen(true);
  }
  function editEducation(item) {
    setEducationForm({
      type: item.type || "education",
      year_start: item.year_start || "",
      year_end: item.year_end || ""
    });
    setEducationEditId(item.id);
    setEducationModalOpen(true);
  }
  async function saveEducation() {
    try {
      const data = {
        type: educationForm.type || "education",
        year_start: educationForm.year_start || "",
        year_end: educationForm.year_end || ""
        // year_display is calculated on frontend, not saved
      };
      if (educationEditId === null) {
        const { error } = await supabase.from('education').insert([data]);
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
            alert('Education table does not exist yet. Please run supabase-education-table.sql in Supabase SQL Editor to create it.');
            return;
          }
          throw error;
        }
      } else {
        const { error } = await supabase.from('education').update(data).eq('id', educationEditId);
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
            alert('Education table does not exist yet. Please run supabase-education-table.sql in Supabase SQL Editor to create it.');
            return;
          }
          throw error;
        }
      }
      await loadEducation();
      setEducationModalOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education: ' + (error.message || 'Unknown error'));
    }
  }
  async function delEducation(id) {
    if (!window.confirm("Delete this education item?")) return;
    try {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
          alert('Education table does not exist yet. Please run supabase-education-table.sql in Supabase SQL Editor to create it.');
          return;
        }
        throw error;
      }
      await loadEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Failed to delete education: ' + (error.message || 'Unknown error'));
    }
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
          {skillsLoading ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>Loading skills...</div>
          ) : sView.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>No skills found</div>
          ) : (
            sView.map((r) => (
              <div className="tr" key={r.id}>
                <div className="td">{r.name}</div>
                <div className="td">{r.level}</div>
                <div className="td">
                  <div className="acts">
                    <img className="tag-ico" onClick={() => openEditSkill(r)} src={process.env.PUBLIC_URL + "/icons/pencil-sm.svg"} alt="edit" />
                    <img className="tag-ico" onClick={() => delSkill(r.id)} src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" />
                  </div>
                </div>
              </div>
            ))
          )}
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
          {expLoading ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>Loading experiences...</div>
          ) : eView.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>No experiences found</div>
          ) : (
            eView.map((r) => (
              <div className="tr" key={r.id}>
                <div className="td">{r.title}</div>
                <div className="td">{r.company}</div>
                <div className="td">{`${r.from}/${r.to}`}</div>
                <div className="td">{r.desc}</div>
                <div className="td">
                  <div className="acts">
                    <img className="tag-ico" onClick={() => editExp(r)} src={process.env.PUBLIC_URL + "/icons/pencil-sm.svg"} alt="edit" />
                    <img className="tag-ico" onClick={() => delExp(r.id)} src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" />
                  </div>
                </div>
              </div>
            ))
          )}
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

      <h2 className="sx-title" style={{ marginTop: 26 }}>Education Timeline</h2>
      <div className="sx-add-row">
        <button className="add-btn" onClick={addEducation}>+ Add Education</button>
      </div>
      <div className="table">
        <div className="thead">
          <div className="th">Type</div>
          <div className="th">Year Start</div>
          <div className="th">Year End</div>
          <div className="th">Year Display</div>
          <div className="th">Action</div>
        </div>
        <div className="tbody">
          {educationLoading ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>Loading education...</div>
          ) : edView.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>No education items found</div>
          ) : (
            edView.map((r) => (
              <div className="tr" key={r.id}>
                <div className="td">{r.type || "education"}</div>
                <div className="td">{r.year_start || "-"}</div>
                <div className="td">{r.year_end || "-"}</div>
                <div className="td">{calculateYearDisplay(r.year_start, r.year_end)}</div>
                <div className="td">
                  <div className="acts">
                    <img className="tag-ico" onClick={() => editEducation(r)} src={process.env.PUBLIC_URL + "/icons/pencil-sm.svg"} alt="edit" />
                    <img className="tag-ico" onClick={() => delEducation(r.id)} src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Pager
        page={edPage}
        totalPages={edTotal}
        onPrev={() => setEdPage(p => Math.max(1, p-1))}
        onNext={() => setEdPage(p => Math.min(edTotal, p+1))}
        onGoto={(n) => setEdPage(n)}
      />
      <div className="meta">Showing {Math.min(education.length, (edPage-1)*perPage+1)}-{Math.min(education.length, edPage*perPage)} of {education.length} Education Items</div>

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
              {skillEditId!==null && <button className="btn danger" onClick={()=>{ delSkill(skillEditId); setSkillModalOpen(false);} }>Delete</button>}
            </div>
          </div>
        </>
      )}

      {expModalOpen && (
        <>
          <div className="sx-backdrop" onClick={()=>setExpModalOpen(false)} />
          <div className="sx-modal" role="dialog" aria-modal="true">
            <h3 className="sx-modal-title">Add Experience</h3>
            <div className="sx-lang">
              <button className={"lang-btn" + (expIsArabic ? " active" : "")} onClick={()=>setExpIsArabic(v=>!v)} type="button">
                {expIsArabic ? "EN" : "AR"}
              </button>
            </div>
            <div className="sx-field">
              <label>Experience Title</label>
              <input
                dir={expIsArabic ? "rtl" : "ltr"}
                value={expIsArabic ? expForm.titleAr : expForm.title}
                onChange={(e)=> setExpForm(f => ({ ...f, [expIsArabic ? "titleAr" : "title"]: e.target.value }))}
              />
            </div>
            <div className="sx-field">
              <label>Company Name</label>
              <input value={expForm.company} onChange={(e)=> setExpForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="sx-two">
              <div className="sx-field"><label>From</label><input value={expForm.from} onChange={(e)=> setExpForm(f => ({ ...f, from: e.target.value }))} placeholder="From" /></div>
              <div className="sx-field"><label>To</label><input value={expForm.to} onChange={(e)=> setExpForm(f => ({ ...f, to: e.target.value }))} placeholder="To" /></div>
            </div>
            <div className="sx-field" style={{ alignItems: "start" }}>
              <label>Description</label>
              <RichTextEditor className={expIsArabic ? "rte-rtl" : ""} value={expIsArabic ? expForm.descAr : expForm.desc}
                onChange={(v)=> setExpForm(f => ({ ...f, [expIsArabic ? "descAr" : "desc"]: v }))} />
            </div>
            <div className="sx-actions">
              <button className="btn primary" onClick={saveExp}>Save</button>
              <button className="btn ghost" onClick={()=>setExpModalOpen(false)}>Cancel</button>
              {expEditId!==null && <button className="btn danger" onClick={()=>{ delExp(expEditId); setExpModalOpen(false); }}>Delete</button>}
            </div>
          </div>
        </>
      )}

      {educationModalOpen && (
        <>
          <div className="sx-backdrop" onClick={()=>setEducationModalOpen(false)} />
          <div className="sx-modal" role="dialog" aria-modal="true">
            <h3 className="sx-modal-title">{educationEditId === null ? "Add Education" : "Edit Education"}</h3>
            <div className="sx-field">
              <label>Type</label>
              <input 
                value={educationForm.type} 
                onChange={(e) => setEducationForm(f => ({ ...f, type: e.target.value }))} 
                placeholder="e.g., education"
              />
            </div>
            <div className="sx-two">
              <div className="sx-field">
                <label>Year Start</label>
                <input 
                  type="text"
                  value={educationForm.year_start} 
                  onChange={(e) => setEducationForm(f => ({ ...f, year_start: e.target.value }))} 
                  placeholder="e.g., 2022"
                />
              </div>
              <div className="sx-field">
                <label>Year End</label>
                <input 
                  type="text"
                  value={educationForm.year_end} 
                  onChange={(e) => setEducationForm(f => ({ ...f, year_end: e.target.value }))} 
                  placeholder="e.g., 2026 (or same as start)"
                />
              </div>
            </div>
            <div className="sx-field">
              <label>Preview: Year Display</label>
              <div style={{ padding: "8px", background: "#f5f5f5", borderRadius: "8px", color: "#666" }}>
                {calculateYearDisplay(educationForm.year_start, educationForm.year_end) || "Enter years to preview"}
              </div>
            </div>
            <div className="sx-actions">
              <button className="btn primary" onClick={saveEducation}>Save</button>
              <button className="btn ghost" onClick={()=>setEducationModalOpen(false)}>Cancel</button>
              {educationEditId!==null && <button className="btn danger" onClick={()=>{ delEducation(educationEditId); setEducationModalOpen(false); }}>Delete</button>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


