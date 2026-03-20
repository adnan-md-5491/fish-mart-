import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetVendors, adminApproveVendor, adminSetCommission } from "../../services/api";
import { Sidebar, Loader, S } from "./AdminDashboard";

export default function AdminVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [commissionModal, setCommissionModal] = useState(null); // vendor object
  const [commissionVal, setCommissionVal]     = useState("");
  const [actionLoading, setActionLoading]     = useState(null);

  useEffect(() => { loadVendors(); }, []);

  const loadVendors = () => {
    setLoading(true);
    adminGetVendors()
      .then(res => setVendors(res.data))
      .finally(() => setLoading(false));
  };

  const handleAction = async (id, action) => {
    setActionLoading(`${id}-${action}`);
    try {
      await adminApproveVendor(id, action);
      loadVendors();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCommission = async () => {
    if (!commissionVal) return;
    await adminSetCommission(commissionModal.id, commissionVal);
    setCommissionModal(null);
    setCommissionVal("");
    loadVendors();
  };

  const filtered = filter === "all" ? vendors : vendors.filter(v => v.status === filter);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (loading) return <Loader />;

  const STATUS = {
    approved: { bg: "#f0fdf4", color: "#16a34a", label: "Approved" },
    pending:  { bg: "#fffbeb", color: "#d97706", label: "Pending"  },
    rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
  };

  return (
    <div style={S.page}>
      <Sidebar active="vendors" onLogout={handleLogout} />
      <main style={S.main}>

        {/* Header */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.heading}>Manage Vendors</h1>
            <p style={S.sub}>{vendors.length} total vendors</p>
          </div>
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            {["all", "pending", "approved", "rejected"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 18px", borderRadius: "50px", border: "none",
                cursor: "pointer", fontSize: "13px", fontWeight: "600",
                background: filter === f ? "#2563eb" : "#f1f5f9",
                color: filter === f ? "white" : "#64748b",
                textTransform: "capitalize"
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Pending Alert */}
        {vendors.filter(v => v.status === "pending").length > 0 && (
          <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#92400e", fontSize: "14px" }}>
            ⚠️ <strong>{vendors.filter(v => v.status === "pending").length}</strong> vendor(s) waiting for approval
          </div>
        )}

        {/* Vendors Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {filtered.map(v => {
            const sc = STATUS[v.status] || STATUS.pending;
            return (
              <div key={v.id} style={VS.card}>
                {/* Card Header */}
                <div style={VS.cardHeader}>
                  <div style={VS.avatar}>{v.shop_name?.[0]?.toUpperCase() || "V"}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={VS.shopName}>{v.shop_name}</h3>
                    <p style={VS.username}>@{v.username}</p>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "50px" }}>
                    {sc.label}
                  </span>
                </div>

                {/* Info */}
                <div style={VS.info}>
                  <InfoRow icon="📧" val={v.email} />
                  <InfoRow icon="📞" val={v.phone} />
                  <InfoRow icon="📍" val={v.address} />
                  <InfoRow icon="📊" val={`Commission: ${v.commission_rate}%`} bold />
                  <InfoRow icon="💰" val={`Total Earnings: ₹${v.total_earnings}`} bold />
                </div>

                {/* Actions */}
                <div style={VS.actions}>
                  {v.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(v.id, "approve")}
                        disabled={actionLoading === `${v.id}-approve`}
                        style={{ ...VS.btn, background: "#10b981", color: "white" }}>
                        {actionLoading === `${v.id}-approve` ? "..." : "✅ Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(v.id, "reject")}
                        disabled={actionLoading === `${v.id}-reject`}
                        style={{ ...VS.btn, background: "#ef4444", color: "white" }}>
                        {actionLoading === `${v.id}-reject` ? "..." : "❌ Reject"}
                      </button>
                    </>
                  )}
                  {v.status === "approved" && (
                    <button
                      onClick={() => handleAction(v.id, "reject")}
                      disabled={actionLoading === `${v.id}-reject`}
                      style={{ ...VS.btn, background: "#fef2f2", color: "#ef4444", flex: 1 }}>
                      {actionLoading === `${v.id}-reject` ? "..." : "❌ Revoke Approval"}
                    </button>
                  )}
                  {v.status === "rejected" && (
                    <button
                      onClick={() => handleAction(v.id, "approve")}
                      disabled={actionLoading === `${v.id}-approve`}
                      style={{ ...VS.btn, background: "#f0fdf4", color: "#16a34a", flex: 1 }}>
                      {actionLoading === `${v.id}-approve` ? "..." : "✅ Re-Approve"}
                    </button>
                  )}
                  <button
                    onClick={() => { setCommissionModal(v); setCommissionVal(v.commission_rate); }}
                    style={{ ...VS.btn, background: "#eff6ff", color: "#2563eb" }}>
                    📊 Commission
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px", color: "#9ca3af" }}>
            <p style={{ fontSize: "48px" }}>🏪</p>
            <p>No vendors in this category</p>
          </div>
        )}
      </main>

      {/* Commission Modal */}
      {commissionModal && (
        <div style={MS.overlay}>
          <div style={MS.modal}>
            <h2 style={{ margin: "0 0 8px" }}>Set Commission</h2>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 24px" }}>
              for <strong>{commissionModal.shop_name}</strong>
            </p>
            <label style={MS.label}>Commission Rate (%)</label>
            <input
              type="number" min="0" max="100" step="0.5"
              value={commissionVal}
              onChange={e => setCommissionVal(e.target.value)}
              style={MS.input}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => setCommissionModal(null)}
                style={{ ...MS.btn, background: "#f1f5f9", color: "#64748b" }}>Cancel</button>
              <button onClick={handleCommission}
                style={{ ...MS.btn, background: "#2563eb", color: "white" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, val, bold }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "6px" }}>
      <span style={{ fontSize: "13px" }}>{icon}</span>
      <span style={{ fontSize: "13px", color: bold ? "#1f2937" : "#6b7280", fontWeight: bold ? "600" : "400" }}>{val}</span>
    </div>
  );
}

const VS = {
  card:       { background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "16px" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px" },
  avatar:     { width: "48px", height: "48px", borderRadius: "14px", background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", flexShrink: 0 },
  shopName:   { fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: 0 },
  username:   { fontSize: "12px", color: "#94a3b8", margin: 0 },
  info:       { background: "#f8fafc", borderRadius: "10px", padding: "14px" },
  actions:    { display: "flex", gap: "8px", flexWrap: "wrap" },
  btn:        { flex: 1, padding: "9px 12px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", minWidth: "100px" },
};

const MS = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:   { background: "white", borderRadius: "20px", padding: "32px", width: "380px" },
  label:   { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" },
  input:   { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "16px", outline: "none", boxSizing: "border-box" },
  btn:     { flex: 1, padding: "12px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
};