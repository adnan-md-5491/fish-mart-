import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import { useNavigate } from "react-router-dom";

const STEPS = ["PLACED", "CONFIRMED", "ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"];

const STEP_LABELS = {
  PLACED:           { label: "Order Placed",    icon: "📋", desc: "Your order has been received" },
  CONFIRMED:        { label: "Confirmed",        icon: "✅", desc: "Order confirmed" },
  ASSIGNED:         { label: "Boy Assigned",     icon: "🛵", desc: "Delivery boy assigned to your order" },
  PICKED_UP:        { label: "Picked Up",        icon: "📦", desc: "Order picked up from store" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: "🚴", desc: "Delivery boy is on the way" },
  DELIVERED:        { label: "Delivered",        icon: "🎉", desc: "Order delivered successfully" },
  CANCELLED:        { label: "Cancelled",        icon: "❌", desc: "Order has been cancelled" },
};

const STATUS_COLOR = {
  DELIVERED:        { border: "#28a745", bg: "#e8f5e9", color: "#28a745" },
  CANCELLED:        { border: "#dc3545", bg: "#ffebee", color: "#dc3545" },
  OUT_FOR_DELIVERY: { border: "#007bff", bg: "#e3f2fd", color: "#007bff" },
  ASSIGNED:         { border: "#8b5cf6", bg: "#f5f3ff", color: "#8b5cf6" },
  PICKED_UP:        { border: "#f59e0b", bg: "#fffbeb", color: "#f59e0b" },
  PLACED:           { border: "#ff6f00", bg: "#fff8f0", color: "#ff6f00" },
  CONFIRMED:        { border: "#ff6f00", bg: "#fff8f0", color: "#ff6f00" },
};

