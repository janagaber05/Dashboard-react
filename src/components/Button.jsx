import React from "react";
import "./button.css";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | soft | ghost | danger | link
  size = "md", // sm | md | lg
  className = "",
  icon, // optional icon path
  block = false, // full width
  square = false, // square corners
  loading = false,
  disabled = false,
}) {
  const cls = [
    "btn",
    variant,
    size,
    block ? "block" : "",
    square ? "square" : "",
    loading ? "loading" : "",
    disabled ? "disabled" : "",
    className,
  ].join(" ").trim();
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && icon && <img className="btn-ico" src={icon} alt="" />}
      <span className="btn-label">{children}</span>
    </button>
  );
}


