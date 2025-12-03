import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";

export default function Nva({ onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <button
        className="nv-burger"
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        <img className="nv-ico" src="/icons/menu.svg" alt="Menu" />
      </button>
      <div className={"nv-backdrop" + (open ? " nv-show" : "")} onClick={close} />
      <aside className={"nv-sidebar" + (open ? " nv-open" : "")}>
        <div className="nv-profile">
          <img
            className="nv-avatar"
            src={process.env.PUBLIC_URL + "/logo192.png"}
            alt="Profile"
            onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src="/logo192.png"; }}
          />
          <div className="nv-name">Jana Gaber</div>
          <div className="nv-email">Janagaber9201@gmail.com</div>
        </div>
        <nav className="nv-nav" onClick={close}>
          <NavLink to="/" end className={({isActive}) => "nv-link" + (isActive ? " nv-active" : "")}>
            <img className="nv-ico" src="/icons/home.svg" alt="" />Home
          </NavLink>
          <NavLink to="/projects" className={({isActive}) => "nv-link" + (isActive ? " nv-active" : "")}>
            <img className="nv-ico" src="/icons/folder.svg" alt="" />Projects
          </NavLink>
          <NavLink to="/skills" className={({isActive}) => "nv-link" + (isActive ? " nv-active" : "")}>
            <img className="nv-ico" src="/icons/star.svg" alt="" />Skills, Experience
          </NavLink>
          <NavLink to="/categories" className={({isActive}) => "nv-link" + (isActive ? " nv-active" : "")}>
            <img className="nv-ico" src="/icons/folder.svg" alt="" />Categories
          </NavLink>
          <NavLink to="/messages" className={({isActive}) => "nv-link" + (isActive ? " nv-active" : "")}>
            <img className="nv-ico" src="/icons/mail.svg" alt="" />Messages
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => "nv-link" + (isActive ? " nv-active" : "")}>
            <img className="nv-ico" src="/icons/settings.svg" alt="" />Settings
          </NavLink>
          <button className="nv-link" onClick={(e)=>{ e.preventDefault(); onLogout && onLogout(); }}>
            <img className="nv-ico" src="/icons/power.svg" alt="" />Log-Out
          </button>
        </nav>
      </aside>
    </>
  );
}


