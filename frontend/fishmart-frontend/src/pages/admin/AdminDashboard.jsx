import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetVendors, adminGetOrders, adminGetDeliveryBoys } from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ vendors: 0, orders: 0, revenue: 0, pending: 0, deliveryBoys: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetVendors(), adminGetOrders(), adminGetDeliveryBoys()])
      .then(([v, o, d]) => {
        const revenue = o.data.reduce((s, ord) => s + parseFloat(ord.total_amount || 0), 0);
        const pending = v.data.filter(vn => vn.status === "pending").length;
        setStats({
          vendors:      v.data.length,
          orders:       o.data.length,
          revenue,
          pending,
          deliveryBoys: d.data.length,
        });
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (loading) return <Loader />;

  const cards = [
    { icon: "🏪", label: "Total Vendors",     value: stats.vendors,                  color: "#3b82f6" },
    { icon: "🛒", label: "Total Orders",      value: stats.orders,                   color: "#10b981" },
    { icon: "💰", label: "Total Revenue",     value: `₹${stats.revenue.toFixed(2)}`, color: "#f59e0b" },
    { icon: "⏳", label: "Pending Approvals", value: stats.pending,                  color: "#ef4444" },
    { icon: "🛵", label: "Delivery Boys",     value: stats.deliveryBoys,             color: "#8b5cf6" },
  ];

  const actions = [
    { to: "/admin/vendors",  icon: "🏪", title: "Manage Vendors",  desc: "Approve, reject, set commission", color: "#3b82f6" },
    { to: "/admin/orders",   icon: "🛒", title: "All Orders",      desc: "View and manage all orders",      color: "#10b981" },
    { to: "/admin/delivery", icon: "🛵", title: "Delivery",        desc: "Manage delivery boys & assign",   color: "#8b5cf6" },
  ];

  return (
    <div style={S.page}>
      <Sidebar active="dashboard" onLogout={handleLogout} />
      <main style={S.main}>

        {/* Header */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.heading}>Admin Dashboard</h1>
            <p style={S.sub}>Welcome back, Admin 👋 — NammaFreshMart</p>
          </div>
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac",
            borderRadius: "10px", padding: "10px 18px",
            fontSize: "13px", color: "#16a34a", fontWeight: "600"
          }}>
            🟢 System Online
          </div>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          {cards.map(c => (
            <div key={c.label} style={S.statCard}>
              <div style={{ ...S.statIcon, background: c.color + "20", color: c.color }}>
                {c.icon}
              </div>
              <div>
                <p style={S.statValue}>{c.value}</p>
                <p style={S.statLabel}>{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Alert */}
        {stats.pending > 0 && (
          <div style={{
            background: "#fffbeb", border: "1px solid #fcd34d",
            borderRadius: "12px", padding: "14px 18px",
            marginBottom: "24px", color: "#92400e", fontSize: "14px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span>⚠️ <strong>{stats.pending}</strong> vendor(s) waiting for approval</span>
            <button
              onClick={() => navigate("/admin/vendors")}
              style={{
                background: "#f59e0b", color: "white", border: "none",
                borderRadius: "8px", padding: "6px 16px",
                fontWeight: "600", cursor: "pointer", fontSize: "13px"
              }}>
              Review Now →
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 16px" }}>
            Quick Actions
          </h2>
          <div style={S.actionsGrid}>
            {actions.map(a => (
              <div
                key={a.to}
                onClick={() => navigate(a.to)}
                style={{ ...S.actionCard, borderTop: `4px solid ${a.color}`, cursor: "pointer" }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                <span style={{ fontSize: "32px" }}>{a.icon}</span>
                <p style={{ fontWeight: "700", color: "#1f2937", margin: "10px 0 4px" }}>{a.title}</p>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

// ── Shared Sidebar ───────────────────────────────────────────

export function Sidebar({ active, onLogout }) {
  const navigate = useNavigate();
  const links = [
    { key: "dashboard", icon: "🏠", label: "Dashboard",   to: "/admin/dashboard" },
    { key: "vendors",   icon: "🏪", label: "Vendors",     to: "/admin/vendors"   },
    { key: "orders",    icon: "🛒", label: "All Orders",  to: "/admin/orders"    },
    { key: "delivery",  icon: "🛵", label: "Delivery",    to: "/admin/delivery"  }, // ← new
  ];

  return (
    <aside style={S.sidebar}>
      {/* Logo */}
      <div style={{ padding: "24px 16px 8px" }}>
        <div style={S.logo}>⚙️ Admin Panel</div>
        <p style={S.logoSub}>NammaFreshMart</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "8px 12px" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => navigate(l.to)} style={{
            ...S.navBtn,
            background: active === l.key ? "#2563eb" : "transparent",
            color:      active === l.key ? "white"   : "#94a3b8",
          }}>
            <span>{l.icon}</span> {l.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px" }}>
        <button onClick={onLogout} style={S.logoutBtn}>🚪 Logout</button>
      </div>
    </aside>
  );
}

// ── Shared Loader ────────────────────────────────────────────

export function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{
        width: "40px", height: "40px",
        border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6",
        borderRadius: "50%", animation: "spin 1s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Shared Styles ────────────────────────────────────────────

export const S = {
  page:        { display: "flex", minHeight: "100vh", background: "#f1f5f9" },
  sidebar:     {
    width: "240px", background: "#1e293b",
    display: "flex", flexDirection: "column",
    position: "fixed", height: "100vh",
    top: 0, left: 0, zIndex: 100
  },
  logo:        { fontSize: "18px", fontWeight: "800", color: "white", margin: 0 },
  logoSub:     { color: "#64748b", fontSize: "11px", marginTop: "2px", marginBottom: 0 },
  navBtn:      {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "11px 14px", borderRadius: "10px",
    border: "none", cursor: "pointer",
    fontSize: "14px", fontWeight: "500",
    textAlign: "left", width: "100%",
    transition: "all 0.15s"
  },
  logoutBtn:   {
    background: "#ef444420", color: "#ef4444",
    border: "1px solid #ef444440", borderRadius: "10px",
    padding: "11px 14px", cursor: "pointer",
    fontSize: "14px", fontWeight: "600", width: "100%",
    textAlign: "left"
  },
  main:        { marginLeft: "240px", flex: 1, padding: "32px" },
  topBar:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  heading:     { fontSize: "28px", fontWeight: "800", color: "#1f2937", margin: 0 },
  sub:         { color: "#6b7280", fontSize: "14px", marginTop: "4px", marginBottom: 0 },
  statsGrid:   { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard:    {
    background: "white", borderRadius: "16px", padding: "20px",
    display: "flex", gap: "14px", alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
  },
  statIcon:    {
    width: "52px", height: "52px", borderRadius: "14px",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "24px", flexShrink: 0
  },
  statValue:   { fontSize: "22px", fontWeight: "800", color: "#1f2937", margin: 0 },
  statLabel:   { fontSize: "12px", color: "#6b7280", margin: 0 },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  actionCard:  {
    background: "#f9fafb", borderRadius: "14px", padding: "24px",
    textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
};