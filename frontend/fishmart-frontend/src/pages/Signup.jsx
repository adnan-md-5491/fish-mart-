import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
<<<<<<< HEAD
  const [form, setForm]       = useState({ username: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const navigate = useNavigate();

  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) setForm({ ...form, phone: val });
  };

  const handleSignup = () => {
    if (!form.username || !form.phone || !form.password) {
      setError("All fields are required"); return;
    }
    if (form.phone.length !== 10) {
      setError("Enter valid 10 digit mobile number"); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }

    setLoading(true); setError("");
    signup({ username: form.username, phone: form.phone, password: form.password })
      .then(() => {
        navigate("/verify-otp", {
          state: { username: form.username, phone: form.phone, password: form.password }
        });
      })
      .catch(err => {
        setError(err.response?.data?.error || "Signup failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
=======
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSignup = () => {
    signup(form).then(() => {
      alert("OTP sent to email");
      navigate("/verify-otp", { state: form });
    });
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
  };

  return (
    <div style={{
<<<<<<< HEAD
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px"
    }}>
      <div style={{
        background: "white", borderRadius: "20px",
        padding: "40px 32px", width: "100%", maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>🐠</div>
          <h2 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "700", color: "#1a1a2e" }}>
            Create Account
          </h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            NammaFreshMart mein join karo
          </p>
        </div>

        {/* Username */}
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Username</label>
          <input
            style={inputStyle}
            placeholder="Apna username daalo"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>WhatsApp Number</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280", fontSize: "14px", fontWeight: "600"
            }}>
              +91
            </span>
            <input
              style={{ ...inputStyle, paddingLeft: "48px" }}
              placeholder="10 digit number"
              type="tel"
              value={form.phone}
              onChange={handlePhone}
              onKeyDown={handleKeyDown}
              maxLength={10}
            />
          </div>
          {form.phone.length === 10 && (
            <p style={{ color: "#28a745", fontSize: "12px", marginTop: "4px" }}>
              ✓ Valid number — OTP WhatsApp pe aayega
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* WhatsApp Note */}
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "10px", padding: "10px 14px",
          fontSize: "12px", color: "#166534", marginBottom: "16px"
        }}>
          📱 OTP aapke WhatsApp number pe aayega
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#ffebee", color: "#c62828",
            padding: "10px 14px", borderRadius: "10px",
            fontSize: "13px", marginBottom: "16px",
            border: "1px solid #ffcdd2"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? "#90caf9" : "linear-gradient(135deg, #1565c0, #0288d1)",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "16px"
          }}
        >
          {loading ? "Sending OTP..." : "📱 Send OTP on WhatsApp"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#888", margin: 0 }}>
          Already have account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#1565c0", fontWeight: "600", cursor: "pointer" }}
          >
            Login karo
          </span>
        </p>
=======
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>

        <h2 style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '30px',
          fontSize: '28px',
          color: '#333'
        }}>
          Create Account ✨
        </h2>

        <input
          placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            outline: 'none',
            transition: 'border-color 0.3s',
            boxSizing: 'border-box',
            marginBottom: '15px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />

        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            outline: 'none',
            transition: 'border-color 0.3s',
            boxSizing: 'border-box',
            marginBottom: '15px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            outline: 'none',
            transition: 'border-color 0.3s',
            boxSizing: 'border-box',
            marginBottom: '20px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />

        <button
          onClick={handleSignup}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Send OTP
        </button>

>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
      </div>
    </div>
  );
}

<<<<<<< HEAD
const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: "600",
  color: "#374151", marginBottom: "6px"
};

const inputStyle = {
  width: "100%", padding: "12px 14px",
  borderRadius: "10px", border: "1.5px solid #cfd8dc",
  fontSize: "15px", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
  transition: "border 0.2s"
};

=======
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
export default Signup;