import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./nav.css";

export default function Nva({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    photo: "/logo192.png",
    name: "Jana Gaber",
    email: "Janagaber9201@gmail.com"
  });
  const location = useLocation();
  
  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);
  
  // Load profile data from localStorage
  const loadProfileData = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("profileSettings") || "{}");
      setProfileData({
        photo: saved.photo || "/logo192.png",
        name: saved.name || "Jana Gaber",
        email: saved.email || "Janagaber9201@gmail.com"
      });
    } catch (e) {
      console.error("Error loading profile data:", e);
    }
  };
  
  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);
  
  // Listen for storage changes to update profile picture in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "profileSettings") {
        loadProfileData();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event for same-tab updates
    window.addEventListener("profileSettingsUpdated", loadProfileData);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileSettingsUpdated", loadProfileData);
    };
  }, []);
  
  // Close sidebar on route change (mobile)
  useEffect(() => {
    close();
  }, [location.pathname]);
  
  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open && window.innerWidth <= 780) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        className="nv-burger"
        aria-label="Open menu"
        onClick={toggle}
        type="button"
      >
        <img className="nv-ico" src="/icons/menu.svg" alt="Menu" />
      </button>
      <div 
        className={"nv-backdrop" + (open ? " nv-show" : "")} 
        onClick={close}
        aria-hidden="true"
      />
      <aside className={"nv-sidebar" + (open ? " nv-open" : "")}>
        <div className="nv-profile">
          <img
            className="nv-avatar"
            src={profileData.photo}
            alt="Profile"
            onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src="/logo192.png"; }}
          />
          <div className="nv-name">{profileData.name}</div>
          <div className="nv-email">{profileData.email}</div>
        </div>
        <nav className="nv-nav">
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
          <button 
            className="nv-link" 
            onClick={(e)=>{ 
              e.preventDefault(); 
              close();
              onLogout && onLogout(); 
            }}
            type="button"
          >
            <img className="nv-ico" src="/icons/power.svg" alt="" />Log-Out
          </button>
        </nav>
      </aside>
    </>
  );
}


