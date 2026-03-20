<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminDashboard    from "./pages/admin/AdminDashboard";
import AdminVendors      from "./pages/admin/AdminVendors";
import AdminOrders       from "./pages/admin/AdminOrders";
import AdminDelivery     from "./pages/admin/AdminDelivery";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryOrders    from "./pages/delivery/DeliveryOrders";
import DeliveryRegister  from "./pages/delivery/DeliveryRegister";
import TrackOrder        from "./pages/TrackOrder";
import Products          from "./pages/Products";
import Cart              from "./pages/Cart";
import Checkout          from "./pages/Checkout";
import Login             from "./pages/Login";
import Signup            from "./pages/Signup";
import VerifyOtp         from "./pages/VerifyOtp";
import MyWallet          from "./pages/MyWallet";
import MyOrders          from "./pages/MyOrders";
import VendorRegister    from "./pages/vendor/VendorRegister";
import VendorLogin       from "./pages/vendor/VendorLogin";
import VendorDashboard   from "./pages/vendor/VendorDashboard";
import VendorProducts    from "./pages/vendor/VendorProducts";
import VendorOrders      from "./pages/vendor/VendorOrders";
import VendorEarnings    from "./pages/vendor/VendorEarnings";

import {
  getCart,
  createMembershipOrder,
  verifyMembershipPayment
} from "./services/api";

import "./App.css";

function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const isLoggedIn = !!localStorage.getItem("access");
  const role       = localStorage.getItem("role");

  const [cartCount,           setCartCount]           = useState(0);
  const [searchQuery,         setSearchQuery]         = useState("");
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [membershipPlan,      setMembershipPlan]      = useState("monthly");
  const [membershipData,      setMembershipData]      = useState({ name: "", email: "", phone: "" });
  const [membershipLoading,   setMembershipLoading]   = useState(false);
  const [membershipError,     setMembershipError]     = useState("");
  const [membershipSuccess,   setMembershipSuccess]   = useState(false);
  

  // ✅ useEffect SABSE PEHLE — kisi bhi return se upar
  useEffect(() => {
    if (isLoggedIn) loadCartCount();
    const updateCart = () => loadCartCount();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, [isLoggedIn]);

  const loadCartCount = async () => {
    try {
      const res   = await getCart();
      const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      console.log("Error loading cart count");
    }
  };
=======
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Layout from "./Layout";
import Address from "./pages/Address";



function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("access"));
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // Fetch cart items count
  useEffect(() => {
    if (isLoggedIn) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItemsCount(cart.length);
    }
  }, [isLoggedIn]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
