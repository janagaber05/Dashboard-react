import React, { useState, useEffect } from "react";
import "./category.css";
import Button from "../components/Button.jsx";
import { supabase } from "../utils/supabase";

export default function Category() {
  const [tab, setTab] = useState("home");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    section: "home",
    key: "",
    content_en: "",
    name_ar: "",
    type: null,
    display_order: 0
  });
  const [isArabic, setIsArabic] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadContent();
  }, [tab]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section', tab)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setList(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  function onInput(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    try {
      const contentData = {
        section: tab,
        key: form.key || null,
        content_en: form.content_en || "",
        name_ar: form.name_ar || null,
        type: form.type || null,
        display_order: form.display_order || 0
      };

      if (editId === null) {
        const { error } = await supabase.from('content').insert([contentData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('content').update(contentData).eq('id', editId);
        if (error) throw error;
      }

      await loadContent();
      setForm({
        section: tab,
        key: "",
        content_en: "",
        name_ar: "",
        type: null,
        display_order: 0
      });
      setEditId(null);
      alert("Saved");
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save: ' + error.message);
    }
  }

  const handleEdit = (item) => {
    setForm({
      section: item.section || tab,
      key: item.key || "",
      content_en: item.content_en || "",
      name_ar: item.name_ar || "",
      type: item.type || null,
      display_order: item.display_order || 0
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const { error } = await supabase.from('content').delete().eq('id', id);
      if (error) throw error;
      await loadContent();
      alert("Deleted");
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete: ' + error.message);
    }
  };

  return (
    <>
      <section className="cat-card">
        <div className="tabs">
          {["home", "about", "category"].map((t) => (
            <button key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => { setTab(t); setEditId(null); setForm({ section: t, key: "", content_en: "", name_ar: "", type: null, display_order: 0 }); }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <button type="button" className={"lang-btn" + (isArabic ? " active" : "")} onClick={() => setIsArabic(v=>!v)}>
            {isArabic ? "EN" : "AR"}
          </button>
        </div>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          <div className="row">
            <label>Key</label>
            <input 
              value={form.key || ""} 
              onChange={(e)=>onInput("key", e.target.value)} 
              placeholder="e.g., category_cta_text, about_hero_title"
              disabled={editId !== null}
            />
          </div>
          <div className="row">
            <label>Content (English)</label>
            <textarea 
              dir="ltr"
              value={form.content_en || ""} 
              onChange={(e)=>onInput("content_en", e.target.value)}
              rows={4}
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
          </div>
          <div className="row">
            <label>Content (Arabic)</label>
            <textarea 
              dir="rtl"
              value={form.name_ar || ""} 
              onChange={(e)=>onInput("name_ar", e.target.value)}
              rows={4}
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
          </div>
          <div className="row">
            <label>Type</label>
            <input 
              value={form.type || ""} 
              onChange={(e)=>onInput("type", e.target.value || null)} 
              placeholder="Optional type"
            />
          </div>
          <div className="row">
            <label>Display Order</label>
            <input 
              type="number"
              value={form.display_order || 0} 
              onChange={(e)=>onInput("display_order", parseInt(e.target.value) || 0)} 
            />
          </div>

          <div className="cat-actions">
            <Button variant="primary" onClick={save}>Save</Button>
            <Button variant="soft" onClick={()=>window.scrollTo({ top: 0, behavior: "smooth" })}>Preview</Button>
            {editId !== null && <Button variant="danger" onClick={()=>handleDelete(editId)}>Delete</Button>}
          </div>
        </form>
      </section>

      <section className="list">
        <div className="thead">
          <div className="th">Key</div>
          <div className="th">Content (EN)</div>
          <div className="th">Content (AR)</div>
          <div className="th">Order</div>
          <div className="th">Action</div>
        </div>
        <div className="tbody">
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>Loading content...</div>
          ) : list.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>No content found</div>
          ) : (
            list.map((r) => (
              <div className="tr" key={r.id}>
                <div className="td">{r.key || "-"}</div>
                <div className="td" style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.content_en || "-"}
                </div>
                <div className="td" style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.name_ar || "-"}
                </div>
                <div className="td">{r.display_order || 0}</div>
                <div className="td">
                  <div className="acts">
                    <img src={process.env.PUBLIC_URL + "/icons/pencil.svg"} alt="edit" onClick={() => handleEdit(r)} />
                    <img src={process.env.PUBLIC_URL + "/icons/trash.svg"} alt="delete" onClick={() => handleDelete(r.id)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}


