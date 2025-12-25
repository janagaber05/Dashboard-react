import React, { useState, useEffect } from "react";
import "./category.css";
import Button from "../components/Button.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";
import { supabase } from "../utils/supabase";

export default function Category() {
  const [tab, setTab] = useState("category");
  const [list, setList] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isArabic, setIsArabic] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form state - different fields for different tabs
  const [form, setForm] = useState({
    // Common fields
    name: "",
    name_ar: "",
    
    // Category fields
    meta_tag: "",
    meta_tag_ar: "",
    content: "",
    content_ar: "",
    
    // Tags fields
    description: "",
    description_ar: "",
    color: "#9d4edd",
    
    // Pages fields
    slug: "",
    meta_description: "",
    meta_description_ar: "",
    featured_image: "",
    img_alt: "",
    img_alt_ar: "",
    page_content: "",
    page_content_ar: "",
    status: "draft",
    visibility: "public"
  });

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "tags") {
        // Load tags from content table with section='tag'
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('section', 'tag')
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error('Supabase error loading tags:', error);
          throw error;
        }
        
        console.log('Loaded tags:', data);
        setTags(data || []);
        setList([]);
      } else {
        // Load content from content table for category or page sections
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('section', tab)
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error('Supabase error loading content:', error);
          throw error;
        }
        
        console.log(`Loaded ${tab} data:`, data);
        setList(data || []);
        setTags([]);
      }
    } catch (error) {
        console.error('Error loading data from Supabase:', error);
      if (error.code === 'PGRST116' || error.message?.includes('404') || error.message?.includes('does not exist')) {
        console.error('❌ The "content" table does not exist in your Supabase database.');
        console.error('');
        console.error('📋 TO FIX THIS:');
        console.error('1. Go to https://supabase.com/dashboard');
        console.error('2. Select your project');
        console.error('3. Go to "SQL Editor"');
        console.error('4. Copy and paste the SQL from: supabase-content-table.sql');
        console.error('5. Click "Run"');
        console.error('');
        console.error('The SQL file is located at: /supabase-content-table.sql in your project folder');
        alert('Error: The "content" table does not exist in Supabase.\n\nPlease run the SQL script from "supabase-content-table.sql" file in your Supabase SQL Editor.\n\nCheck the browser console for detailed instructions.');
      } else {
        alert('Error loading data: ' + (error.message || 'Please check your Supabase connection and RLS policies'));
      }
      setList([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  function onInput(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function resetForm() {
    setForm({
      name: "",
      name_ar: "",
      meta_tag: "",
      meta_tag_ar: "",
      content: "",
      content_ar: "",
      description: "",
      description_ar: "",
      color: "#9d4edd",
      slug: "",
      meta_description: "",
      meta_description_ar: "",
      featured_image: "",
      img_alt: "",
      img_alt_ar: "",
      page_content: "",
      page_content_ar: "",
      status: "draft",
      visibility: "public"
    });
    setEditId(null);
    setIsArabic(false);
  }

  async function save() {
    try {
      let dataToSave = {};
      
      if (tab === "category") {
        dataToSave = {
          section: "category",
          name: form.name || null,
          name_ar: form.name_ar || null,
          meta_tag: form.meta_tag || null,
          meta_tag_ar: form.meta_tag_ar || null,
          content_en: form.content || "",
          content_ar: form.content_ar || null,
        };
      } else if (tab === "tags") {
        dataToSave = {
          section: "tag",
          name: form.name || null,
          name_ar: form.name_ar || null,
          content_en: form.description || "",
          content_ar: form.description_ar || null,
          type: form.color || null,
        };
      } else if (tab === "pages") {
        dataToSave = {
          section: "page",
          name: form.name || null,
          name_ar: form.name_ar || null,
          key: form.slug || null,
          meta_tag: form.meta_description || null,
          meta_tag_ar: form.meta_description_ar || null,
          content_en: form.page_content || "",
          content_ar: form.page_content_ar || null,
          type: JSON.stringify({ 
            featured_image: form.featured_image || "",
            img_alt: form.img_alt || "",
            img_alt_ar: form.img_alt_ar || "",
            status: form.status || "draft",
            visibility: form.visibility || "public"
          }),
        };
      }

      if (editId === null) {
        const { error } = await supabase.from('content').insert([dataToSave]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('content').update(dataToSave).eq('id', editId);
        if (error) throw error;
      }

      await loadData();
      resetForm();
      alert("Saved");
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save: ' + error.message);
    }
  }

  const handleEdit = (item) => {
    setEditId(item.id);
    setIsArabic(false);
    
    if (tab === "category") {
      setForm({
        name: item.name || "",
        name_ar: item.name_ar || "",
        meta_tag: item.meta_tag || "",
        meta_tag_ar: item.meta_tag_ar || "",
        content: item.content_en || "",
        content_ar: item.content_ar || "",
        description: "",
        description_ar: "",
        color: "#9d4edd",
        slug: "",
        meta_description: "",
        meta_description_ar: "",
        featured_image: "",
        img_alt: "",
        img_alt_ar: "",
        page_content: "",
        page_content_ar: "",
        status: "draft",
        visibility: "public"
      });
    } else if (tab === "tags") {
      const typeData = item.type || {};
      setForm({
        name: item.name || "",
        name_ar: item.name_ar || "",
        meta_tag: "",
        meta_tag_ar: "",
        content: "",
        content_ar: "",
        description: item.content_en || "",
        description_ar: item.content_ar || "",
        color: item.type || "#9d4edd",
        slug: "",
        meta_description: "",
        meta_description_ar: "",
        featured_image: "",
        img_alt: "",
        img_alt_ar: "",
        page_content: "",
        page_content_ar: "",
        status: "draft",
        visibility: "public"
      });
    } else if (tab === "pages") {
      const typeData = item.type ? (typeof item.type === 'string' ? JSON.parse(item.type) : item.type) : {};
      setForm({
        name: item.name || "",
        name_ar: item.name_ar || "",
        meta_tag: "",
        meta_tag_ar: "",
        content: "",
        content_ar: "",
        description: "",
        description_ar: "",
        color: "#9d4edd",
        slug: item.key || "",
        meta_description: item.meta_tag || "",
        meta_description_ar: item.meta_tag_ar || "",
        featured_image: typeData.featured_image || "",
        img_alt: typeData.img_alt || "",
        img_alt_ar: typeData.img_alt_ar || "",
        page_content: item.content_en || "",
        page_content_ar: item.content_ar || "",
        status: typeData.status || "draft",
        visibility: typeData.visibility || "public"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const { error } = await supabase.from('content').delete().eq('id', id);
      if (error) throw error;
      await loadData();
      if (editId === id) resetForm();
      alert("Deleted");
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleTagImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onInput("featured_image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <section className="cat-card">
        <div className="tabs">
          {["category", "tags", "pages"].map((t) => (
            <button 
              key={t} 
              className={"tab" + (tab === t ? " active" : "")} 
              onClick={() => { 
                setTab(t); 
                resetForm();
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <button 
            type="button" 
            className={"lang-btn" + (isArabic ? " active" : "")} 
            onClick={() => setIsArabic(v=>!v)}
          >
            {isArabic ? "EN" : "AR"}
          </button>
        </div>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          {/* Category Tab Fields */}
          {tab === "category" && (
            <>
              <div className="row">
                <label>Name</label>
                <input 
                  value={isArabic ? (form.name_ar || "") : (form.name || "")} 
                  onChange={(e)=>onInput(isArabic ? "name_ar" : "name", e.target.value)} 
                  placeholder={isArabic ? "Name (Arabic)" : "Name"}
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="row">
                <label>Meta Tag</label>
                <input 
                  value={isArabic ? (form.meta_tag_ar || "") : (form.meta_tag || "")} 
                  onChange={(e)=>onInput(isArabic ? "meta_tag_ar" : "meta_tag", e.target.value)} 
                  placeholder={isArabic ? "Meta Tag (Arabic)" : "Meta Tag"}
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Content</label>
                <div style={{ width: "100%" }}>
                  <RichTextEditor 
                    className={isArabic ? "rte-rtl" : ""}
                    value={isArabic ? (form.content_ar || "") : (form.content || "")}
                    onChange={(v)=>onInput(isArabic ? "content_ar" : "content", v)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Tags Tab Fields */}
          {tab === "tags" && (
            <>
              <div className="row">
                <label>Name</label>
                <input 
                  value={isArabic ? (form.name_ar || "") : (form.name || "")} 
                  onChange={(e)=>onInput(isArabic ? "name_ar" : "name", e.target.value)} 
                  placeholder={isArabic ? "Name (Arabic)" : "Name"}
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Description</label>
                <div style={{ width: "100%" }}>
                  <RichTextEditor 
                    className={isArabic ? "rte-rtl" : ""}
                    value={isArabic ? (form.description_ar || "") : (form.description || "")}
                    onChange={(v)=>onInput(isArabic ? "description_ar" : "description", v)}
                  />
                </div>
              </div>
              <div className="row">
                <label>Color</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input 
                    type="color"
                    value={form.color} 
                    onChange={(e)=>onInput("color", e.target.value)} 
                    style={{ width: "60px", height: "40px", cursor: "pointer", border: "none", borderRadius: "8px" }}
                  />
                  <input 
                    value={form.color.toUpperCase()} 
                    onChange={(e)=>onInput("color", e.target.value)} 
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Pages Tab Fields */}
          {tab === "pages" && (
            <>
              <div className="row">
                <label>Name</label>
                <input 
                  value={isArabic ? (form.name_ar || "") : (form.name || "")} 
                  onChange={(e)=>onInput(isArabic ? "name_ar" : "name", e.target.value)} 
                  placeholder={isArabic ? "Name (Arabic)" : "Name"}
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="row">
                <label>Slug/URL</label>
                <input 
                  value={form.slug || ""} 
                  onChange={(e)=>onInput("slug", e.target.value)} 
                  placeholder="e.g., about-me"
                />
              </div>
              <div className="row">
                <label>Meta Description</label>
                <input 
                  value={isArabic ? (form.meta_description_ar || "") : (form.meta_description || "")} 
                  onChange={(e)=>onInput(isArabic ? "meta_description_ar" : "meta_description", e.target.value)} 
                  placeholder={isArabic ? "Meta Description (Arabic)" : "Meta Description"}
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="row">
                <label>Featured Image</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input 
                    id="featured-img" 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleTagImagePick}
                  />
                  <label htmlFor="featured-img" className="file-btn">Upload</label>
                  {form.featured_image && (
                    <img 
                      src={form.featured_image} 
                      alt="Preview" 
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <label>Img Alt</label>
                <input 
                  value={isArabic ? (form.img_alt_ar || "") : (form.img_alt || "")} 
                  onChange={(e)=>onInput(isArabic ? "img_alt_ar" : "img_alt", e.target.value)} 
                  placeholder={isArabic ? "Image Alt (Arabic)" : "Image Alt"}
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="row" style={{ alignItems: "start" }}>
                <label>Page Content</label>
                <div style={{ width: "100%" }}>
                  <RichTextEditor 
                    className={isArabic ? "rte-rtl" : ""}
                    value={isArabic ? (form.page_content_ar || "") : (form.page_content || "")}
                    onChange={(v)=>onInput(isArabic ? "page_content_ar" : "page_content", v)}
                  />
                </div>
              </div>
              <div className="row">
                <label>Status</label>
                <div className="sx-radios">
                  <label>
                    <input 
                      type="radio" 
                      name="status" 
                      value="draft"
                      checked={form.status === "draft"} 
                      onChange={()=>onInput("status", "draft")} 
                    /> Draft
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="status" 
                      value="published"
                      checked={form.status === "published"} 
                      onChange={()=>onInput("status", "published")} 
                    /> Published
                  </label>
                </div>
              </div>
              <div className="row">
                <label>Visibility</label>
                <div className="sx-radios">
                  <label>
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="public"
                      checked={form.visibility === "public"} 
                      onChange={()=>onInput("visibility", "public")} 
                    /> Public
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="private"
                      checked={form.visibility === "private"} 
                      onChange={()=>onInput("visibility", "private")} 
                    /> Private
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="cat-actions">
            <Button variant="primary" onClick={save}>Save</Button>
            <Button variant="soft" onClick={()=>window.scrollTo({ top: 0, behavior: "smooth" })}>Preview</Button>
            {editId !== null && <Button variant="danger" onClick={()=>handleDelete(editId)}>Delete</Button>}
          </div>
        </form>

        {/* Tag List - Only show for Tags tab */}
        {tab === "tags" && tags.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ marginBottom: "15px", color: "#e0e0e0" }}>Tag List</h3>
            <div className="tag-list">
              {tags.map((tag) => (
                <div key={tag.id} className="tag-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div 
                      className="tag-dot" 
                      style={{ 
                        backgroundColor: tag.type || "#9d4edd",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%"
                      }}
                    />
                    <span className="tag-name">{tag.name || tag.name_ar || "Untitled"}</span>
                  </div>
                  <div className="tag-actions">
                    <button className="mini-btn ghost" onClick={() => handleEdit(tag)}>Edit</button>
                    <button className="mini-btn danger" onClick={() => handleDelete(tag.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* List section - Only show for Category and Pages tabs */}
      {(tab === "category" || tab === "pages") && (
        <section className="list">
          <div className="thead" style={{ gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr" }}>
            <div className="th">Name</div>
            <div className="th">{tab === "category" ? "Meta Tag" : "Slug"}</div>
            <div className="th">Content</div>
            <div className="th">Action</div>
          </div>
          <div className="tbody">
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>Loading content...</div>
            ) : list.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", gridColumn: "1 / -1" }}>No content found</div>
            ) : (
              list.map((r) => (
                <div className="tr" key={r.id} style={{ gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr" }}>
                  <div className="td">{r.name || r.name_ar || "-"}</div>
                  <div className="td">{tab === "category" ? (r.meta_tag || r.meta_tag_ar || "-") : (r.key || "-")}</div>
                  <div className="td" style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.content_en || r.content_ar || "-"}
                  </div>
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
      )}
    </>
  );
}
