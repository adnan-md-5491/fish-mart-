import { useEffect, useState } from "react";
import { vendorGetProducts, vendorAddProduct, vendorUpdateProduct, vendorDeleteProduct } from "../../services/api";
import { getCategories } from "../../services/api";

export default function VendorProducts() {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [form, setForm] = useState({
    name: "", normal_price: "", member_price: "",
    stock: "", category: "", image: null
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([vendorGetProducts(), getCategories()]);
    setProducts(p.data);
    setCategories(c.data);
    setLoading(false);
  };

  const openAdd  = () => { setEditProduct(null); setForm({ name: "", normal_price: "", member_price: "", stock: "", category: "", image: null }); setShowModal(true); };
const openEdit = (p) => {
  setEditProduct(p);
  setForm({
    name: p.name,
    normal_price: p.normal_price ?? "",  // ← sahi field
    member_price: p.member_price ?? "",  // ← sahi field
    stock: p.stock ?? "",
    category: p.category ?? "",
    image: null
  });
  setShowModal(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== "") fd.append(k, v); });
    try {
      if (editProduct) {
        await vendorUpdateProduct(editProduct.id, fd);
      } else {
        await vendorAddProduct(fd);
      }
      setShowModal(false);
      loadAll();
    } catch (err) {
      alert("Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await vendorDeleteProduct(id);
    loadAll();
  };

  return (
    <div style={styles.page}>
      {/* Sidebar — same as Dashboard */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🏪 FishMart</div>
        <SidebarLinks active="products" />
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>My Products</h1>
          <button onClick={openAdd} style={styles.addBtn}>+ Add Product</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={styles.grid}>
            {products.map(p => (
              <div key={p.id} style={styles.card}>
                <img src={p.image} alt={p.name} style={styles.img} />
                <div style={styles.cardBody}>
                  <span style={styles.badge}>{p.category_name}</span>
                  <h3 style={styles.name}>{p.name}</h3>
                  
{/* <p style={styles.price}>₹{p.price}</p> */}


<div style={{ marginBottom: "8px" }}>
  <p style={styles.price}>₹{p.normal_price}
    <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "400", marginLeft: "4px" }}>
      normal
    </span>
  </p>
  <p style={{ fontSize: "13px", color: "#10b981", fontWeight: "700", margin: "2px 0 0" }}>
    ₹{p.member_price}
    <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "400", marginLeft: "4px" }}>
      member
    </span>
  </p>
</div>
                  <div style={styles.cardActions}>
                    <button onClick={() => openEdit(p)} style={styles.editBtn}>✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={styles.delBtn}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>{editProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <MField label="Product Name"  name="name"         value={form.name}         onChange={e => setForm({...form, name: e.target.value})} />
              <div style={styles.row}>
                <MField label="Normal Price" name="normal_price" value={form.normal_price} onChange={e => setForm({...form, normal_price: e.target.value})} type="number" />
                <MField label="Member Price" name="member_price" value={form.member_price} onChange={e => setForm({...form, member_price: e.target.value})} type="number" />
              </div>
              <div style={styles.row}>
                <MField label="Stock" name="stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} type="number" />
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select style={styles.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={styles.label}>Product Image</label>
                <input type="file" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})}
                  style={{ ...styles.input, padding: "8px" }} required={!editProduct} />
              </div>
              <button type="submit" style={styles.submitBtn}>
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MField({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={styles.label}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required style={styles.input} />
    </div>
  );
}

function SidebarLinks({ active }) {
  const links = [
    { to: "/vendor/dashboard", icon: "🏠", label: "Dashboard",  key: "dashboard" },
    { to: "/vendor/products",  icon: "📦", label: "Products",   key: "products"  },
    { to: "/vendor/orders",    icon: "🛒", label: "Orders",     key: "orders"    },
    { to: "/vendor/earnings",  icon: "💰", label: "Earnings",   key: "earnings"  },
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
  topBar:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  heading:    { fontSize: "26px", fontWeight: "800", color: "#1f2937", margin: 0 },
  addBtn:     { background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
  grid:       { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  card:       { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  img:        { width: "100%", height: "160px", objectFit: "cover" },
  cardBody:   { padding: "14px" },
  badge:      { background: "#eff6ff", color: "#2563eb", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "50px" },
  name:       { fontSize: "15px", fontWeight: "700", color: "#1f2937", margin: "8px 0 4px", textTransform: "capitalize" },
  price:      { fontSize: "18px", fontWeight: "800", color: "#f97316", margin: "0 0 12px" },
  cardActions:{ display: "flex", gap: "8px" },
  editBtn:    { flex: 1, padding: "8px", background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  delBtn:     { flex: 1, padding: "8px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:      { background: "white", borderRadius: "20px", padding: "32px", width: "520px", maxHeight: "90vh", overflowY: "auto" },
  modalHeader:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  closeBtn:   { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" },
  form:       { display: "flex", flexDirection: "column", gap: "16px" },
  row:        { display: "flex", gap: "16px" },
  label:      { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  input:      { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  submitBtn:  { padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
};