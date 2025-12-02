import React, { useEffect, useRef, useState } from "react";
import "./StandardRichTextEditor.css";

export default function StandardRichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
}) {
  const [html, setHtml] = useState(value || "");
  const editableRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setHtml(value || "");
  }, [value]);

  function focusEditable() {
    editableRef.current?.focus();
  }
  function exec(cmd, arg) {
    focusEditable();
    document.execCommand(cmd, false, arg);
    sync();
  }
  function sync() {
    const next = editableRef.current?.innerHTML || "";
    setHtml(next);
    onChange && onChange(next);
  }
  function onInput() {
    sync();
  }
  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      focusEditable();
      document.execCommand("insertImage", false, r.result);
      sync();
    };
    r.readAsDataURL(file);
    e.target.value = "";
  }
  function onCreateLink() {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  }

  return (
    <div className={"srte " + className}>
      <div className="srte-toolbar" onMouseDown={(e)=>e.preventDefault()}>
        <button className="tbtn" title="Undo" onClick={()=>exec("undo")}>↶</button>
        <button className="tbtn" title="Redo" onClick={()=>exec("redo")}>↷</button>
        <span className="sep" />
        <button className="tbtn" title="Bold" onClick={()=>exec("bold")}><b>B</b></button>
        <button className="tbtn" title="Italic" onClick={()=>exec("italic")}><i>I</i></button>
        <button className="tbtn" title="Underline" onClick={()=>exec("underline")}><u>U</u></button>
        <button className="tbtn" title="Strike" onClick={()=>exec("strikeThrough")}><s>S</s></button>
        <span className="sep" />
        <button className="tbtn" title="Bulleted list" onClick={()=>exec("insertUnorderedList")}>•</button>
        <button className="tbtn" title="Numbered list" onClick={()=>exec("insertOrderedList")}>1.</button>
        <span className="sep" />
        <button className="tbtn" title="Align left" onClick={()=>exec("justifyLeft")}>⟸</button>
        <button className="tbtn" title="Align center" onClick={()=>exec("justifyCenter")}>⟂</button>
        <button className="tbtn" title="Align right" onClick={()=>exec("justifyRight")}>⟹</button>
        <button className="tbtn" title="Justify" onClick={()=>exec("justifyFull")}>≋</button>
        <span className="sep" />
        <select className="sel" onChange={(e)=>exec("formatBlock", e.target.value)}>
          <option value="p">Paragraph</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <span className="sep" />
        <button className="tbtn" title="Link" onClick={onCreateLink}>🔗</button>
        <button className="tbtn" title="Unlink" onClick={()=>exec("unlink")}>✕</button>
        <button className="tbtn" title="Image" onClick={()=>fileRef.current?.click()}>🖼</button>
        <input ref={fileRef} hidden type="file" accept="image/*" onChange={onPickImage} />
        <button className="tbtn" title="Clear formatting" onClick={()=>exec("removeFormat")}>⌫</button>
      </div>
      <div
        ref={editableRef}
        className="srte-editable"
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        dangerouslySetInnerHTML={{ __html: html || "" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}


