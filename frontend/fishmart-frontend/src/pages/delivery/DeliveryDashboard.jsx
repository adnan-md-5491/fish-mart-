import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deliveryDashboard } from "../../services/api";

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryDashboard()
      .then(res => setData(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));

    // Location auto update every 30 seconds
    const interval = setInterval(updateLocation, 30000);
    updateLocation();
    return () => clearInterval(interval);
  }, []);

  const updateLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      import("../../services/api").then(({ deliveryUpdateLocation }) => {
        deliveryUpdateLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    });
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (loading) return <Loader />;

  const stats = [
    { icon: "🛵", label: "Total Deliveries", value: data.total_deliveries, color: "#3b82f6", bg: "#eff6ff" },
    { icon: "📦", label: "Active Orders",    value: data.active_orders,    color: "#f59e0b", bg: "#fffbeb" },
    { icon: "📍", label: "My Status",        value: data.status,           color: "#10b981", bg: "#f0fdf4" },
  ];

  return (
    <div style={S.page}>
      <Sidebar active="dashboard" onLogout={handleLogout} />
      <main style={S.main}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Welcome, {data.username} 👋</h1>
            <p style={S.sub}>Delivery Boy Panel — NammaFreshMart</p>
          </div>
          <StatusPill status={data.status} />
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          {stats.map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIcon, background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <p style={S.statVal}>{s.value}</p>
                <p style={S.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ActionCard
              onClick={() => navigate("/delivery/orders")}
              icon="📋" title="My Orders"
              desc="View and manage assigned orders"
              color="#3b82f6"
            />
            <ActionCard
              onClick={updateLocation}
              icon="📍" title="Update Location"
              desc="Share your current location"
              color="#10b981"
            />
          </div>
        </div>

      </main>
    </div>
  );
}

function ActionCard({ onClick, icon, title, desc, color }) {
  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "14px", padding: "22px",
      borderTop: `4px solid ${color}`, cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "transform 0.2s"
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <span style={{ fontSize: "28px" }}>{icon}</span>
      <p style={{ fontWeight: "700", color: "#1f2937", margin: "10px 0 4px" }}>{title}</p>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{desc}</p>
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    available: { bg: "#f0fdf4", color: "#16a34a", text: "🟢 Available" },
    busy:      { bg: "#fffbeb", color: "#d97706", text: "🟡 Busy"      },
    offline:   { bg: "#f1f5f9", color: "#64748b", text: "⚫ Offline"   },
  };
  const c = map[status] || map.offline;
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: "8px 18px", borderRadius: "50px",
      fontSize: "13px", fontWeight: "700"
    }}>{c.text}</span>
  );
}

export function Sidebar({ active, onLogout }) {
  const navigate = useNavigate();
  const links = [
    { key: "dashboard", icon: "🏠", label: "Dashboard", to: "/delivery/dashboard" },
    { key: "orders",    icon: "📦", label: "My Orders",  to: "/delivery/orders"   },
  ];
  return (
    <aside style={SS.sidebar}>
      <div style={SS.logoBox}>
        <span style={{ fontSize: "22px" }}>🛵</span>
        <span style={SS.logoText}>NammaFreshMart</span>
      </div>
      <p style={SS.subText}>Delivery Panel</p>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => navigate(l.to)} style={{
            ...SS.navBtn,
            background: active === l.key ? "#2563eb" : "transparent",
            color:      active === l.key ? "white"   : "#94a3b8",
          }}>
            <span>{l.icon}</span> {l.label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} style={SS.logoutBtn}>🚪 Logout</button>
    </aside>
  );
}

export function Loader() {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>
      <div style={{ width:"40px", height:"40px", border:"4px solid #e5e7eb", borderTop:"4px solid #3b82f6", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export const S = {
  page:       { display:"flex", minHeight:"100vh", background:"#f1f5f9" },
  main:       { marginLeft:"240px", flex:1, padding:"0 0 40px" },
  header:     { display:"flex", justifyContent:"space-between", alignItems:"center", background:"white", padding:"20px 32px", borderBottom:"1px solid #e2e8f0", marginBottom:"28px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  title:      { fontSize:"22px", fontWeight:"800", color:"#1f2937", margin:0 },
  sub:        { color:"#6b7280", fontSize:"13px", marginTop:"4px", marginBottom:0 },
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", padding:"0 32px", marginBottom:"24px" },
  statCard:   { background:"white", borderRadius:"14px", padding:"20px", display:"flex", gap:"14px", alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" },
  statIcon:   { width:"50px", height:"50px", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 },
  statVal:    { fontSize:"22px", fontWeight:"800", color:"#1f2937", margin:0 },
  statLabel:  { fontSize:"12px", color:"#6b7280", margin:"2px 0 0" },
  section:    { background:"white", borderRadius:"16px", padding:"24px", margin:"0 32px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" },
  sectionTitle:{ fontSize:"16px", fontWeight:"700", color:"#1f2937", margin:"0 0 16px" },
};

const SS = {
  sidebar:  { width:"240px", background:"#1e293b", display:"flex", flexDirection:"column", padding:"0", position:"fixed", height:"100vh", top:0, left:0, zIndex:100 },
  logoBox:  { display:"flex", alignItems:"center", gap:"10px", padding:"24px 20px 12px", borderBottom:"1px solid #334155" },
  logoText: { fontSize:"16px", fontWeight:"800", color:"white" },
  subText:  { color:"#64748b", fontSize:"11px", padding:"8px 20px 16px", margin:0, borderBottom:"1px solid #334155", marginBottom:"8px" },
  navBtn:   { display:"flex", alignItems:"center", gap:"10px", padding:"11px 14px", margin:"0 12px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"14px", fontWeight:"500", textAlign:"left", width:"calc(100% - 24px)" },
  logoutBtn:{ margin:"12px", padding:"11px 14px", background:"#ef444420", color:"#f87171", border:"1px solid #ef444440", borderRadius:"10px", cursor:"pointer", fontSize:"14px", fontWeight:"600", textAlign:"left" },
};