<<<<<<< HEAD
    localStorage.removeItem("role");
    setCartCount(0);
    navigate("/login");
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    window.dispatchEvent(new CustomEvent("searchUpdated", { detail: val }));
  };

  const handleMembershipClick = (plan) => {
    if (!isLoggedIn) { alert("Please login to become a member"); navigate("/login"); return; }
    setMembershipPlan(plan);
    setShowMembershipModal(true);
  };

  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    setMembershipLoading(true);
    try {
      const res = await createMembershipOrder({ ...membershipData, plan: membershipPlan });
      const options = {
        key:         "rzp_test_e664V0FP0zQy7N",
        order_id:    res.data.order_id,
        amount:      res.data.amount * 100,
        currency:    "INR",
        name:        "NammaFreshMart",
        description: "Membership Payment",
        handler: async function (response) {
          await verifyMembershipPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
            plan:   membershipPlan,
            amount: res.data.amount
          });
          setMembershipSuccess(true);
          localStorage.setItem("isMember", "true");
          setTimeout(() => { setShowMembershipModal(false); navigate("/"); }, 1500);
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setMembershipError("Payment failed");
    } finally {
      setMembershipLoading(false);
    }
  };

  const handleMembershipChange = (e) =>
    setMembershipData({ ...membershipData, [e.target.name]: e.target.value });

  // ✅ Early return SABSE LAST mein — saare hooks ke baad
  const path           = location.pathname;
  const isVendorPage   = path.startsWith("/vendor");
  const isAdminPage    = path.startsWith("/admin");
  const isDeliveryPage = path.startsWith("/delivery");
  if (isVendorPage || isAdminPage || isDeliveryPage) return null;

  const isCustomer = !role || role === "customer";

  return (
    <>
      <nav>

        {/* ── Logo ── */}
        <span
          onClick={() => navigate("/")}
          style={{
            fontWeight: "800",
            fontSize: "1.1rem",
            background: "linear-gradient(90deg, #ff6f00, #ff9f43)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            cursor: "pointer",
            whiteSpace: "nowrap",
            letterSpacing: "-0.5px",
            flexShrink: 0
          }}
        >
          🐟 NammaFreshMart
        </span>

        {/* ── Products Dropdown ── */}
        <div className="products-menu">
          <button className="products-link">Products</button>
          <div className="products-dropdown">
            <button onClick={() => navigate("/?category=fish")}>🐟 Fish</button>
            <button onClick={() => navigate("/?category=chicken")}>🍗 Chicken</button>
            <button onClick={() => navigate("/?category=vegetable")}>🥦 Vegetable</button>
          </div>
        </div>

        {/* ── Membership — sirf customer ko ── */}
        {isCustomer && (
          <div className="membership-menu">
            <button className="membership-link">Membership</button>
            <div className="membership-dropdown">
              <button onClick={() => handleMembershipClick("monthly")}>Monthly ₹100</button>
              <button onClick={() => handleMembershipClick("yearly")}>Yearly ₹600</button>
            </div>
          </div>
        )}

        {/* ── Search Bar ── */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: "10px", fontSize: "13px" }}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              padding: "6px 30px 6px 28px",
              borderRadius: "50px",
              border: "1.5px solid #334155",
              background: "#1e293b",
              color: "white",
              fontSize: "0.78rem",
              width: "190px",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                window.dispatchEvent(new CustomEvent("searchUpdated", { detail: "" }));
              }}
              style={{
                position: "absolute", right: "8px",
                background: "none", border: "none",
                cursor: "pointer", color: "#64748b", fontSize: "12px"
              }}
            >✕</button>
          )}
        </div>

        {/* ── Customer Links ── */}
        {isLoggedIn && isCustomer && <Link to="/my-orders">My Orders</Link>}
        {isLoggedIn && isCustomer && <Link to="/my-wallet">My Wallet</Link>}
        {isLoggedIn && isCustomer && (
          <Link to="/cart" style={{ position: "relative" }}>
            Cart
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        )}

        {/* ── Vendor Panel Button ── */}
        {isLoggedIn && role === "vendor" && (
          <button className="vendor-panel-btn" onClick={() => navigate("/vendor/dashboard")}>
            🏪 Vendor Panel
          </button>
        )}

        {/* ── Admin Panel Button ── */}
        {isLoggedIn && role === "admin" && (
          <button className="admin-panel-btn" onClick={() => navigate("/admin/dashboard")}>
            ⚙️ Admin Panel
          </button>
        )}

        {/* ── Delivery Panel Button ── */}
        {isLoggedIn && role === "delivery" && (
          <button className="delivery-panel-btn" onClick={() => navigate("/delivery/dashboard")}>
            🛵 Delivery Panel
          </button>
        )}

        {/* ── Auth Buttons ── */}
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/vendor/register">🏪 Sell on NammaFreshMart</Link>
            <Link to="/delivery/register">🛵 Delivery Join karo</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}

      </nav>

      {/* ── Membership Modal ── */}
      {showMembershipModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowMembershipModal(false)}>×</button>
            <h2>Become a Member</h2>
            {membershipSuccess ? (
              <div className="success-message">✅ Membership Activated!</div>
            ) : (
              <form onSubmit={handleMembershipSubmit}>
                <input type="text"  name="name"  placeholder="Name"  value={membershipData.name}  onChange={handleMembershipChange} required />
                <input type="email" name="email" placeholder="Email" value={membershipData.email} onChange={handleMembershipChange} required />
                <input type="tel"   name="phone" placeholder="Phone" value={membershipData.phone} onChange={handleMembershipChange} required />
                {membershipError && <p className="error">{membershipError}</p>}
                <button type="submit" disabled={membershipLoading}>
                  {membershipLoading ? "Processing..." : "Proceed to Pay"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
=======
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={{ 
      background: isScrolled 
        ? 'rgba(102, 126, 234, 0.95)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled 
        ? '0 6px 30px rgba(0, 0, 0, 0.15)' 
        : '0 4px 20px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        margin: '0',
        padding: '0 24px',
        height: '70px',
        boxSizing: 'border-box'
      }}>
        {/* Left Side - Logo with enhanced hover */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '14px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15) rotate(8deg)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #e6e9ff 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
              }}
            >
              <span style={{ 
                fontSize: '28px',
                transition: 'transform 0.4s ease',
                display: 'inline-block'
              }}>🛒</span>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                opacity: 0,
                transition: 'opacity 0.4s ease'
              }}></div>
            </div>
            <span style={{ 
              color: 'white',
              fontSize: '28px',
              fontWeight: '900',
              letterSpacing: '-1px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #ffffff 30%, #e6e9ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 4px 20px rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 2px 10px rgba(0,0,0,0.3)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              FishMart
            </span>
          </Link>
        </div>

        {/* Right Side - Enhanced Search, Cart, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Enhanced Search Bar */}
          <div style={{ 
            position: 'relative', 
            width: '400px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <input
              type="text"
              placeholder="Search for groceries, fish, meat..."
              style={{
                width: '100%',
                padding: '14px 24px 14px 52px',
                borderRadius: '30px',
                border: '2px solid transparent',
                fontSize: '15px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.98)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.background = 'white';
                e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.25)';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.width = '420px';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.98)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
                e.target.style.width = '400px';
              }}
            />
            <span style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px',
              color: '#667eea',
              transition: 'all 0.3s ease',
              pointerEvents: 'none'
            }}>🔍</span>
            <div style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#999',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              ⌘K
            </div>
          </div>

          {/* Enhanced Cart Button */}
          <Link to="/cart" style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(15px)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            padding: '12px 24px',
            borderRadius: '30px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '15px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            minWidth: '120px',
            justifyContent: 'center'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <span style={{ 
              fontSize: '22px',
              transition: 'transform 0.3s ease'
            }}>🛒</span>
            <span style={{
              position: 'relative',
              paddingRight: cartItemsCount > 0 ? '20px' : '0'
            }}>
              Cart
              {cartItemsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  right: '0',
                  top: '-4px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  minWidth: '24px',
                  height: '24px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                  padding: '0 6px',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(8px)'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px) scale(1.2)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                  }}
                >
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </span>
          </Link>

          {/* Enhanced User Actions */}
          {!isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '12px 28px',
                borderRadius: '30px',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                fontSize: '15px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <span style={{
                  position: 'relative',
                  zIndex: 1
                }}>
                  Login
                </span>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '0',
                  height: '0',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.6s ease'
                }}></div>
              </Link>
              <Link to="/signup" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '12px 28px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
                fontSize: '15px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #e6e9ff 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)';
                }}
              >
                <span style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  position: 'relative',
                  zIndex: 1
                }}>
                  Signup
                </span>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease'
                }}></div>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(15px)',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <span style={{ 
                  fontSize: '20px',
                  transition: 'transform 0.3s ease'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >👤</span>
                <span>Account</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  color: '#ef4444',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.2)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  Logout
                </span>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease'
                }}></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
  );
}

