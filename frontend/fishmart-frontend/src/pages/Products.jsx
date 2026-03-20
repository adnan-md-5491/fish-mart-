import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useLocation } from "react-router-dom";
import { getProducts, addToCart } from "../services/api";
import { useNavigate } from "react-router-dom";

// ── Offer Banner Data ────────────────────────────────────────
const OFFERS = [
  {
    id: 1,
    bg: "linear-gradient(135deg, #0f4c81 0%, #1a73e8 100%)",
    tag: "LIMITED TIME",
    title: "Fresh Fish, Direct from Sea 🐟",
    desc: "Get 20% off on all fish orders above ₹500",
    btn: "Shop Now",
    btnColor: "#facc15",
    btnText: "#1a1a1a",
    category: "fish",
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    tag: "MEMBERSHIP OFFER",
    title: "Join NammaFreshMart Premium 👑",
    desc: "Get exclusive member prices on every order. Monthly ₹499 only!",
    btn: "Become a Member",
    btnColor: "#facc15",
    btnText: "#1a1a1a",
    category: null,
    isMembership: true,
  },
  {
    id: 3,
    bg: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
    tag: "FRESH EVERYDAY",
    title: "Farm Fresh Vegetables 🥦",
    desc: "Organic vegetables delivered at your doorstep",
    btn: "Explore Now",
    btnColor: "#facc15",
    btnText: "#1a1a1a",
    category: "vegetable",
  },
  {
    id: 4,
    bg: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
    tag: "BEST QUALITY",
    title: "Premium Chicken & Mutton 🍗",
    desc: "Fresh cuts, cleaned & delivered in 30 mins",
    btn: "Order Now",
    btnColor: "#fff",
    btnText: "#92400e",
    category: "chicken",
  },
];

