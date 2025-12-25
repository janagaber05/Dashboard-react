import React, { useMemo, useState, useEffect } from "react";
import "./projects.css";
import RichTextEditor from "../components/RichTextEditor.jsx";
import { supabase } from "../utils/supabase";

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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState("EN");

  const [open, setOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [form, setForm] = useState({
    title: "", titleAr: "",
    metaTag: "", metaTagAr: "",
    metaDesc: "", metaDescAr: "",
    desc: "", descAr: "",
    tag: "Web Design", category: "",
    link: "", live: "",
    imgAlt: "", imgAltAr: "",
    lang: "EN", img: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const [page, setPage] = useState(1);
  const perPage = 6;
  const filtered = useMemo(() => {
    return projects.filter(p => {
      const t = (isArabic ? p.titleAr : p.title) || "";
      const txt = t.toLowerCase();
      const q = query.trim().toLowerCase();
      const langOk = langFilter ? p.lang === langFilter : true;
      return langOk && (q === "" || txt.includes(q));
    });
  }, [projects, query, isArabic, langFilter]);
  const total = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = useMemo(() => filtered.slice((page-1)*perPage, page*perPage), [filtered, page]);

  function openAdd() {
    setForm({
      title: "", titleAr: "",
      metaTag: "", metaTagAr: "",
      metaDesc: "", metaDescAr: "",
      desc: "", descAr: "",
      tag: "Web Design", category: "",
      link: "", live: "",
      imgAlt: "", imgAltAr: "",
      lang: "EN", img: ""
    });
    setIsArabic(false);
    setEditId(null);
    setOpen(true);
  }
  function openEdit(project) {
    setForm(project);
    setIsArabic(false);
    setEditId(project.id);
    setOpen(true);
  }
  async function save() {
    try {
      // Create a clean data object without id
      const { id, ...formData } = form;
      
      // Prepare data for Supabase - keep all fields but remove id
      const data = {
        title: formData.title || null,
        titleAr: formData.titleAr || null,
        metaTag: formData.metaTag || null,
        metaTagAr: formData.metaTagAr || null,
        metaDesc: formData.metaDesc || null,
        metaDescAr: formData.metaDescAr || null,
        desc: formData.desc || null,
        descAr: formData.descAr || null,
        tag: formData.tag || null,
        category: formData.category || null,
        link: formData.link || null,
        live: formData.live || null,
        imgAlt: formData.imgAlt || null,
        imgAltAr: formData.imgAltAr || null,
        lang: formData.lang || 'EN',
        img: formData.img || null
      };
      
      console.log('Saving project data:', { editId, data });
      
      if (editId === null) {
        const { data: result, error } = await supabase.from('projects').insert([data]).select();
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Project inserted successfully:', result);
      } else {
        const { data: result, error } = await supabase.from('projects').update(data).eq('id', editId).select();
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Project updated successfully:', result);
      }
      await loadProjects();
      setOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      const errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
      alert('Failed to save project: ' + errorMessage);
    }
  }
  async function del(id) {
    if (!window.confirm("Delete project?")) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project: ' + error.message);
    }
  }

  function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setForm(f => ({ ...f, img: r.result }));
    r.readAsDataURL(file);
  }

  return (
    <div className="proj-wrap">
      <div className="proj-toolbar">
        <div className="left">
          <button className="pill-btn" onClick={openAdd}>+ Add Project</button>
        </div>
        <div className="right">
          <div className="filter">
            <span className="lbl">Filter</span>
            <button className={"lang-btn" + (langFilter==="AR" ? " active" : "")} onClick={()=> setLangFilter(langFilter==="EN" ? "AR" : "EN")}>
              {langFilter}
            </button>
          </div>
          <input className="search" placeholder="Search Project" value={query} onChange={(e)=> setQuery(e.target.value)} />
        </div>
      </div>

      <div className="proj-list">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading projects...</div>
        ) : view.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>No projects found</div>
        ) : (
          view.map((p) => (
            <div className="proj-row" key={p.id}>
              <div className="thumb">{p.img ? <img src={p.img} alt="" /> : <div className="ph" />}</div>
              <div className="main">
                <div className="title">{p.title}</div>
                <div className="desc">{p.desc}</div>
                <a className="link" href={p.link} target="_blank" rel="noreferrer">{p.link}</a>
              </div>
              <div className="meta">
                <span className="tag"># {p.tag}</span>
              </div>
              <div className="actions">
                <span className="lang">{p.lang}</span>
                <button className="mini" onClick={()=> openEdit(p)}>Edit</button>
                <img className="tag-ico" src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" onClick={()=> del(p.id)} />
              </div>
            </div>
          ))
        )}
      </div>

      <Pager
        page={page}
        totalPages={total}
        onPrev={() => setPage(p => Math.max(1, p-1))}
        onNext={() => setPage(p => Math.min(total, p+1))}
        onGoto={(n) => setPage(n)}
      />
      <div className="meta-text">Showing {(page-1)*perPage+1}-{Math.min(projects.length, page*perPage)} of {projects.length} Projects</div>

      {open && (
        <>
          <div className="sx-backdrop" onClick={()=> setOpen(false)} />
          <div className="sx-modal small" role="dialog" aria-modal="true">
            <h3 className="sx-modal-title">{editId===null ? "Add New Project" : "Edit Project"}</h3>
            <div className="sx-lang">
              <button type="button" className={"lang-btn" + (isArabic ? " active" : "")} onClick={()=>setIsArabic(v=>!v)}>
                {isArabic ? "EN" : "AR"}
              </button>
            </div>
            <div className="sx-field">
              <label>Project Title</label>
              <input 
                dir={isArabic ? "rtl" : "ltr"}
                value={isArabic ? (form.titleAr || "") : (form.title || "")} 
                onChange={(e)=> setForm(f => ({ ...f, [isArabic ? "titleAr" : "title"]: e.target.value }))} 
              />
            </div>
            <div className="sx-field">
              <label>Meta Tag</label>
              <input 
                dir={isArabic ? "rtl" : "ltr"}
                value={isArabic ? (form.metaTagAr || "") : (form.metaTag || "")} 
                onChange={(e)=> setForm(f => ({ ...f, [isArabic ? "metaTagAr" : "metaTag"]: e.target.value }))} 
              />
            </div>
            <div className="sx-field">
              <label>Meta Description</label>
              <input 
                dir={isArabic ? "rtl" : "ltr"}
                value={isArabic ? (form.metaDescAr || "") : (form.metaDesc || "")} 
                onChange={(e)=> setForm(f => ({ ...f, [isArabic ? "metaDescAr" : "metaDesc"]: e.target.value }))} 
              />
            </div>
            <div className="sx-field"><label>Tag</label><input value={form.tag} onChange={(e)=> setForm(f => ({ ...f, tag: e.target.value }))} /></div>
            <div className="sx-field"><label>Category</label>
              <select className="sel" value={form.category} onChange={(e)=> setForm(f=>({...f, category:e.target.value}))}>
                <option value="">Choose</option>
                <option>Web Design</option>
                <option>UI/UX</option>
                <option>3D Modeling</option>
                <option>Graphics</option>
              </select>
            </div>
            <div className="sx-field"><label>Github/Link</label><input value={form.link} onChange={(e)=> setForm(f => ({ ...f, link: e.target.value }))} /></div>
            <div className="sx-field"><label>Live Demo</label><input value={form.live} onChange={(e)=> setForm(f => ({ ...f, live: e.target.value }))} /></div>
            <div className="sx-field" style={{ alignItems: "start" }}>
              <label>Description</label>
              <RichTextEditor 
                className={isArabic ? "rte-rtl" : ""}
                value={isArabic ? (form.descAr || "") : (form.desc || "")} 
                onChange={(v)=> setForm(f => ({ ...f, [isArabic ? "descAr" : "desc"]: v }))} 
              />
            </div>
            <div className="sx-field">
              <label>Thumbnail</label>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <input id="proj-img" type="file" accept="image/*" hidden onChange={onPick} />
                <label htmlFor="proj-img" className="file-btn">Upload</label>
                {form.img && <span className="file-hint">Selected</span>}
              </div>
            </div>
            <div className="sx-field">
              <label>Img Alt</label>
              <input 
                dir={isArabic ? "rtl" : "ltr"}
                value={isArabic ? (form.imgAltAr || "") : (form.imgAlt || "")} 
                onChange={(e)=> setForm(f => ({ ...f, [isArabic ? "imgAltAr" : "imgAlt"]: e.target.value }))} 
              />
            </div>
            <div className="sx-actions">
              <button className="btn primary" onClick={save}>Save</button>
              <button className="btn ghost" onClick={()=> setOpen(false)}>Cancel</button>
              {editId!==null && <button className="btn danger" onClick={()=>{ del(editId); setOpen(false); }}>Delete</button>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


