import React, { useState } from "react";
import "./category.css";
import Button from "../components/Button.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";

const sample = [
  { type: "Category", name: "Web Design", desc: "Projects related to web design" },
  { type: "Tags", name: "UX/UI", desc: "Posts related to UX/UI" },
  { type: "Pages", name: "3D Modeling", desc: "Pages related to 3D projects" },
];

export default function Category() {
  const [tab, setTab] = useState("Pages");
  const [form, setForm] = useState({
    name: "", nameAr: "",
    meta: "", metaAr: "",
    content: "", contentAr: "",
    slug: "", metaDesc: "", metaDescAr: "",
    img: "", imgAlt: "", imgAltAr: "",
    status: "Draft", visibility: "Public",
    color: "#FEF4FF"
  });
  const [imgPreview, setImgPreview] = useState("");
  const [tags, setTags] = useState(["UX/UI","Web Design","App Design","3D","Graphic Design","Blogs"]);
  const [editingTagIdx, setEditingTagIdx] = useState(null);
  const [isArabic, setIsArabic] = useState(false);

  function onInput(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function save() {
    // A real app would POST. For now just store locally.
    const list = JSON.parse(localStorage.getItem("categoryList") || "[]");
    list.unshift({ type: tab, name: form.name || "(Untitled)", desc: form.meta || "—" });
    localStorage.setItem("categoryList", JSON.stringify(list.slice(0, 20)));
    // eslint-disable-next-line no-alert
    alert("Saved");
  }

  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      setImgPreview(r.result);
      setForm(f => ({ ...f, img: r.result }));
    };
    r.readAsDataURL(file);
  }

  const list = JSON.parse(localStorage.getItem("categoryList") || "null") || sample;

  return (
    <>
      <section className="cat-card">
        <div className="tabs">
          {["Pages", "Tags", "Category"].map((t) => (
            <button key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
          <button type="button" className={"lang-btn" + (isArabic ? " active" : "")} onClick={() => setIsArabic(v=>!v)}>
            {isArabic ? "EN" : "AR"}
          </button>
        </div>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          {tab === "Pages" ? (
            <>
              <div className="row">
                <label>Name</label>
                <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? form.nameAr : form.name} onChange={(e)=>onInput(isArabic ? "nameAr" : "name", e.target.value)} />
              </div>
              <div className="row">
                <label>Slug/URL</label>
                <input value={form.slug} onChange={(e)=>onInput("slug", e.target.value)} />
              </div>
              <div className="row">
                <label>Meta Description</label>
                <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? form.metaDescAr : form.metaDesc} onChange={(e)=>onInput(isArabic ? "metaDescAr" : "metaDesc", e.target.value)} />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Featured Image</label>
                <div style={{ width: "100%" }}>
                  {imgPreview && <img src={imgPreview} alt="Preview" style={{ width:"100%", borderRadius:12, boxShadow:"0 6px 16px rgba(0,0,0,.12)" }} />}
                  <div style={{ marginTop: 8, display:"flex", gap:8, alignItems:"center" }}>
                    <input id="page-img" className="file-input" type="file" accept="image/*" onChange={onPickImage} hidden />
                    <label htmlFor="page-img" className="file-btn">Upload Image</label>
                    {imgPreview ? <span className="file-hint">Image selected</span> : <span className="file-hint">PNG/JPG up to 5MB</span>}
                  </div>
                </div>
              </div>
              <div className="row">
                <label>Img Alt</label>
                <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? form.imgAltAr : form.imgAlt} onChange={(e)=>onInput(isArabic ? "imgAltAr" : "imgAlt", e.target.value)} />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Page Content</label>
                <RichTextEditor className={isArabic ? "rte-rtl" : ""} value={isArabic ? form.contentAr : form.content} onChange={(v)=>onInput(isArabic ? "contentAr" : "content", v)} />
              </div>
              <div className="row">
                <label>Statuses:</label>
                <div>
                  <label style={{ marginRight: 12 }}><input type="radio" name="status" checked={form.status==="Draft"} onChange={()=>onInput("status","Draft")} /> Draft</label>
                  <label style={{ marginRight: 12 }}><input type="radio" name="status" checked={form.status==="Published"} onChange={()=>onInput("status","Published")} /> Published</label>
                </div>
              </div>
              <div className="row">
                <label>Visibility</label>
                <div>
                  <label style={{ marginRight: 12 }}><input type="radio" name="visibility" checked={form.visibility==="Public"} onChange={()=>onInput("visibility","Public")} /> Public</label>
                  <label><input type="radio" name="visibility" checked={form.visibility==="Privet"} onChange={()=>onInput("visibility","Privet")} /> Privet</label>
                </div>
              </div>
            </>
          ) : tab === "Tags" ? (
            <>
              <div className="row">
                <label>Name</label>
                <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? form.nameAr : form.name} onChange={(e)=>onInput(isArabic ? "nameAr" : "name", e.target.value)} />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Description</label>
                <RichTextEditor className={isArabic ? "rte-rtl" : ""} value={isArabic ? form.contentAr : form.content} onChange={(v)=>onInput(isArabic ? "contentAr" : "content", v)} />
              </div>
              <div className="row">
                <label>Color:</label>
                <input style={{ width: 100 }} type="color" value={form.color} onChange={(e)=>onInput("color", e.target.value)} />
                <span style={{ marginLeft: 8, color: "#7b46c7", fontSize: 12 }}>{form.color.toUpperCase()}</span>
              </div>

              <div className="row" style={{ alignItems: "start" }}>
                <label>Tag List</label>
                <div className="tag-list">
                  {tags.map((t, i) => (
                    <div className="tag-item" key={i}>
                      <div className="tag-dot" style={{ background: form.color }} />
                      <div className="tag-name">{t}</div>
                      <div className="tag-actions">
                        <img
                          className="tag-ico"
                          src={process.env.PUBLIC_URL + "/icons/pencil-sm.svg"}
                          alt="edit"
                          onClick={() => { setEditingTagIdx(i); setForm(f => ({...f, name: t})); }}
                        />
                        <img
                          className="tag-ico"
                          src={process.env.PUBLIC_URL + "/icons/trash-sm.svg"}
                          alt="delete"
                          onClick={() => setTags(tags.filter((_,idx)=>idx!==i))}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="tag-actions-row">
                    <button
                      type="button"
                      className="mini-btn"
                      onClick={()=>{
                        if (!form.name?.trim()) return;
                        if (editingTagIdx!==null){
                          setTags(tags.map((t,idx)=> idx===editingTagIdx ? form.name.trim() : t));
                          setEditingTagIdx(null);
                        } else {
                          setTags([ ...tags, form.name.trim() ]);
                        }
                        setForm(f=>({...f, name:""}));
                      }}
                    >
                      {editingTagIdx!==null ? "Save" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <label>Name</label>
                <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? form.nameAr : form.name} onChange={(e)=>onInput(isArabic ? "nameAr" : "name", e.target.value)} />
              </div>
              <div className="row">
                <label>Meta Tag</label>
                <input dir={isArabic ? "rtl" : "ltr"} value={isArabic ? form.metaAr : form.meta} onChange={(e)=>onInput(isArabic ? "metaAr" : "meta", e.target.value)} />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Content</label>
                <RichTextEditor className={isArabic ? "rte-rtl" : ""} value={isArabic ? form.contentAr : form.content} onChange={(v)=>onInput(isArabic ? "contentAr" : "content", v)} />
              </div>
            </>
          )}

          <div className="cat-actions">
            <Button variant="primary" onClick={save}>Save</Button>
            <Button variant="soft" onClick={()=>window.scrollTo({ top: 0, behavior: "smooth" })}>Preview</Button>
            <Button variant="danger" onClick={()=>alert("Deleted")}>Delete</Button>
          </div>
        </form>
      </section>

      <section className="list">
        <div className="thead">
          <div className="th">Type</div>
          <div className="th">Name</div>
          <div className="th">Description</div>
          <div className="th">Action</div>
        </div>
        <div className="tbody">
          {list.map((r, i) => (
            <div className="tr" key={i}>
              <div className="td">{r.type}</div>
              <div className="td">{r.name}</div>
              <div className="td">{r.desc}</div>
              <div className="td">
                <div className="acts">
                  <img src={process.env.PUBLIC_URL + "/icons/pencil.svg"} alt="edit" />
                  <img src={process.env.PUBLIC_URL + "/icons/trash.svg"} alt="delete" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


