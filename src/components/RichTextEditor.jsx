import React, { useEffect, useRef, useState } from "react";
import "./RichTextEditor.css";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write here...",
  className = "",
}) {
  const [html, setHtml] = useState(value || "");
  const editableRef = useRef(null);
  const fileRef = useRef(null);
  const ddRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [formatLabel, setFormatLabel] = useState("Paragraph");

  useEffect(() => {
    setHtml(value || "");
  }, [value]);

  function focusEditable() {
    editableRef.current?.focus();
  }

  function exec(command, arg) {
    focusEditable();
    document.execCommand(command, false, arg);
    syncHtml();
  }

  function syncHtml() {
    const next = editableRef.current?.innerHTML || "";
    setHtml(next);
    onChange && onChange(next);
  }

  function onInput() {
    syncHtml();
  }

  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      focusEditable();
      document.execCommand("insertImage", false, r.result);
      syncHtml();
    };
    r.readAsDataURL(file);
    e.target.value = "";
  }

  function onCreateLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    exec("createLink", url);
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className={"rte " + className}>
      <div className="rte-toolbar" onMouseDown={(e)=>e.preventDefault()}>
        <button className="rte-btn" aria-label="Bold" onClick={()=>exec("bold")}><b>B</b></button>
        <button className="rte-btn" aria-label="Italic" onClick={()=>exec("italic")}><i>I</i></button>
        <button className="rte-btn" aria-label="Underline" onClick={()=>exec("underline")}><u>U</u></button>
        <span className="rte-sep" />
        <button className="rte-btn" aria-label="Align left" onClick={()=>exec("justifyLeft")}>
          <svg className="rte-ico" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="13" y2="18" />
          </svg>
        </button>
        <button className="rte-btn" aria-label="Align center" onClick={()=>exec("justifyCenter")}>
          <svg className="rte-ico" viewBox="0 0 24 24">
            <line x1="6" y1="6" x2="18" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
        </button>
        <button className="rte-btn" aria-label="Align right" onClick={()=>exec("justifyRight")}>
          <svg className="rte-ico" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="11" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="rte-sep" />
        <button className="rte-btn" aria-label="Link" onClick={onCreateLink}>
          <svg className="rte-ico" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
            <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 1 0 7 7L12 19.8" />
          </svg>
        </button>
        <button className="rte-btn" aria-label="Image" onClick={()=>fileRef.current?.click()}>
          <svg className="rte-ico" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="M21 17l-5-5-4 4-3-3-4 4" />
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
        <span className="rte-spacer" />
        <div className="rte-dd" ref={ddRef}>
          <button className="rte-dd-btn" onClick={()=>setOpen(v=>!v)}>{formatLabel}</button>
          {open && (
            <div className="rte-dd-menu">
              <button onClick={()=>{exec("formatBlock","p");setFormatLabel("Paragraph");setOpen(false);}}>Paragraph</button>
              <button onClick={()=>{exec("formatBlock","h1");setFormatLabel("H1");setOpen(false);}}>H1</button>
              <button onClick={()=>{exec("formatBlock","h2");setFormatLabel("H2");setOpen(false);}}>H2</button>
              <button onClick={()=>{exec("formatBlock","h3");setFormatLabel("H3");setOpen(false);}}>H3</button>
              <div className="rte-dd-divider" />
              <button onClick={()=>{exec("insertUnorderedList");setFormatLabel("Bulleted list");setOpen(false);}}>Bulleted list</button>
              <button onClick={()=>{exec("insertOrderedList");setFormatLabel("Numbered list");setOpen(false);}}>Numbered list</button>
            </div>
          )}
        </div>
      </div>
      <div
        ref={editableRef}
        className="rte-editable"
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        dangerouslySetInnerHTML={{ __html: html || "" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}


