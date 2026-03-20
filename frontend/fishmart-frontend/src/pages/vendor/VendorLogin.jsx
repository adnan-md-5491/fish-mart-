import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/api";

export default function VendorLogin() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await login(form);
      localStorage.setItem("access",  res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", "vendor");
      navigate("/vendor/dashboard");
    } catch {
      setError("Invalid credentials or not a vendor account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={{ fontSize: "48px" }}>🔐</span>
          <h2 style={styles.title}>Vendor Login</h2>
          <p style={styles.sub}>Access your FishMart vendor panel</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Username</label>
            <input style={styles.input} name="username" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" name="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
            New vendor? <Link to="/vendor/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page:  { minHeight: "100vh", background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center" },
  card:  { background: "white", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" },
  header:{ textAlign: "center", marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1f2937", margin: "8px 0 4px" },
  sub:   { color: "#6b7280", fontSize: "14px", margin: 0 },
  form:  { display: "flex", flexDirection: "column", gap: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btn:   { padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  error: { color: "#ef4444", fontSize: "13px", textAlign: "center" },
};