import { useState } from "react";
import { login } from "../services/api";
<<<<<<< HEAD
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!form.username || !form.password) {
      setError("Username aur password dono zaroori hain");
      return;
    }
    setLoading(true);
    setError("");

    login(form)
      .then(res => {
        localStorage.setItem("access",   res.data.access);
        localStorage.setItem("refresh",  res.data.refresh);
        localStorage.setItem("isMember", res.data.is_member);
        localStorage.setItem("role",     res.data.role);

        // ── Role ke hisaab se redirect ──
        if      (res.data.role === "admin")    navigate("/admin/dashboard");
        else if (res.data.role === "vendor")   navigate("/vendor/dashboard");
        else if (res.data.role === "delivery") navigate("/delivery/dashboard"); // ← delivery
        else                                   navigate("/");
      })
      .catch(err => {
        setError(err.response?.data?.detail || "Invalid username ya password");
      })
      .finally(() => setLoading(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        padding: "40px 36px", width: "100%", maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)"
      }}>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>🐠</div>
          <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>
            Welcome Back
          </h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            NammaFreshMart mein login karo
          </p>
        </div>

        {/* Username */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Apna username daalo"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={handleKeyDown}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1565c0"}
            onBlur={e  => e.target.style.borderColor = "#cfd8dc"}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Apna password daalo"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKeyDown}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1565c0"}
            onBlur={e  => e.target.style.borderColor = "#cfd8dc"}
          />
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? "#90caf9" : "linear-gradient(135deg, #1565c0, #0288d1)",
            color: "#fff", border: "none", borderRadius: "12px",
            fontSize: "16px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "16px"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Role indicators */}
        <div style={{
          background: "#f8fafc", borderRadius: "10px",
          padding: "12px 14px", marginBottom: "16px",
          fontSize: "12px", color: "#64748b"
        }}>
          <p style={{ margin: "0 0 6px", fontWeight: "700", color: "#374151" }}>Login karne ke baad:</p>
          <p style={{ margin: "2px 0" }}>👤 Customer → Products page</p>
          <p style={{ margin: "2px 0" }}>🏪 Vendor → Vendor Dashboard</p>
          <p style={{ margin: "2px 0" }}>🛵 Delivery Boy → Delivery Dashboard</p>
          <p style={{ margin: "2px 0" }}>⚙️ Admin → Admin Dashboard</p>
        </div>

        {/* Links */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#888", margin: "0 0 8px" }}>
          Account nahi hai?{" "}
          <Link to="/signup" style={{ color: "#1565c0", fontWeight: "600", textDecoration: "none" }}>
            Signup karo
          </Link>
        </p>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#888", margin: 0 }}>
          Vendor banna hai?{" "}
          <Link to="/vendor/register" style={{ color: "#f97316", fontWeight: "600", textDecoration: "none" }}>
            Register karo
          </Link>
        </p>

=======
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = () => {
    login(form).then(res => {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/");
    });
  };

  return (
    <div style={{ 
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
          color: '#333',
          marginBottom: '30px',
          fontSize: '28px'
        }}>Login</h2>

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
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
        <br /><br />

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
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
        <br /><br />

        <button 
          onClick={handleSubmit}
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
          Login
        </button>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
      </div>
    </div>
  );
}

<<<<<<< HEAD
const inputStyle = {
  width: "100%", padding: "12px 14px",
  borderRadius: "10px", border: "1.5px solid #cfd8dc",
  fontSize: "15px", outline: "none",
  boxSizing: "border-box", transition: "border 0.2s"
};

=======
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
export default Login;