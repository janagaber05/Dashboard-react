import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nva from "../components/Nva.jsx";
import Home from "../pages/Home.jsx";
import Messages from "../pages/Messages.jsx";
import Message from "../pages/Message.jsx";
import Settings from "../pages/Settings.jsx";
import Category from "../pages/Category.jsx";

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}><h2>{title}</h2><p>Coming soon.</p></div>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="nv-app">
        <Nva />
        <div className="nv-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/message" element={<Message />} />
            <Route path="/projects" element={<Placeholder title="Projects" />} />
            <Route path="/skills" element={<Placeholder title="Skills" />} />
            <Route path="/experience" element={<Placeholder title="Experience" />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}


