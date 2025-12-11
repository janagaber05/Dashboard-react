import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/auth";
import "./logout.css";
import Button from "./Button.jsx";

export default function LogoutModal({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;
  const doLogout = () => {
    // Clear authentication
    auth.logout();
    // Close modal
    onClose && onClose();
    // Redirect to login page
    navigate("/login", { replace: true });
  };
  return (
    <>
      <div className="lg-backdrop" onClick={onClose} />
      <div className="lg-modal" role="dialog" aria-modal="true" aria-labelledby="lg-title">
        <div className="lg-icon">⎋</div>
        <h3 id="lg-title" className="lg-title">Log out?</h3>
        <p className="lg-text">You can sign back in at any time. Are you sure you want to log out now?</p>
        <div className="lg-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={doLogout}>Log Out</Button>
        </div>
      </div>
    </>
  );
}


