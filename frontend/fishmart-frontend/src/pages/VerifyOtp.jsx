<<<<<<< HEAD
import { useState, useEffect } from "react";
import { verifyOtp, signup } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp,       setOtp]       = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [resending, setResending] = useState(false);
  const [resent,    setResent]    = useState(false);

  const navigate     = useNavigate();
  const { state }    = useLocation();
  const phone    = state?.phone;
  const username = state?.username;
  const password = state?.password;

  // ✅ useEffect mein navigate
  useEffect(() => {
    if (!phone) {
      navigate("/signup");
    }
  }, [phone, navigate]);

  if (!phone) return null;

  const handleVerify = () => {
    if (!otp || otp.length !== 6) { setError("6 digit OTP daalo"); return; }
    setLoading(true); setError("");
    verifyOtp({ phone, otp, username, password })
      .then(() => { alert("✅ Account created! Please login."); navigate("/login"); })
      .catch(err => setError(err.response?.data?.error || "Invalid OTP"))
      .finally(() => setLoading(false));
  };

  const handleResend = () => {
    setResending(true); setError(""); setResent(false);
    signup({ username, phone, password })
      .then(() => { setResent(true); setTimeout(() => setResent(false), 3000); })
      .catch(() => setError("Resend failed"))
      .finally(() => setResending(false));
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px"
    }}>
      <div style={{
        background: "white", borderRadius: "20px", padding: "40px 32px",
        width: "100%", maxWidth: "380px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)", textAlign: "center"
      }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>📱</div>
        <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", color: "#1a1a2e" }}>
          Verify OTP
        </h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "4px" }}>OTP bheja gaya</p>
        <p style={{ color: "#1565c0", fontSize: "15px", fontWeight: "700", marginBottom: "24px" }}>
          WhatsApp: +91 {phone}
        </p>

        <input
          autoFocus
          type="tel"
          maxLength={6}
          placeholder="------"
          value={otp}
          onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleVerify()}
          style={{
            width: "100%", padding: "16px", textAlign: "center",
            borderRadius: "12px", fontSize: "28px", fontWeight: "800",
            letterSpacing: "10px", outline: "none", boxSizing: "border-box",
            marginBottom: "12px", fontFamily: "inherit",
            border: otp.length === 6 ? "2px solid #28a745" : "2px solid #cfd8dc",
          }}
        />

        {error && (
          <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "10px", fontSize: "13px", marginBottom: "12px", border: "1px solid #ffcdd2" }}>
            ⚠️ {error}
          </div>
        )}

        {resent && (
          <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "10px", borderRadius: "10px", fontSize: "13px", marginBottom: "12px" }}>
            ✅ OTP resent!
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          style={{
            width: "100%", padding: "13px", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: "700", marginBottom: "14px",
            background: otp.length === 6 ? "linear-gradient(135deg, #1565c0, #0288d1)" : "#e5e7eb",
            color: otp.length === 6 ? "white" : "#9ca3af",
            cursor: otp.length === 6 && !loading ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Verifying..." : "✅ Verify OTP"}
        </button>

        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "10px" }}>
          OTP nahi aaya?{" "}
          <span onClick={!resending ? handleResend : undefined}
            style={{ color: resending ? "#9ca3af" : "#1565c0", fontWeight: "600", cursor: "pointer" }}>
            {resending ? "Sending..." : "Resend karo"}
          </span>
        </p>

        <p style={{ fontSize: "13px", color: "#9ca3af" }}>
          <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: "#6b7280" }}>
            ← Back to Signup
          </span>
        </p>
      </div>
=======
import { useState } from "react";
import { verifyOtp } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation(); // email, username, password

  const handleVerify = () => {
    verifyOtp({ ...state, otp }).then(() => {
      alert("Signup successful 🎉");
      navigate("/login");
    });
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        placeholder="Enter OTP"
        onChange={e => setOtp(e.target.value)}
      />
      <br />

      <button onClick={handleVerify}>Verify</button>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    </div>
  );
}

<<<<<<< HEAD
export default VerifyOtp;
=======
export default VerifyOtp;
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