// ── Tracking Bar ─────────────────────────────────────────────
function TrackingBar({ status }) {
  if (status === "CANCELLED") {
    return (
      <div style={{
        background: "#ffebee", borderRadius: "10px", padding: "12px 16px",
        color: "#dc3545", fontWeight: "600", fontSize: "14px", textAlign: "center"
      }}>
        ❌ Order Cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ position: "relative", marginBottom: "8px" }}>
        {/* Progress Bar */}
        <div style={{ height: "4px", background: "#e5e7eb", borderRadius: "4px" }}>
          <div style={{
            height: "100%", borderRadius: "4px",
            background: "linear-gradient(90deg, #ff6f00, #ff9f43)",
            width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
            transition: "width 0.5s ease"
          }} />
        </div>

        {/* Step Dots */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          {STEPS.map((step, idx) => {
            const done   = idx <= currentIndex;
            const active = idx === currentIndex;
            return (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width:  active ? "36px" : "28px",
                  height: active ? "36px" : "28px",
                  borderRadius: "50%",
                  background: done ? "linear-gradient(135deg, #ff6f00, #ff9f43)" : "#e5e7eb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: active ? "16px" : "13px",
                  boxShadow: active ? "0 4px 12px rgba(255,111,0,0.4)" : "none",
                  transition: "all 0.3s ease", marginBottom: "6px"
                }}>
                  {done ? STEP_LABELS[step].icon : "○"}
                </div>
                <span style={{
                  fontSize: "10px", fontWeight: active ? "700" : "500",
                  color: done ? "#ff6f00" : "#9ca3af",
                  textAlign: "center", lineHeight: "1.3"
                }}>
                  {STEP_LABELS[step].label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Message */}
      <div style={{
        background: "#fff8f0", border: "1px solid #ffd8a8",
        borderRadius: "8px", padding: "10px 14px",
        fontSize: "13px", color: "#ff6f00", fontWeight: "600",
        marginTop: "12px", textAlign: "center"
      }}>
        {STEP_LABELS[status]?.icon} {STEP_LABELS[status]?.desc}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(()  => { setLoading(false); navigate("/login"); });
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <div style={{
        width: "40px", height: "40px",
        border: "4px solid #e5e7eb", borderTop: "4px solid #ff6f00",
        borderRadius: "50%", animation: "spin 1s linear infinite",
        margin: "0 auto 16px"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#6b7280" }}>Loading orders...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
      <h2 style={{ color: "#1f2937", marginBottom: "8px" }}>No orders yet!</h2>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Looks like you haven't ordered anything</p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 28px", background: "#ff6f00", color: "white",
          border: "none", borderRadius: "10px", fontWeight: "600",
          cursor: "pointer", fontSize: "16px"
        }}>
        Start Shopping
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: "24px", fontSize: "26px", fontWeight: "700", color: "#1f2937" }}>
        📦 My Orders
      </h2>

      {orders.map(order => {
        const sc             = STATUS_COLOR[order.status] || STATUS_COLOR.PLACED;
        const deliveryCharge = parseFloat(order.delivery_charge || 0);
        const totalAmount    = parseFloat(order.total_amount || 0);
        const subtotal       = totalAmount - deliveryCharge;

        return (
          <div key={order.id} style={{
            background: "white", borderRadius: "16px", padding: "20px",
            marginBottom: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            borderLeft: `4px solid ${sc.border}`
          }}>

            {/* ── Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontWeight: "700", fontSize: "16px", color: "#1f2937" }}>
                Order #{order.id}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  padding: "4px 12px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: "700",
                  background: sc.bg, color: sc.color
                }}>
                  {STEP_LABELS[order.status]?.label || order.status}
                </span>

                {/* Track Button */}
                {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                  <button
                    onClick={() => navigate(`/orders/${order.id}/track`)}
                    style={{
                      background: "#eff6ff", color: "#2563eb",
                      border: "1.5px solid #bfdbfe", borderRadius: "8px",
                      padding: "5px 14px", fontWeight: "600",
                      cursor: "pointer", fontSize: "12px",
                      display: "flex", alignItems: "center", gap: "4px"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                    onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
                  >
                    📍 Track Order
                  </button>
                )}

                {/* Delivered Badge */}
                {order.status === "DELIVERED" && (
                  <span style={{
                    background: "#f0fdf4", color: "#16a34a",
                    border: "1.5px solid #bbf7d0", borderRadius: "8px",
                    padding: "5px 14px", fontWeight: "600", fontSize: "12px"
                  }}>
                    ✅ Completed
                  </span>
                )}
              </div>
            </div>

            {/* ── Tracking Bar ── */}
            <TrackingBar status={order.status} />

            {/* ── Items ── */}
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Items
              </h4>
              {order.items.map(item => (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: "14px"
                }}>
                  <span style={{ color: "#374151", textTransform: "capitalize" }}>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: "600", color: "#1f2937" }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Delivery Info ── */}
            <div style={{
              marginTop: "14px", padding: "12px",
              background: "#f9fafb", borderRadius: "10px",
              fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px"
            }}>
              {order.delivery_address && (
                <div>📍 <span style={{ color: "#374151" }}>{order.delivery_address}</span></div>
              )}
              {order.phone && (
                <div>📞 <span style={{ color: "#374151" }}>{order.phone}</span></div>
              )}
              {order.instructions && (
                <div>📝 <span style={{ color: "#374151" }}>{order.instructions}</span></div>
              )}
            </div>

            {/* ── Price Breakdown + Footer ── */}
            <div style={{ marginTop: "14px", borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>

              {/* Subtotal */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                <span style={{ color: "#9ca3af" }}>Subtotal</span>
                <span style={{ color: "#374151" }}>₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Delivery Charge */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "10px" }}>
                <span style={{ color: "#9ca3af" }}>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span style={{ color: "#16a34a", fontWeight: "700" }}>FREE 🎉</span>
                ) : (
                  <span style={{ color: "#ef4444", fontWeight: "600" }}>
                    ₹{deliveryCharge.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Date + Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e5e7eb", paddingTop: "10px" }}>
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </span>
                <span style={{ fontWeight: "800", fontSize: "18px", color: "#1f2937" }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;