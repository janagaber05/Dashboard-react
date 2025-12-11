import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Nva from "../components/Nva.jsx";
import Home from "../pages/Home.jsx";
import Messages from "../pages/Messages.jsx";
import Message from "../pages/Message.jsx";
import Settings from "../pages/Settings.jsx";
import SkillsExperience from "../pages/SkillsExperience.jsx";
import Projects from "../pages/Projects.jsx";
import Category from "../pages/Category.jsx";
import Login from "../pages/Login.jsx";
import OtpVerification from "../pages/OtpVerification.jsx";
import LogoutModal from "../components/LogoutModal.jsx";
import { auth } from "../utils/auth";

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}><h2>{title}</h2><p>Coming soon.</p></div>;
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [navigate, location]);

  // Don't render children if not authenticated (will redirect)
  if (!auth.isAuthenticated()) {
    return null;
  }

  return children;
}

function DashboardLayout({ children, onLogout, showLogout, setShowLogout }) {
  return (
    <ProtectedRoute>
      <div className="nv-app">
        <Nva onLogout={onLogout} />
        <div className="nv-content">
          {children}
        </div>
        <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
      </div>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  const [showLogout, setShowLogout] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route
          path="/*"
          element={
            <DashboardLayout
              onLogout={() => setShowLogout(true)}
              showLogout={showLogout}
              setShowLogout={setShowLogout}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message" element={<Message />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<SkillsExperience />} />
                <Route path="/experience" element={<SkillsExperience />} />
                <Route path="/categories" element={<Category />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


