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
  const [tab, setTab] = useState("Category");
  const [form, setForm] = useState({
    name: "", nameAr: "", meta: "", metaAr: "", content: "", contentAr: ""
  });

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

  const list = JSON.parse(localStorage.getItem("categoryList") || "null") || sample;

  return (
    <>
      <section className="cat-card">
        <div className="tabs">
          {["Category", "Tags", "Pages"].map((t) => (
            <button key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          <div className="row">
            <label>Name</label>
            <input value={form.name} onChange={(e)=>onInput("name", e.target.value)} />
          </div>
          <div className="row">
            <label>Name/AR</label>
            <input value={form.nameAr} onChange={(e)=>onInput("nameAr", e.target.value)} />
          </div>
          <div className="row">
            <label>Meta Tag</label>
            <input value={form.meta} onChange={(e)=>onInput("meta", e.target.value)} />
          </div>
          <div className="row">
            <label>Meta Tag/AR</label>
            <input value={form.metaAr} onChange={(e)=>onInput("metaAr", e.target.value)} />
          </div>

          <div className="row" style={{ alignItems: "start" }}>
            <label>Content</label>
            <RichTextEditor value={form.content} onChange={(v)=>onInput("content", v)} />
          </div>
          <div className="row" style={{ alignItems: "start" }}>
            <label>Content/AR</label>
            <RichTextEditor value={form.contentAr} onChange={(v)=>onInput("contentAr", v)} />
          </div>

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