function App() {
  return (
<<<<<<< HEAD
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>

          {/* ── Customer Routes ── */}
          <Route path="/"                      element={<Products />} />
          <Route path="/cart"                  element={<Cart />} />
          <Route path="/checkout"              element={<Checkout />} />
          <Route path="/login"                 element={<Login />} />
          <Route path="/signup"                element={<Signup />} />
          <Route path="/verify-otp"            element={<VerifyOtp />} />
          <Route path="/my-wallet"             element={<MyWallet />} />
          <Route path="/my-orders"             element={<MyOrders />} />
          <Route path="/orders/:orderId/track" element={<TrackOrder />} />

          {/* ── Vendor Routes ── */}
          <Route path="/vendor/register"  element={<VendorRegister />} />
          <Route path="/vendor/login"     element={<VendorLogin />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/products"  element={<VendorProducts />} />
          <Route path="/vendor/orders"    element={<VendorOrders />} />
          <Route path="/vendor/earnings"  element={<VendorEarnings />} />

          {/* ── Delivery Routes ── */}
          <Route path="/delivery/register"  element={<DeliveryRegister />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/orders"    element={<DeliveryOrders />} />

          {/* ── Admin Routes ── */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vendors"   element={<AdminVendors />} />
          <Route path="/admin/orders"    element={<AdminOrders />} />
          <Route path="/admin/delivery"  element={<AdminDelivery />} />

        </Routes>
      </main>
    </BrowserRouter>
=======

<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Route>
      <Route path="/address" element={<Address />} />

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
  </Routes>
</BrowserRouter>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
  );
}

export default App;