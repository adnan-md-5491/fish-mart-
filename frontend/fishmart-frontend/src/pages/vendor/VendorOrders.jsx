import { useEffect, useState } from "react";
import { vendorGetOrders } from "../../services/api";

const STATUS_COLORS = {
  PLACED:           { bg: "#fffbeb", color: "#d97706" },
  CONFIRMED:        { bg: "#eff6ff", color: "#2563eb" },
  OUT_FOR_DELIVERY: { bg: "#f0fdf4", color: "#16a34a" },
  DELIVERED:        { bg: "#f0fdf4", color: "#15803d" },
  CANCELLED:        { bg: "#fef2f2", color: "#dc2626" },
};

export default function VendorOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorGetOrders()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🏪 FishMart</div>
        <SidebarLinks active="orders" />
      </aside>

      <main style={styles.main}>
        <h1 style={styles.heading}>My Orders</h1>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>{orders.length} orders received</p>

        {loading ? <p>Loading...</p> : orders.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "48px" }}>📭</p>
            <p style={{ color: "#6b7280" }}>No orders yet</p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.thead}>
              {["Order ID", "Customer", "Product", "Qty", "Price", "My Earning", "Status", "Date"].map(h => (
                <div key={h} style={styles.th}>{h}</div>
              ))}
            </div>
            {orders.map((o, i) => {
              const sc = STATUS_COLORS[o.status] || STATUS_COLORS.PLACED;
              return (
                <div key={i} style={styles.trow}>
                  <div style={styles.td}>#{o.order_id}</div>
                  <div style={styles.td}>{o.customer}</div>
                  <div style={styles.td}>{o.product}</div>
                  <div style={styles.td}>{o.quantity}</div>
                  <div style={styles.td}>₹{o.price}</div>
                  <div style={{ ...styles.td, color: "#16a34a", fontWeight: "700" }}>₹{o.vendor_earning}</div>
                  <div style={styles.td}>
                    <span style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>
                      {o.status}
                    </span>
                  </div>
                  <div style={{ ...styles.td, color: "#9ca3af", fontSize: "12px" }}>
                    {new Date(o.date).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// SidebarLinks — same as Products page mein hai
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
  page:    { display: "flex", minHeight: "100vh", background: "#f9fafb" },
  sidebar: { width: "240px", background: "#1e293b", display: "flex", flexDirection: "column", padding: "28px 16px", position: "fixed", height: "100vh" },
  logo:    { fontSize: "20px", fontWeight: "800", color: "white", marginBottom: "32px" },
  main:    { marginLeft: "240px", flex: 1, padding: "32px" },
  heading: { fontSize: "26px", fontWeight: "800", color: "#1f2937", margin: 0 },
  empty:   { textAlign: "center", padding: "80px" },
  table:   { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  thead:   { display: "grid", gridTemplateColumns: "80px 1fr 1fr 60px 80px 100px 120px 100px", background: "#f8fafc", padding: "12px 16px", gap: "8px" },
  trow:    { display: "grid", gridTemplateColumns: "80px 1fr 1fr 60px 80px 100px 120px 100px", padding: "14px 16px", gap: "8px", borderTop: "1px solid #f1f5f9", alignItems: "center" },
  th:      { fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" },
  td:      { fontSize: "14px", color: "#1f2937" },
};