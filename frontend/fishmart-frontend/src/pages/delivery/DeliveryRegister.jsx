import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DeliveryRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    phone: "", vehicle_number: ""
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("delivery/register/", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #d1fae5 0%, #e0f2fe 100%)",
      fontFamily: "'Segoe UI', sans-serif", padding: "24px"
    }}>
      <div style={{
        background: "white", borderRadius: "20px",
        padding: "40px 36px", width: "100%", maxWidth: "520px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)"
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>🛵</div>
          <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>
            Delivery Boy Register
          </h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            NammaFreshMart ke saath deliver karo
          </p>
        </div>

        {success ? (
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac",
            borderRadius: "12px", padding: "20px",
            textAlign: "center", color: "#16a34a", fontSize: "15px", fontWeight: "600"
          }}>
            ✅ Registration successful!<br />
            <span style={{ fontSize: "13px", fontWeight: "400", color: "#6b7280" }}>
              Admin approval ke baad login kar sakte ho. Redirecting...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Row 1 */}
            <div style={{ display: "flex", gap: "14px" }}>
              <Field label="Username"  name="username"  value={form.username}  onChange={handleChange} />
              <Field label="Email"     name="email"     value={form.email}     onChange={handleChange} type="email" />
            </div>

            {/* Row 2 */}
            <div style={{ display: "flex", gap: "14px" }}>
              <Field label="Password"  name="password"  value={form.password}  onChange={handleChange} type="password" />
              <Field label="Phone"     name="phone"     value={form.phone}     onChange={handleChange} />
            </div>

            {/* Vehicle */}
            <Field
              label="Vehicle Number (optional)"
              name="vehicle_number"
              value={form.vehicle_number}
              onChange={handleChange}
            />

            {/* Info Box */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "10px", padding: "12px 14px",
              fontSize: "12px", color: "#166534"
            }}>
              ℹ️ Register karne ke baad admin aapko approve karega. Approve hone ke baad hi aap login kar sakte ho.
            </div>

            {error && (
              <div style={{
                background: "#ffebee", color: "#c62828",
                padding: "10px 14px", borderRadius: "10px",
                fontSize: "13px", border: "1px solid #ffcdd2"
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px", background: loading ? "#6ee7b7" : "#10b981",
                color: "white", border: "none", borderRadius: "12px",
                fontSize: "15px", fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Registering..." : "🛵 Register as Delivery Boy"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#888", margin: 0 }}>
              Already registered?{" "}
              <Link to="/login" style={{ color: "#10b981", fontWeight: "600", textDecoration: "none" }}>
                Login karo
              </Link>
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
      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type} name={name} value={value}
        onChange={onChange}
        required={name !== "vehicle_number"}
        style={{
          width: "100%", padding: "11px 14px",
          borderRadius: "10px", border: "1.5px solid #cfd8dc",
          fontSize: "14px", outline: "none", boxSizing: "border-box"
        }}
        onFocus={e => e.target.style.borderColor = "#10b981"}
        onBlur={e  => e.target.style.borderColor = "#cfd8dc"}
      />
    </div>
  );
}