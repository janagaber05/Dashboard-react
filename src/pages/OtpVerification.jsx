import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../utils/auth";
import "./otp.css";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const storedOtp = location.state?.otp;
  const email = location.state?.email || "";

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Redirect if already authenticated or no OTP in state
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate("/", { replace: true });
    } else if (!storedOtp) {
      navigate("/login", { replace: true });
    }
  }, [storedOtp, navigate]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      if (pastedData[i]) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    inputRefs.current[3]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 4) {
      alert("Please enter the complete OTP");
      return;
    }

    if (enteredOtp === storedOtp) {
      // OTP is correct, complete login
      const rememberMe = location.state?.rememberMe || false;
      auth.login(rememberMe);
      navigate("/", { replace: true });
    } else {
      alert("Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (timeLeft > 0 || isResending) return;
    
    setIsResending(true);
    // Generate new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // In a real app, you would send this OTP to the user's email/phone
    console.log("Resending OTP:", newOtp);
    alert(`New OTP sent: ${newOtp} (In production, this would be sent to ${email})`);
    
    // Update state with new OTP
    navigate("/otp", {
      replace: true,
      state: { otp: newOtp, email, rememberMe: location.state?.rememberMe }
    });
    
    setTimeLeft(60);
    setOtp(["", "", "", ""]);
    setIsResending(false);
    inputRefs.current[0]?.focus();
  };

  const handleCancel = () => {
    navigate("/login", { replace: true });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="otp-container">
      <img 
        className="otp-illustration" 
        src={process.env.PUBLIC_URL + "/img/otp-omg/otp-img.png"} 
        alt="OTP illustration" 
      />
      <div className="otp-card">
        <div className="otp-logo">
          <img 
            className="logo-img" 
            src={process.env.PUBLIC_URL + "/img/logo.png"} 
            alt="Logo" 
          />
        </div>
        <h2 className="otp-title">OTP Verification</h2>
        <p className="otp-description">
          Please enter the OTP (One-Time Password) sent to your registered email/phone number to complete your verification
        </p>
        
        <form className="otp-form" onSubmit={handleVerify}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="otp-timer-resend">
            <span className="otp-timer">Remaining time: {formatTime(timeLeft)}</span>
            <button
              type="button"
              className={`otp-resend ${timeLeft > 0 || isResending ? "disabled" : ""}`}
              onClick={handleResend}
              disabled={timeLeft > 0 || isResending}
            >
              Didn't got the code? <span>Resend</span>
            </button>
          </div>

          <div className="otp-actions">
            <button type="submit" className="otp-button verify">
              Verify
            </button>
            <button type="button" className="otp-button cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