// ── Offer Banner Component ───────────────────────────────────
function OfferBanner() {
  const navigate   = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((prev) => (prev + 1) % OFFERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (indexOrFn) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(indexOrFn);
      setAnimating(false);
    }, 300);
  };

  const offer = OFFERS[current];

  const handleBtn = () => {
    if (offer.isMembership) {
      window.dispatchEvent(new Event("openMembership"));
    } else if (offer.category) {
      navigate(`/?category=${offer.category}`);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Main Banner */}
      <div style={{
        background: offer.bg,
        minHeight: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 60px",
        transition: "opacity 0.3s ease",
        opacity: animating ? 0 : 1,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", right: "20%", top: "-40px",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)"
        }} />
        <div style={{
          position: "absolute", right: "30%", bottom: "-60px",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)"
        }} />

        {/* Left Content */}
        <div style={{ zIndex: 1, maxWidth: "60%" }}>
          <span style={{
            background: "rgba(255,255,255,0.2)",
            color: "white", fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "50px",
            letterSpacing: "1px", display: "inline-block", marginBottom: "12px"
          }}>
            {offer.tag}
          </span>
          <h2 style={{
            color: "white", fontSize: "30px", fontWeight: "800",
            margin: "0 0 8px", lineHeight: "1.2"
          }}>
            {offer.title}
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)", fontSize: "15px",
            margin: "0 0 20px"
          }}>
            {offer.desc}
          </p>
          <button onClick={handleBtn} style={{
            background: offer.btnColor, color: offer.btnText,
            border: "none", borderRadius: "8px",
            padding: "12px 28px", fontSize: "15px",
            fontWeight: "700", cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {offer.btn} →
          </button>
        </div>

        {/* Right — Offer Number */}
        <div style={{
          fontSize: "100px", opacity: 0.15,
          fontWeight: "900", color: "white",
          userSelect: "none", zIndex: 1
        }}>
          {String(current + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={() => goTo((current - 1 + OFFERS.length) % OFFERS.length)}
        style={arrowStyle("left")}
      >‹</button>

      {/* Next Button */}
      <button
        onClick={() => goTo((current + 1) % OFFERS.length)}
        style={arrowStyle("right")}
      >›</button>

      {/* Dots */}
      <div style={{
        display: "flex", justifyContent: "center",
        gap: "8px", padding: "12px 0",
        background: "#1e293b"
      }}>
        {OFFERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "50px",
              background: i === current ? "#facc15" : "rgba(255,255,255,0.3)",
              border: "none", cursor: "pointer",
              transition: "all 0.3s", padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}

function arrowStyle(side) {
  return {
    position: "absolute", top: "50%",
    [side]: "16px",
    transform: "translateY(-60%)",
    background: "rgba(0,0,0,0.35)",
    color: "white", border: "none",
    width: "40px", height: "40px",
    borderRadius: "50%", fontSize: "22px",
    cursor: "pointer", zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1
  };
}

// ── Main Products Component ──────────────────────────────────
function Products() {
  const [products, setProducts]                 = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery]           = useState("");
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState("");
  const [addingId, setAddingId]                 = useState(null);

  const location    = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category    = queryParams.get("category");

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    const handleSearch = (e) => setSearchQuery(e.detail);
    window.addEventListener("searchUpdated", handleSearch);
    return () => window.removeEventListener("searchUpdated", handleSearch);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      let result = products;
      if (searchQuery.trim()) {
        result = result.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (category) {
        result = result.filter(p =>
          p.category_name?.toLowerCase() === category.toLowerCase()
        );
      }
      setFilteredProducts(result);
    }
  }, [category, products, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (id) => {
    setAddingId(id);
    try {
      await addToCart({ product_id: id, quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      if (err.response?.status === 401) alert("Please login to add items to cart");
      else alert("Something went wrong.");
    } finally {
      setAddingId(null);
    }
  };

  const getCategoryTitle = () => {
    if (searchQuery.trim()) return `Search: "${searchQuery}"`;
    if (!category) return "All Products";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
      <div style={{ width: "48px", height: "48px", border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
      {error} <button onClick={loadProducts} style={{ color: "#3b82f6", marginLeft: "8px" }}>Retry</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>

      {/* ── Offer Banner ── */}
      <OfferBanner />

      {/* ── Products Section ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Title */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "20px"
        }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1f2937", margin: 0 }}>
              {getCategoryTitle()}
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px", marginBottom: 0 }}>
              {filteredProducts.length} products found
            </p>
          </div>
          {/* Category Pills */}
          {!searchQuery && (
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "All",       cat: null,        icon: "🛒" },
                { label: "Fish",      cat: "fish",      icon: "🐟" },
                { label: "Chicken",   cat: "chicken",   icon: "🍗" },
                { label: "Vegetable", cat: "vegetable", icon: "🥦" },
              ].map(c => (
                <a key={c.label} href={c.cat ? `/?category=${c.cat}` : "/"} style={{
                  padding: "6px 14px", borderRadius: "50px", fontSize: "13px",
                  fontWeight: "600", textDecoration: "none",
                  background: category === c.cat || (!category && !c.cat) ? "#2563eb" : "white",
                  color: category === c.cat || (!category && !c.cat) ? "white" : "#64748b",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}>
                  {c.icon} {c.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🐟</div>
            <h3 style={{ fontSize: "20px", color: "#6b7280" }}>No products found</h3>
            <p style={{ color: "#9ca3af", marginTop: "8px" }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px"
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white", borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "1px solid #f1f5f9",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden", background: "#f9fafb" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                      transition: "transform 0.3s"
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  <span style={{
                    position: "absolute", top: "10px", left: "10px",
                    background: "#2563eb", color: "white",
                    fontSize: "10px", fontWeight: "700",
                    padding: "3px 10px", borderRadius: "50px",
                    textTransform: "capitalize"
                  }}>
                    {product.category_name}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "14px" }}>
                  <h3 style={{
                    fontSize: "14px", fontWeight: "700", color: "#1f2937",
                    margin: "0 0 4px", textTransform: "capitalize",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: "12px", color: "#9ca3af", margin: "0 0 10px",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4"
                  }}>
                    {product.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontSize: "20px", fontWeight: "800", color: "#f97316" }}>
                        ₹{product.price}
                      </span>
                      <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>
                        /kg
                      </span>
                    </div>
                    {product.member_price && (
                      <span style={{
                        fontSize: "11px", color: "#8b5cf6",
                        background: "#f5f3ff", padding: "2px 8px",
                        borderRadius: "50px", fontWeight: "600"
                      }}>
                        👑 ₹{product.member_price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingId === product.id}
                    style={{
                      width: "100%", padding: "9px", borderRadius: "10px",
                      border: "none", fontSize: "13px", fontWeight: "600",
                      cursor: addingId === product.id ? "not-allowed" : "pointer",
                      background: addingId === product.id ? "#e5e7eb" : "#2563eb",
                      color: addingId === product.id ? "#9ca3af" : "white",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { if (addingId !== product.id) e.currentTarget.style.background = "#1d4ed8"; }}
                    onMouseLeave={e => { if (addingId !== product.id) e.currentTarget.style.background = "#2563eb"; }}
                  >
                    {addingId === product.id ? "Adding..." : "🛒 Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 1024px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
=======
import { useLocation, useNavigate } from "react-router-dom";
import { getProducts, addToCart } from "../services/api";

function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");

  // Categories definition - FIXED ✅
  const categories = [
    { id: 1, name: "All Products", apiQuery: "all", icon: "🛒" },
    { id: 2, name: "Grocery", apiQuery: "Grocery", icon: "🥬" },
    { id: 3, name: "Fish", apiQuery: "Fish", icon: "🐠" },
    { id: 4, name: "Fresh Meat", apiQuery: "Fresh Meat", icon: "🥩" }
  ];

  useEffect(() => {
    setLoading(true);
    
    const categoryParam = selectedCategory === "all" ? null : selectedCategory;

    getProducts(categoryParam)
      .then(res => {
        console.log("Products fetched:", res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      });

  }, [selectedCategory]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat.apiQuery);
    navigate(`/?category=${cat.apiQuery}`);
  };

  const handleAddToCart = (id) => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first! 🔐");
      navigate("/login");
      return;
    }

    addToCart({ product_id: id, quantity: 1 })
      .then(() => {
        alert("Added to cart 🛒");
        window.dispatchEvent(new Event('storage'));
      })
      .catch(err => {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart. Please try again.");
      });
  };

  // Helper function to get fallback image based on category ✅
  const getFallbackImage = (categoryName) => {
    const lowerCategory = categoryName?.toLowerCase() || '';
    
    if (lowerCategory.includes('grocery')) {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop';
    } else if (lowerCategory.includes('fish')) {
      return 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=300&h=200&fit=crop';
    } else if (lowerCategory.includes('meat')) {
      return 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=200&fit=crop';
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            animation: "spin 1s linear infinite",
            borderRadius: "50%",
            height: "48px",
            width: "48px",
            border: "4px solid #f3f4f6",
            borderTop: "4px solid #2563eb"
          }} />
          <p style={{ marginTop: 16, color: "#6b7280", fontSize: 18 }}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh"
      }}>
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
          padding: "24px 32px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Category Filter Bar */}
      <div style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        padding: "20px 0",
        marginBottom: "20px",
        borderBottom: "2px solid #f3f4f6"
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "2px solid",
              borderColor: selectedCategory === cat.apiQuery ? "#2563eb" : "#e5e7eb",
              background: selectedCategory === cat.apiQuery ? "#2563eb" : "white",
              color: selectedCategory === cat.apiQuery ? "white" : "#4b5563",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat.apiQuery) {
                e.target.style.borderColor = "#2563eb";
                e.target.style.color = "#2563eb";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat.apiQuery) {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.color = "#4b5563";
              }
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <h2 style={{
        fontSize: 36,
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 16,
        color: "#1f2937"
      }}>
        🐠 FishMart Products
      </h2>

      {selectedCategory !== "all" && (
        <p style={{
          textAlign: "center",
          marginBottom: 24,
          color: "#6b7280",
          fontSize: 16
        }}>
          Showing results for <b>{categories.find(c => c.apiQuery === selectedCategory)?.name}</b>
        </p>
      )}

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "#6b7280", fontSize: 20 }}>
            No products available in this category.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
          marginTop: "24px"
        }}>
          {products.map(p => (
            <div key={p.id} style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "all 0.3s",
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{
                width: "100%",
                height: "200px",
                overflow: "hidden",
                background: "#f9fafb"
              }}>
                <img
                  src={
                    p.image 
                      ? `http://127.0.0.1:8000${p.image}` 
                      : getFallbackImage(selectedCategory)
                  }
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.src = getFallbackImage(selectedCategory);
                  }}
                />
              </div>

              <div style={{ padding: "16px" }}>
                <h5 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "8px",
                  height: "40px",
                  overflow: "hidden"
                }}>
                  {p.name}
                </h5>

                <p style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#2563eb",
                  marginBottom: "12px"
                }}>
                  ₹ {p.price}
                </p>

                <button
                  onClick={() => handleAddToCart(p.id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1d4ed8";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#2563eb";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    </div>
  );
}

export default Products;