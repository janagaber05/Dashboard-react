import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/auth";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const VALID_EMAIL = "JanaGaber2910@gmail.com";
  const VALID_PASSWORD = "Eui@2005";

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Validate credentials
    if (email.trim() !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    
    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // In a real app, you would send this OTP to the user's email/phone
    console.log("OTP generated:", otp);
    alert(`OTP sent: ${otp}\n(In production, this would be sent to ${email})`);
    
    // Navigate to OTP verification page with OTP in state
    navigate("/otp", {
      state: { otp, email, rememberMe }
    });
  };

  return (
    <div className="login-container">
      <img 
        className="login-illustration" 
        src={process.env.PUBLIC_URL + "/img/Login_pic/login-pic.png"} 
        alt="Login illustration" 
      />
      <div className="login-card">
        <div className="login-logo">
          <img 
            className="logo-img" 
            src={process.env.PUBLIC_URL + "/img/logo.png"} 
            alt="Logo" 
          />
        </div>
        <h2 className="login-title">Login with your Email</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3H3C2.175 3 1.5 3.675 1.5 4.5V13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V4.5C16.5 3.675 15.825 3 15 3ZM15 5.25L9 9.75L3 5.25V4.5L9 9L15 4.5V5.25Z" fill="#8a7b91"/>
              </svg>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 6.75H13.05V5.25C13.05 2.85 11.1 0.9 8.7 0.9C6.3 0.9 4.35 2.85 4.35 5.25V6.75H3.9C3.075 6.75 2.4 7.425 2.4 8.25V14.25C2.4 15.075 3.075 15.75 3.9 15.75H13.5C14.325 15.75 15 15.075 15 14.25V8.25C15 7.425 14.325 6.75 13.5 6.75ZM8.7 12C8.025 12 7.5 11.475 7.5 10.8C7.5 10.125 8.025 9.6 8.7 9.6C9.375 9.6 9.9 10.125 9.9 10.8C9.9 11.475 9.375 12 8.7 12ZM11.1 6.75H6.3V5.25C6.3 3.975 7.425 2.85 8.7 2.85C9.975 2.85 11.1 3.975 11.1 5.25V6.75Z" fill="#8a7b91"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={showPassword ? "password-visible" : ""}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img 
                  src={process.env.PUBLIC_URL + "/icons/eye.svg"} 
                  alt={showPassword ? "Hide" : "Show"} 
                  className="eye-icon"
                />
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <a href="#" className="login-forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">
            <svg className="login-button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  );
}

