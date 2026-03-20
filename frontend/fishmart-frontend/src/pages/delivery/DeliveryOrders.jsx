import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deliveryMyOrders, deliveryUpdateStatus } from "../../services/api";
import { Sidebar, Loader, S } from "./DeliveryDashboard";

const STATUS_FLOW = {
  ASSIGNED:         { next: "PICKED_UP",        label: "Mark Picked Up",      color: "#f59e0b" },
  PICKED_UP:        { next: "OUT_FOR_DELIVERY",  label: "Out for Delivery",    color: "#3b82f6" },
  OUT_FOR_DELIVERY: { next: "DELIVERED",         label: "Mark Delivered ✅",   color: "#10b981" },
};

const STATUS_COLORS = {
  ASSIGNED:         { bg: "#fffbeb", color: "#d97706" },
  PICKED_UP:        { bg: "#eff6ff", color: "#2563eb" },
  OUT_FOR_DELIVERY: { bg: "#f0fdf4", color: "#059669" },
  DELIVERED:        { bg: "#dcfce7", color: "#15803d" },
  CANCELLED:        { bg: "#fef2f2", color: "#dc2626" },
};

export default function DeliveryOrders() {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = () => {
    setLoading(true);
    deliveryMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  };

  const handleStatusUpdate = async (trackingId, newStatus) => {
    setUpdating(trackingId);
    try {
      await deliveryUpdateStatus(trackingId, { status: newStatus });
      loadOrders();
    } catch {
      alert("Status update failed");
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (loading) return <Loader />;

  return (
    <div style={S.page}>
      <Sidebar active="orders" onLogout={handleLogout} />
      <main style={S.main}>

        <div style={S.header}>
          <div>
            <h1 style={S.title}>My Orders</h1>
            <p style={S.sub}>{orders.length} active orders</p>
          </div>
        </div>

        <div style={{ padding: "0 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px" }}>
              <p style={{ fontSize: "48px" }}>📭</p>
              <p style={{ color: "#6b7280", fontSize: "16px" }}>No orders assigned yet</p>
            </div>
          ) : orders.map(order => {
            const sc   = STATUS_COLORS[order.status] || STATUS_COLORS.ASSIGNED;
            const flow = STATUS_FLOW[order.status];
            return (
              <div key={order.tracking_id} style={OS.card}>

                {/* Card Header */}
                <div style={OS.cardHeader}>
                  <div>
                    <span style={OS.orderId}>Order #{order.order_id}</span>
                    <span style={{
                      ...OS.statusBadge,
                      background: sc.bg, color: sc.color
                    }}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span style={OS.amount}>₹{order.total_amount}</span>
                </div>

                {/* Customer Info */}
                <div style={OS.infoGrid}>
                  <InfoBox icon="👤" label="Customer"  value={order.customer_name} />
                  <InfoBox icon="📞" label="Phone"     value={order.customer_phone} />
                  <InfoBox icon="📍" label="Address"   value={order.delivery_address} />
                  {order.instructions && (
                    <InfoBox icon="📝" label="Instructions" value={order.instructions} />
                  )}
                </div>

                {/* Progress Steps */}
                <div style={OS.progressBar}>
                  {["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"].map((step, i) => {
                    const steps  = ["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"];
                    const curIdx = steps.indexOf(order.status);
                    const done   = i <= curIdx;
                    return (
                      <div key={step} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          background: done ? "#2563eb" : "#e2e8f0",
                          color: done ? "white" : "#94a3b8",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "12px",
                          fontWeight: "700", flexShrink: 0
                        }}>
                          {done ? "✓" : i + 1}
                        </div>
                        <div style={{ marginLeft: "6px", marginRight: "6px" }}>
                          <p style={{ margin: 0, fontSize: "10px", fontWeight: "600", color: done ? "#2563eb" : "#94a3b8" }}>
                            {step.replace(/_/g, " ")}
                          </p>
                        </div>
                        {i < 3 && <div style={{ flex: 1, height: "2px", background: done && i < curIdx ? "#2563eb" : "#e2e8f0", marginRight: "6px" }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                {flow && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                    <button
                      onClick={() => handleStatusUpdate(order.tracking_id, flow.next)}
                      disabled={updating === order.tracking_id}
                      style={{
                        flex: 1, padding: "12px",
                        background: updating === order.tracking_id ? "#e5e7eb" : flow.color,
                        color: updating === order.tracking_id ? "#9ca3af" : "white",
                        border: "none", borderRadius: "10px",
                        fontSize: "14px", fontWeight: "700",
                        cursor: updating === order.tracking_id ? "not-allowed" : "pointer"
                      }}
                    >
                      {updating === order.tracking_id ? "Updating..." : flow.label}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order.tracking_id, "CANCELLED")}
                      disabled={updating === order.tracking_id}
                      style={{
                        padding: "12px 20px",
                        background: "#fef2f2", color: "#ef4444",
                        border: "1px solid #fca5a5", borderRadius: "10px",
                        fontSize: "14px", fontWeight: "700", cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {order.status === "DELIVERED" && (
                  <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "12px", textAlign: "center", marginTop: "12px", color: "#16a34a", fontWeight: "700" }}>
                    ✅ Delivered Successfully!
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

function InfoBox({ icon, label, value }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 14px" }}>
      <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>
        {icon} {label}
      </p>
      <p style={{ margin: 0, fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>{value}</p>
    </div>
  );
}

const OS = {
  card:       { background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  orderId:    { fontSize: "18px", fontWeight: "800", color: "#1f2937", marginRight: "12px" },
  statusBadge:{ fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "50px" },
  amount:     { fontSize: "20px", fontWeight: "800", color: "#f97316" },
  infoGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" },
  progressBar:{ display: "flex", alignItems: "center", background: "#f8fafc", borderRadius: "12px", padding: "14px 16px" },
};