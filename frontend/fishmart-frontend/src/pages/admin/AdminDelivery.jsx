import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetDeliveryBoys, adminAddDeliveryBoy,
  adminRemoveDeliveryBoy, adminAssignDelivery,
  adminUnassignedOrders
} from "../../services/api";
import { Sidebar, Loader, S } from "./AdminDashboard";

export default function AdminDelivery() {
  const navigate  = useNavigate();
  const [boys, setBoys]         = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("boys"); // "boys" | "assign"
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignModal, setAssignModal]   = useState(null); // order object
  const [form, setForm] = useState({ username:"", email:"", password:"", phone:"", vehicle_number:"" });
  const [selectedBoy, setSelectedBoy] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [b, u] = await Promise.all([adminGetDeliveryBoys(), adminUnassignedOrders()]);
      setBoys(b.data);
      setUnassigned(u.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoy = async (e) => {
    e.preventDefault();
    setActionLoading("add");
    try {
      await adminAddDeliveryBoy(form);
      setShowAddModal(false);
      setForm({ username:"", email:"", password:"", phone:"", vehicle_number:"" });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add delivery boy");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this delivery boy?")) return;
    setActionLoading(id);
    try {
      await adminRemoveDeliveryBoy(id);
      loadAll();
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssign = async () => {
    if (!selectedBoy) return alert("Select a delivery boy");
    setActionLoading("assign");
    try {
      await adminAssignDelivery(assignModal.id, { delivery_boy_id: selectedBoy });
      setAssignModal(null);
      setSelectedBoy("");
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || "Assignment failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (loading) return <Loader />;

  const STATUS_COLORS = {
    available: { bg: "#f0fdf4", color: "#16a34a" },
    busy:      { bg: "#fffbeb", color: "#d97706" },
    offline:   { bg: "#f1f5f9", color: "#64748b" },
  };

  return (
    <div style={S.page}>
      <Sidebar active="delivery" onLogout={handleLogout} />
      <main style={S.main}>

        {/* Header */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.heading}>Delivery Management</h1>
            <p style={S.sub}>{boys.length} delivery boys · {unassigned.length} unassigned orders</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={DS.addBtn}>
            + Add Delivery Boy
          </button>
        </div>

        {/* Tabs */}
        <div style={DS.tabs}>
          {[
            { key: "boys",   label: `🛵 Delivery Boys (${boys.length})`         },
            { key: "assign", label: `📦 Unassigned Orders (${unassigned.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              ...DS.tab,
              background: tab === t.key ? "#2563eb" : "white",
              color:      tab === t.key ? "white"   : "#64748b",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── Tab: Delivery Boys ── */}
        {tab === "boys" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {boys.map(boy => {
              const sc = STATUS_COLORS[boy.status] || STATUS_COLORS.offline;
              return (
                <div key={boy.id} style={DS.card}>
                  <div style={DS.cardTop}>
                    <div style={DS.avatar}>{boy.username?.[0]?.toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <p style={DS.name}>{boy.username}</p>
                      <p style={DS.email}>{boy.email}</p>
                    </div>
                    <span style={{ background: sc.bg, color: sc.color, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "50px" }}>
                      {boy.status}
                    </span>
                  </div>

                  <div style={DS.infoBox}>
                    <div style={DS.infoRow}><span>📞</span> {boy.phone}</div>
                    {boy.vehicle_number && <div style={DS.infoRow}><span>🚗</span> {boy.vehicle_number}</div>}
                    <div style={DS.infoRow}><span>✅</span> {boy.total_deliveries} deliveries</div>
                    <div style={DS.infoRow}>
                      <span>🔵</span>
                      {boy.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>

                  {boy.is_active && (
                    <button
                      onClick={() => handleRemove(boy.id)}
                      disabled={actionLoading === boy.id}
                      style={DS.removeBtn}
                    >
                      {actionLoading === boy.id ? "Removing..." : "🗑️ Remove"}
                    </button>
                  )}
                </div>
              );
            })}
            {boys.length === 0 && (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", color: "#9ca3af" }}>
                <p style={{ fontSize: "40px" }}>🛵</p>
                <p>No delivery boys added yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Unassigned Orders ── */}
        {tab === "assign" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {unassigned.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", color: "#9ca3af" }}>
                <p style={{ fontSize: "40px" }}>📭</p>
                <p>All orders are assigned!</p>
              </div>
            ) : unassigned.map(order => (
              <div key={order.id} style={DS.orderCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#2563eb" }}>#{order.id}</span>
                    <span style={{ fontSize: "13px", color: "#6b7280", marginLeft: "12px" }}>
                      📍 {order.delivery_address}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#f97316" }}>
                      ₹{order.total_amount}
                    </span>
                    <button
                      onClick={() => { setAssignModal(order); setSelectedBoy(""); }}
                      style={DS.assignBtn}
                    >
                      🛵 Assign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Add Delivery Boy Modal ── */}
      {showAddModal && (
        <div style={MS.overlay}>
          <div style={MS.modal}>
            <div style={MS.header}>
              <h2 style={{ margin: 0 }}>Add Delivery Boy</h2>
              <button onClick={() => setShowAddModal(false)} style={MS.close}>✕</button>
            </div>
            <form onSubmit={handleAddBoy} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <MField label="Username"       name="username"       value={form.username}       onChange={e => setForm({...form, username: e.target.value})} />
                <MField label="Email"          name="email"          value={form.email}          onChange={e => setForm({...form, email: e.target.value})} type="email" />
                <MField label="Password"       name="password"       value={form.password}       onChange={e => setForm({...form, password: e.target.value})} type="password" />
                <MField label="Phone"          name="phone"          value={form.phone}          onChange={e => setForm({...form, phone: e.target.value})} />
                <MField label="Vehicle Number (optional)" name="vehicle_number" value={form.vehicle_number} onChange={e => setForm({...form, vehicle_number: e.target.value})} />
              </div>
              <button type="submit" disabled={actionLoading === "add"} style={MS.submitBtn}>
                {actionLoading === "add" ? "Adding..." : "Add Delivery Boy"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Modal ── */}
      {assignModal && (
        <div style={MS.overlay}>
          <div style={{ ...MS.modal, maxWidth: "420px" }}>
            <div style={MS.header}>
              <h2 style={{ margin: 0 }}>Assign Order #{assignModal.id}</h2>
              <button onClick={() => setAssignModal(null)} style={MS.close}>✕</button>
            </div>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 16px" }}>
              📍 {assignModal.delivery_address}
            </p>
            <label style={MS.label}>Select Delivery Boy</label>
            <select
              value={selectedBoy}
              onChange={e => setSelectedBoy(e.target.value)}
              style={MS.input}
            >
              <option value="">-- Select --</option>
              {boys.filter(b => b.status === "available" && b.is_active).map(b => (
                <option key={b.id} value={b.id}>
                  {b.username} — {b.phone}
                </option>
              ))}
            </select>
            {boys.filter(b => b.status === "available").length === 0 && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                ⚠️ No available delivery boys right now
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => setAssignModal(null)} style={{ ...MS.submitBtn, background: "#f1f5f9", color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={handleAssign} disabled={actionLoading === "assign"} style={MS.submitBtn}>
                {actionLoading === "assign" ? "Assigning..." : "🛵 Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

const DS = {
  addBtn:    { background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
  tabs:      { display: "flex", gap: "8px", marginBottom: "20px" },
  tab:       { padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  card:      { background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "14px" },
  cardTop:   { display: "flex", alignItems: "center", gap: "12px" },
  avatar:    { width: "44px", height: "44px", borderRadius: "12px", background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", flexShrink: 0 },
  name:      { margin: 0, fontWeight: "700", color: "#1f2937", fontSize: "15px" },
  email:     { margin: 0, color: "#94a3b8", fontSize: "12px" },
  infoBox:   { background: "#f8fafc", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" },
  infoRow:   { display: "flex", gap: "8px", fontSize: "13px", color: "#475569", alignItems: "center" },
  removeBtn: { padding: "9px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  orderCard: { background: "white", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  assignBtn: { background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "8px 18px", fontWeight: "600", cursor: "pointer", fontSize: "13px" },
};

const MS = {
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:     { background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  close:     { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" },
  label:     { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" },
  input:     { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  submitBtn: { flex: 1, padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};