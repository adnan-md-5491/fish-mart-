import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { vendorDashboard } from "../../services/api";

export default function VendorDashboard() {
  const navigate          = useNavigate();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorDashboard()
      .then(res => setData(res.data))
      .catch(() => navigate("/vendor/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <Loader />;

  const stats = [
    { icon: "📦", label: "Total Products", value: data.total_products, color: "#3b82f6", bg: "#eff6ff" },
    { icon: "🛒", label: "Total Orders",   value: data.total_orders,   color: "#10b981", bg: "#f0fdf4" },
    { icon: "💰", label: "Total Earnings", value: `₹${data.total_earnings}`, color: "#f59e0b", bg: "#fffbeb" },
    { icon: "📊", label: "Commission",     value: `${data.commission_rate}%`, color: "#8b5cf6", bg: "#f5f3ff" },
  ];

  return (
    <div style={S.page}>
      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={S.logoBox}>
          <span style={S.logoIcon}>🐟</span>
          <span style={S.logoText}>FishMart</span>
        </div>

        {/* Vendor Profile Box */}
        <div style={S.profileBox}>
          <div style={S.avatar}>
            {data.shop_name?.[0]?.toUpperCase() || "V"}
          </div>
          <div>
            <p style={S.shopName}>{data.shop_name}</p>
            <StatusBadge status={data.status} />
          </div>
        </div>

        {/* Nav Links */}
        <nav style={S.nav}>
          <NavLink to="/vendor/dashboard" icon="🏠" label="Dashboard"  active />
          <NavLink to="/vendor/products"  icon="📦" label="Products" />
          <NavLink to="/vendor/orders"    icon="🛒" label="Orders" />
          <NavLink to="/vendor/earnings"  icon="💰" label="Earnings" />
        </nav>

        {/* Logout — sidebar ke bilkul neeche */}
        <button onClick={handleLogout} style={S.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main style={S.main}>

        {/* ── Top Header Bar ── */}
        <div style={S.header}>
          <div>
            <h1 style={S.headerTitle}>
              Welcome back, <span style={{ color: "#2563eb" }}>{data.shop_name}</span> 👋
            </h1>
            <p style={S.headerSub}>Here's what's happening with your store today</p>
          </div>
          <div style={S.headerRight}>
            <div style={S.headerProfile}>
              <div style={S.headerAvatar}>
                {data.shop_name?.[0]?.toUpperCase() || "V"}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#1f2937" }}>
                  {data.shop_name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Vendor Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={S.statsGrid}>
          {stats.map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIcon, background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p style={S.statValue}>{s.value}</p>
                <p style={S.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Quick Actions</h2>
          <div style={S.actionsGrid}>
            <ActionCard
              to="/vendor/products"
              icon="➕" title="Add Product"
              desc="List a new product in your store"
              color="#3b82f6"
            />
            <ActionCard
              to="/vendor/orders"
              icon="📋" title="View Orders"
              desc="Check and manage recent orders"
              color="#10b981"
            />
            <ActionCard
              to="/vendor/earnings"
              icon="📊" title="Earnings Report"
              desc="Track your income & commissions"
              color="#f59e0b"
            />
          </div>
        </div>

        {/* ── Status Info ── */}
        {data.status === "pending" && (
          <div style={S.alertBox}>
            ⏳ <strong>Account under review.</strong> Admin approval ke baad aap products add kar sakte hain.
          </div>
        )}
        {data.status === "rejected" && (
          <div style={{ ...S.alertBox, background: "#fef2f2", borderColor: "#fca5a5", color: "#dc2626" }}>
            ❌ <strong>Account rejected.</strong> Admin se contact karo.
          </div>
        )}
      </main>
    </div>
  );
}

// ── Sub Components ──────────────────────────────────────────

function NavLink({ to, icon, label, active }) {
  return (
    <Link to={to} style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "11px 14px", borderRadius: "10px",
      color: active ? "white" : "#94a3b8",
      background: active ? "#2563eb" : "transparent",
      textDecoration: "none", fontSize: "14px", fontWeight: "500",
      transition: "all 0.15s",
    }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {label}
    </Link>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: { bg: "#dcfce7", color: "#16a34a", text: "✅ Approved" },
    pending:  { bg: "#fef9c3", color: "#ca8a04", text: "⏳ Pending"  },
    rejected: { bg: "#fee2e2", color: "#dc2626", text: "❌ Rejected" },
  };
  const c = map[status] || map.pending;
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: "11px", fontWeight: "700",
      padding: "2px 10px", borderRadius: "50px",
      display: "inline-block", marginTop: "4px"
    }}>
      {c.text}
    </span>
  );
}

function ActionCard({ to, icon, title, desc, color }) {
  return (
    <Link to={to} style={{
      background: "white", borderRadius: "14px",
      padding: "22px", textDecoration: "none",
      borderTop: `4px solid ${color}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      display: "block",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
      }}
    >
      <span style={{ fontSize: "28px" }}>{icon}</span>
      <p style={{ fontWeight: "700", color: "#1f2937", margin: "10px 0 4px", fontSize: "15px" }}>{title}</p>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{desc}</p>
    </Link>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────
const S = {
  page:        { display: "flex", minHeight: "100vh", background: "#f1f5f9" },

  // Sidebar
  sidebar:     {
    width: "240px", background: "#1e293b",
    display: "flex", flexDirection: "column",
    padding: "0", position: "fixed",
    height: "100vh", top: 0, left: 0,
    zIndex: 100, overflowY: "auto"
  },
  logoBox:     {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "24px 20px 16px",
    borderBottom: "1px solid #334155"
  },
  logoIcon:    { fontSize: "24px" },
  logoText:    { fontSize: "18px", fontWeight: "800", color: "white" },

  profileBox:  {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "16px 20px",
    background: "#0f172a",
    borderBottom: "1px solid #334155",
    marginBottom: "8px"
  },
  avatar:      {
    width: "42px", height: "42px", borderRadius: "12px",
    background: "#2563eb", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "800", flexShrink: 0
  },
  shopName:    { margin: 0, color: "white", fontWeight: "700", fontSize: "13px" },

  nav:         {
    display: "flex", flexDirection: "column",
    gap: "2px", padding: "8px 12px",
    flex: 1  // ← baaki space le lo
  },

  logoutBtn:   {
    margin: "12px", // sidebar ke neeche thoda margin
    padding: "11px 14px",
    background: "#ef444420", color: "#f87171",
    border: "1px solid #ef444440",
    borderRadius: "10px", cursor: "pointer",
    fontSize: "14px", fontWeight: "600",
    textAlign: "left", display: "flex",
    alignItems: "center", gap: "8px"
  },

  // Main
  main:        { marginLeft: "240px", flex: 1, padding: "0 0 40px" },

  // Header Bar
  header:      {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "white", padding: "20px 32px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
  },
  headerTitle: { fontSize: "22px", fontWeight: "800", color: "#1f2937", margin: 0 },
  headerSub:   { color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: 0 },
  headerRight: { display: "flex", alignItems: "center", gap: "16px" },
  headerProfile: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "#f8fafc", padding: "10px 16px",
    borderRadius: "12px", border: "1px solid #e2e8f0"
  },
  headerAvatar: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "#2563eb", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "15px", fontWeight: "800"
  },

  // Stats
  statsGrid:   {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px", padding: "0 32px", marginBottom: "24px"
  },
  statCard:    {
    background: "white", borderRadius: "14px",
    padding: "20px", display: "flex", gap: "14px",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
  },
  statIcon:    {
    width: "50px", height: "50px", borderRadius: "14px",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "22px", flexShrink: 0
  },
  statValue:   { fontSize: "22px", fontWeight: "800", color: "#1f2937", margin: 0 },
  statLabel:   { fontSize: "12px", color: "#6b7280", margin: "2px 0 0" },

  // Section
  section:     {
    background: "white", borderRadius: "16px",
    padding: "24px", margin: "0 32px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
  },
  sectionTitle:{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 16px" },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },

  // Alert
  alertBox:    {
    margin: "16px 32px 0",
    background: "#fffbeb", border: "1px solid #fcd34d",
    borderRadius: "12px", padding: "14px 18px",
    color: "#92400e", fontSize: "14px"
  },
};