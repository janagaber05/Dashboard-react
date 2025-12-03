import React, { useMemo, useState } from "react";
import "./projects.css";
import RichTextEditor from "../components/RichTextEditor.jsx";

const seed = [
  {
    title: "Giza Zoo Website",
    titleAr: "",
    desc: "A website that represent giza zoo in funny childish way",
    descAr: "",
    tag: "Web Design",
    link: "https://github-link...",
    lang: "EN",
    img: "",
  },
  {
    title: "Giza Zoo Website",
    titleAr: "",
    desc: "A website that represent giza zoo in funny childish way",
    descAr: "",
    tag: "Web Design",
    link: "https://github-link...",
    lang: "EN",
    img: "",
  },
  {
    title: "Giza Zoo Website",
    titleAr: "",
    desc: "A website that represent giza zoo in funny childish way",
    descAr: "",
    tag: "Web Design",
    link: "https://github-link...",
    lang: "EN",
    img: "",
  },
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

export default function Projects() {
  const [projects, setProjects] = useState(seed);
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
  const [editIdx, setEditIdx] = useState(null);

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
    setEditIdx(null);
    setOpen(true);
  }
  function openEdit(idx) {
    setForm(projects[idx]);
    setIsArabic(false);
    setEditIdx(idx);
    setOpen(true);
  }
  function save() {
    const data = { ...form };
    if (editIdx === null) {
      setProjects([data, ...projects]);
    } else {
      setProjects(projects.map((p,i)=> i===editIdx ? data : p));
    }
    setOpen(false);
  }
  function del(idx) {
    if (!window.confirm("Delete project?")) return;
    setProjects(projects.filter((_,i)=> i!==idx));
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
        {view.map((p, i) => (
          <div className="proj-row" key={i}>
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
              <button className="mini" onClick={()=> openEdit((page-1)*perPage + i)}>Edit</button>
              <img className="tag-ico" src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"} alt="delete" onClick={()=> del((page-1)*perPage + i)} />
            </div>
          </div>
        ))}
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
            <h3 className="sx-modal-title">{editIdx===null ? "Add New Project" : "Edit Project"}</h3>
            <div className="sx-field">
              <label>Project Title</label>
              <input value={form.title} onChange={(e)=> setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="sx-field">
              <label>Project Title/AR</label>
              <input dir="rtl" value={form.titleAr} onChange={(e)=> setForm(f => ({ ...f, titleAr: e.target.value }))} />
            </div>
            <div className="sx-field">
              <label>Meta Tag</label>
              <input value={form.metaTag} onChange={(e)=> setForm(f => ({ ...f, metaTag: e.target.value }))} />
            </div>
            <div className="sx-field">
              <label>Meta Tag/AR</label>
              <input dir="rtl" value={form.metaTagAr} onChange={(e)=> setForm(f => ({ ...f, metaTagAr: e.target.value }))} />
            </div>
            <div className="sx-field">
              <label>Meta Description</label>
              <input value={form.metaDesc} onChange={(e)=> setForm(f => ({ ...f, metaDesc: e.target.value }))} />
            </div>
            <div className="sx-field">
              <label>Meta Description/AR</label>
              <input dir="rtl" value={form.metaDescAr} onChange={(e)=> setForm(f => ({ ...f, metaDescAr: e.target.value }))} />
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
              <RichTextEditor value={form.desc} onChange={(v)=> setForm(f => ({ ...f, desc: v }))} />
            </div>
            <div className="sx-field" style={{ alignItems: "start" }}>
              <label>Description/AR</label>
              <RichTextEditor className="rte-rtl" value={form.descAr} onChange={(v)=> setForm(f => ({ ...f, descAr: v }))} />
            </div>
            <div className="sx-field">
              <label>Thumbnail</label>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <input id="proj-img" type="file" accept="image/*" hidden onChange={onPick} />
                <label htmlFor="proj-img" className="file-btn">Upload</label>
                {form.img && <span className="file-hint">Selected</span>}
              </div>
            </div>
            <div className="sx-field"><label>Img Alt</label>
              <input value={form.imgAlt} onChange={(e)=> setForm(f => ({ ...f, imgAlt: e.target.value }))} />
            </div>
            <div className="sx-field"><label>Img Alt/AR</label>
              <input dir="rtl" value={form.imgAltAr} onChange={(e)=> setForm(f => ({ ...f, imgAltAr: e.target.value }))} />
            </div>
            <div className="sx-actions">
              <button className="btn primary" onClick={save}>Save</button>
              <button className="btn ghost" onClick={()=> setOpen(false)}>Cancel</button>
              {editIdx!==null && <button className="btn danger" onClick={()=>{ del(editIdx); setOpen(false); }}>Delete</button>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


