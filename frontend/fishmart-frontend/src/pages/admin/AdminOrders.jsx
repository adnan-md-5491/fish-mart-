import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetOrders } from "../../services/api";
import { Sidebar, Loader, S } from "./AdminDashboard";

const STATUS_COLORS = {
  PLACED:           { bg: "#fffbeb", color: "#d97706" },
  CONFIRMED:        { bg: "#eff6ff", color: "#2563eb" },
  OUT_FOR_DELIVERY: { bg: "#f0fdf4", color: "#059669" },
  DELIVERED:        { bg: "#dcfce7", color: "#15803d" },
  CANCELLED:        { bg: "#fef2f2", color: "#dc2626" },
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId]     = useState(null);

  useEffect(() => {
    adminGetOrders()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = !search ||
      String(o.id).includes(search) ||
      o.delivery_address?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = filtered.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);

  if (loading) return <Loader />;

  return (
    <div style={S.page}>
      <Sidebar active="orders" onLogout={handleLogout} />
      <main style={S.main}>

        {/* Header */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.heading}>All Orders</h1>
            <p style={S.sub}>{filtered.length} orders · Revenue: <strong style={{ color: "#10b981" }}>₹{totalRevenue.toFixed(2)}</strong></p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            placeholder="🔍 Search by order ID or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", width: "280px" }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["all", "PLACED", "CONFIRMED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: "8px 16px", borderRadius: "50px", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: "600",
                background: filterStatus === s ? "#2563eb" : "#f1f5f9",
                color: filterStatus === s ? "white" : "#64748b",
              }}>{s === "all" ? "All" : s.replace(/_/g, " ")}</button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#9ca3af" }}>
              <p style={{ fontSize: "48px" }}>📭</p>
              <p>No orders found</p>
            </div>
          ) : filtered.map(order => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PLACED;
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} style={OS.card}>
                {/* Order Row */}
                <div style={OS.row} onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div style={OS.orderId}>#{order.id}</div>

                  <div style={OS.col}>
                    <p style={OS.label}>Address</p>
                    <p style={OS.val}>{order.delivery_address || "—"}</p>
                  </div>

                  <div style={OS.col}>
                    <p style={OS.label}>Phone</p>
                    <p style={OS.val}>{order.phone || "—"}</p>
                  </div>

                  <div style={OS.col}>
                    <p style={OS.label}>Total</p>
                    <p style={{ ...OS.val, color: "#f97316", fontWeight: "800", fontSize: "16px" }}>
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  <div style={OS.col}>
                    <p style={OS.label}>Date</p>
                    <p style={OS.val}>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>

                  <span style={{ background: sc.bg, color: sc.color, fontSize: "12px", fontWeight: "700", padding: "5px 14px", borderRadius: "50px", whiteSpace: "nowrap" }}>
                    {order.status?.replace(/_/g, " ")}
                  </span>

                  <span style={{ color: "#94a3b8", fontSize: "18px", marginLeft: "8px" }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded Items */}
                {isExpanded && (
                  <div style={OS.expanded}>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Order Items
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={OS.itemRow}>
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover" }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: "600", color: "#1f2937", fontSize: "14px", textTransform: "capitalize" }}>{item.product?.name}</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>Qty: {item.quantity}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontWeight: "700", color: "#1f2937" }}>₹{parseFloat(item.price).toFixed(2)}</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>per kg</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.instructions && (
                      <div style={{ marginTop: "12px", background: "#fffbeb", borderRadius: "8px", padding: "10px 14px" }}>
                        <span style={{ fontSize: "12px", color: "#92400e" }}>📝 Instructions: {order.instructions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const OS = {
  card:     { background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  row:      { display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px", cursor: "pointer" },
  orderId:  { fontSize: "16px", fontWeight: "800", color: "#2563eb", minWidth: "60px" },
  col:      { flex: 1 },
  label:    { fontSize: "11px", color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", fontWeight: "600" },
  val:      { fontSize: "13px", color: "#1f2937", margin: 0, fontWeight: "500" },
  expanded: { borderTop: "1px solid #f1f5f9", padding: "20px", background: "#fafafa" },
  itemRow:  { display: "flex", alignItems: "center", gap: "14px", background: "white", borderRadius: "10px", padding: "12px" },
};