import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackOrder } from "../services/api";

const STATUS_STEPS = ["PLACED", "CONFIRMED", "ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"];

const STEP_LABELS = {
  PLACED:           { icon: "📋", label: "Order Placed"         },
  CONFIRMED:        { icon: "✅", label: "Confirmed"            },
  ASSIGNED:         { icon: "🛵", label: "Delivery Boy Assigned" },
  PICKED_UP:        { icon: "📦", label: "Picked Up"            },
  OUT_FOR_DELIVERY: { icon: "🚀", label: "Out for Delivery"      },
  DELIVERED:        { icon: "🏠", label: "Delivered"            },
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    loadTracking();
    const interval = setInterval(loadTracking, 15000); // 15 sec auto refresh
    return () => clearInterval(interval);
  }, [orderId]);

  const loadTracking = () => {
    trackOrder(orderId)
      .then(res => setData(res.data))
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div style={{ width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "80px", color: "#ef4444" }}>{error}</div>
  );

  const currentIdx = STATUS_STEPS.indexOf(data.status);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "32px 24px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "white", borderRadius: "20px", padding: "28px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1f2937", margin: "0 0 4px" }}>
                Track Order
              </h1>
              <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>Order #{data.order_id}</p>
            </div>
            {data.status === "DELIVERED" ? (
              <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "8px 18px", borderRadius: "50px", fontWeight: "700", fontSize: "14px" }}>
                ✅ Delivered
              </span>
            ) : (
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "8px 18px", borderRadius: "50px", fontWeight: "700", fontSize: "14px" }}>
                🔄 Live Tracking
              </span>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ background: "white", borderRadius: "20px", padding: "28px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 24px" }}>
            Order Status
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= currentIdx;
              const current = i === currentIdx;
              const info    = STEP_LABELS[step];
              return (
                <div key={step} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  {/* Circle + Line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: done ? (current ? "#2563eb" : "#e0f2fe") : "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", flexShrink: 0,
                      border: current ? "3px solid #2563eb" : "none",
                      boxShadow: current ? "0 0 0 4px rgba(37,99,235,0.15)" : "none"
                    }}>
                      {info.icon}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div style={{
                        width: "2px", height: "32px",
                        background: i < currentIdx ? "#2563eb" : "#e2e8f0",
                        marginTop: "4px", marginBottom: "4px"
                      }} />
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ paddingTop: "8px", paddingBottom: i < STATUS_STEPS.length - 1 ? "0" : "0" }}>
                    <p style={{
                      margin: 0, fontWeight: current ? "800" : "600",
                      color: done ? "#1f2937" : "#94a3b8", fontSize: "15px"
                    }}>
                      {info.label}
                    </p>
                    {current && (
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
                        ← Current Status
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Boy Info */}
        {data.delivery_boy_name && (
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 16px" }}>
              🛵 Delivery Boy
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800" }}>
                {data.delivery_boy_name[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "700", color: "#1f2937" }}>{data.delivery_boy_name}</p>
                <a href={`tel:${data.delivery_boy_phone}`} style={{ color: "#2563eb", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
                  📞 {data.delivery_boy_phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Auto refresh note */}
        {data.status !== "DELIVERED" && (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
            🔄 Auto refreshes every 15 seconds
          </p>
        )}
      </div>
    </div>
  );
}