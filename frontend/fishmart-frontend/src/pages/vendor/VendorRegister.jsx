import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { vendorRegister } from "../../services/api";

export default function VendorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    shop_name: "", phone: "", address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await vendorRegister(form);
      setSuccess(true);
      setTimeout(() => navigate("/vendor/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🏪</span>
          <h2 style={styles.title}>Become a Vendor</h2>
          <p style={styles.sub}>Register your shop on FishMart</p>
        </div>

        {success ? (
          <div style={styles.successBox}>
            ✅ Registration successful! Waiting for admin approval...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <Field label="Username"  name="username"  value={form.username}  onChange={handleChange} />
              <Field label="Email"     name="email"     value={form.email}     onChange={handleChange} type="email" />
            </div>
            <div style={styles.row}>
              <Field label="Password"  name="password"  value={form.password}  onChange={handleChange} type="password" />
              <Field label="Shop Name" name="shop_name" value={form.shop_name} onChange={handleChange} />
            </div>
            <div style={styles.row}>
              <Field label="Phone"     name="phone"     value={form.phone}     onChange={handleChange} />
              <Field label="Address"   name="address"   value={form.address}   onChange={handleChange} />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Registering..." : "Register Shop"}
            </button>

            <p style={styles.loginLink}>
              Already a vendor? <Link to="/vendor/login">Login here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} required
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page:       { minHeight: "100vh", background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
  card:       { background: "white", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "600px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" },
  header:     { textAlign: "center", marginBottom: "28px" },
  icon:       { fontSize: "48px" },
  title:      { fontSize: "24px", fontWeight: "700", color: "#1f2937", margin: "8px 0 4px" },
  sub:        { color: "#6b7280", fontSize: "14px", margin: 0 },
  form:       { display: "flex", flexDirection: "column", gap: "16px" },
  row:        { display: "flex", gap: "16px" },
  label:      { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  input:      { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btn:        { padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "8px" },
  error:      { color: "#ef4444", fontSize: "13px", textAlign: "center" },
  successBox: { background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "16px", textAlign: "center", color: "#16a34a" },
  loginLink:  { textAlign: "center", fontSize: "13px", color: "#6b7280" },
};