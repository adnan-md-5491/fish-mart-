import { useEffect, useState } from "react";
import { vendorDashboard, vendorGetOrders } from "../../services/api";

export default function VendorEarnings() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders]   = useState([]);

  useEffect(() => {
    Promise.all([vendorDashboard(), vendorGetOrders()])
      .then(([d, o]) => { setSummary(d.data); setOrders(o.data); });
  }, []);

  const totalCommission = orders.reduce((s, o) => s + parseFloat(o.admin_commission || 0), 0);

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🏪 FishMart</div>
        <SidebarLinks active="earnings" />
      </aside>

      <main style={styles.main}>
        <h1 style={styles.heading}>Earnings Summary</h1>

        {summary && (
          <div style={styles.statsGrid}>
            {[
              { icon: "💰", label: "Total Earnings",   value: `₹${summary.total_earnings}`, color: "#10b981" },
              { icon: "📊", label: "Commission Rate",   value: `${summary.commission_rate}%`, color: "#8b5cf6" },
              { icon: "🏦", label: "Admin Commission",  value: `₹${totalCommission.toFixed(2)}`, color: "#ef4444" },
              { icon: "🛒", label: "Total Orders",      value: summary.total_orders,          color: "#3b82f6" },
            ].map(s => (
              <div key={s.label} style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: s.color + "20", color: s.color }}>{s.icon}</div>
                <div>
                  <p style={styles.statValue}>{s.value}</p>
                  <p style={styles.statLabel}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Per Order Breakdown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Order ID", "Product", "Qty", "Total", "My Earning", "Commission"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={styles.td}>#{o.order_id}</td>
                  <td style={styles.td}>{o.product}</td>
                  <td style={styles.td}>{o.quantity}</td>
                  <td style={styles.td}>₹{(o.quantity * o.price).toFixed(2)}</td>
                  <td style={{ ...styles.td, color: "#16a34a", fontWeight: "700" }}>₹{parseFloat(o.vendor_earning).toFixed(2)}</td>
                  <td style={{ ...styles.td, color: "#ef4444" }}>₹{parseFloat(o.admin_commission).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function SidebarLinks({ active }) {
  const links = [
    { to: "/vendor/dashboard", icon: "🏠", label: "Dashboard", key: "dashboard" },
    { to: "/vendor/products",  icon: "📦", label: "Products",  key: "products"  },
    { to: "/vendor/orders",    icon: "🛒", label: "Orders",    key: "orders"    },
    { to: "/vendor/earnings",  icon: "💰", label: "Earnings",  key: "earnings"  },
  ];
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
      {links.map(l => (
        <a key={l.key} href={l.to} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 14px", borderRadius: "10px", textDecoration: "none",
          fontSize: "14px", fontWeight: "500",
          background: active === l.key ? "#2563eb" : "transparent",
          color: active === l.key ? "white" : "#94a3b8"
        }}>
          {l.icon} {l.label}
        </a>
      ))}
    </nav>
  );
}

const styles = {
  page:       { display: "flex", minHeight: "100vh", background: "#f9fafb" },
  sidebar:    { width: "240px", background: "#1e293b", display: "flex", flexDirection: "column", padding: "28px 16px", position: "fixed", height: "100vh" },
  logo:       { fontSize: "20px", fontWeight: "800", color: "white", marginBottom: "32px" },
  main:       { marginLeft: "240px", flex: 1, padding: "32px" },
  heading:    { fontSize: "26px", fontWeight: "800", color: "#1f2937", margin: "0 0 24px" },
  statsGrid:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard:   { background: "white", borderRadius: "16px", padding: "20px", display: "flex", gap: "16px", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statIcon:   { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" },
  statValue:  { fontSize: "22px", fontWeight: "800", color: "#1f2937", margin: 0 },
  statLabel:  { fontSize: "12px", color: "#6b7280", margin: 0 },
  section:    { background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  sectionTitle:{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px" },
  th:         { padding: "10px 16px", fontSize: "12px", fontWeight: "700", color: "#64748b", textAlign: "left", textTransform: "uppercase" },
  td:         { padding: "12px 16px", fontSize: "14px", color: "#1f2937" },
};