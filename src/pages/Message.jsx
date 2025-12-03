import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./message.css";
import Button from "../components/Button.jsx";

export default function Message() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const msg = state || {
    name: "Salma Ahmed",
    email: "SalmaAhmed12@mail.com",
    subject: "Website Design Request",
    date: "12/5/25",
    time: "10:29 PM",
    body:
      "Hi, I loved your portfolio and I’d like you to design a website for my bakery. Please contact me…",
  };

  const markAsRead = () => {
    
    alert("Marked as read");
    navigate(-1);
  };
  const reply = () => {
    const subject = `Re: ${msg.subject || "Message"}`;
    window.location.href = `mailto:${msg.email}?subject=${encodeURIComponent(subject)}`;
  };
  const del = () => {

    const ok = window.confirm("Delete this message?");
    if (ok) navigate(-1);
  };

  return (
    <div className="msg-card">
      <div className="msg-row">
        <div className="msg-label">
          <img className="msg-ico" src={process.env.PUBLIC_URL + "/icons/user.svg"} alt="" />
          {msg.name}
        </div>
      </div>
      <div className="msg-row">
        <div className="msg-field">
          <span className="muted">Email:</span> {msg.email}
        </div>
      </div>
      <div className="msg-row two">
        <div className="msg-field">
          <span className="muted">Date:</span> {msg.date || "9/5/2025"}
        </div>
        <div className="msg-field">
          <span className="muted">At</span> {msg.time || "10:29 PM"}
        </div>
      </div>
      <hr />
      <div className="msg-row">
        <div className="msg-field">
          <span className="muted">Subject:</span> {msg.subject}
        </div>
      </div>
      <div className="msg-row col">
        <div className="msg-field">
          <div className="muted">Message:</div>
          <p className="msg-body">
            {msg.body}
          </p>
        </div>
      </div>
      <div className="msg-actions">
        <Button variant="soft" onClick={markAsRead}>Mark as Read</Button>
        <Button variant="soft" onClick={reply}>Replay</Button>
        <Button variant="danger" onClick={del}>Delete</Button>
      </div>
    </div>
  );
}


