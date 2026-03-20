<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { createOrder, getCart, getWalletBalance, getDeliverySettings } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [loading,         setLoading]         = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone,           setPhone]           = useState("");
  const [phoneError,      setPhoneError]      = useState("");
  const [paymentMethod,   setPaymentMethod]   = useState("cod");
  const [instructions,    setInstructions]    = useState("");
  const [orderSuccess,    setOrderSuccess]    = useState(null);
  const [walletBalance,   setWalletBalance]   = useState(0);
  const [cartItems,       setCartItems]       = useState([]);
  const [subtotal,        setSubtotal]        = useState(0);
  const [deliveryCharge,  setDeliveryCharge]  = useState(40);
  const [freeAbove,       setFreeAbove]       = useState(500);
  const addressRef = useRef(null);

  const isMember     = localStorage.getItem("isMember") === "true";
  const actualCharge = isMember || subtotal >= freeAbove ? 0 : deliveryCharge;
  const total        = subtotal + actualCharge;

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { alert("Please login to continue"); navigate("/login"); return; }

    // Wallet balance
    getWalletBalance()
      .then(res => setWalletBalance(parseFloat(res.data.balance)))
      .catch(() => {});

    // Cart items
    getCart().then(res => {
      setCartItems(res.data.items || []);
      const sub = (res.data.items || []).reduce(
        (s, item) => s + item.quantity * parseFloat(item.product.price), 0
      );
      setSubtotal(sub);
    }).catch(() => {});

    // Delivery settings
    getDeliverySettings().then(res => {
      setDeliveryCharge(res.data.delivery_charge);
      setFreeAbove(res.data.free_delivery_above);
    }).catch(() => {});
  }, [navigate]);

  useEffect(() => {
    if (window.google && addressRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressRef.current, { componentRestrictions: { country: "in" } }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setDeliveryAddress(place.formatted_address);
      });
    }
  }, []);

  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) setPhone(val);
    if (val.length === 10) setPhoneError("");
    else setPhoneError("Phone number must be 10 digits");
  };

  const placeOrder = () => {
    if (!deliveryAddress.trim()) { alert("Please enter delivery address"); return; }
    if (phone.length !== 10)     { alert("Please enter a valid 10 digit phone number"); return; }

    const orderData = {
      address:        deliveryAddress,
      phone,
      payment_method: paymentMethod,
      instructions,
    };

    // ── WALLET ────────────────────────────────────────────────
    if (paymentMethod === "wallet") {
      if (walletBalance < total) {
        alert(`Insufficient wallet balance. Your balance: ₹${walletBalance.toFixed(2)}`);
        return;
      }
      setLoading(true);
      createOrder(orderData)
        .then(res => {
          setLoading(false);
          window.dispatchEvent(new Event("cartUpdated"));
          setOrderSuccess(res.data);
        })
        .catch(err => {
          setLoading(false);
          alert(err.response?.data?.error || "Something went wrong");
        });
      return;
    }

    // ── ONLINE (Razorpay) ─────────────────────────────────────
    if (paymentMethod === "online") {
      setLoading(true);
      const options = {
        key:         "rzp_test_e664V0FP0zQy7N",
        amount:      Math.round(total * 100),  // ← delivery charge included
        currency:    "INR",
        name:        "NammaFreshMart",
        description: "Order Payment",
        handler: function (response) {
          createOrder({
            ...orderData,
            razorpay_payment_id: response.razorpay_payment_id
          })
            .then(res => {
              setLoading(false);
              window.dispatchEvent(new Event("cartUpdated"));
              setOrderSuccess(res.data);
            })
            .catch(() => {
              setLoading(false);
              alert("Order creation failed. Contact support.");
            });
        },
        prefill: { contact: phone },
        theme:   { color: "#ff6f00" }
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { setLoading(false); alert("Payment failed. Try again."); });
      rzp.open();
      setLoading(false);
      return;
    }

    // ── COD ───────────────────────────────────────────────────
    setLoading(true);
    createOrder(orderData)
      .then(res => {
        setLoading(false);
        window.dispatchEvent(new Event("cartUpdated"));
        setOrderSuccess(res.data);
      })
      .catch(err => {
        setLoading(false);
        if (err.response?.status === 401) { alert("Session expired."); navigate("/login"); }
        else alert("Something went wrong");
      });
  };

  // ── Order Success Page ─────────────────────────────────────
  if (orderSuccess) {
    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "12px" }}>✅</div>
          <h2 style={{ color: "#28a745", marginBottom: "6px" }}>Order Placed Successfully!</h2>
          <p style={{ color: "#888", marginBottom: "24px" }}>Your order has been confirmed</p>

          <div style={{ background: "#f0fff4", border: "1px solid #b7ebc8", borderRadius: "10px", padding: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#2c3e50" }}>
              Order ID: #{orderSuccess.order_id}
            </span>
          </div>

          {/* Items */}
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px", color: "#2c3e50" }}>🛒 Items Ordered</h4>
            {orderSuccess.items?.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: "15px" }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: "600" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
              <span style={{ color: "#6b7280" }}>Subtotal</span>
              <span>₹{orderSuccess.subtotal?.toFixed(2) || orderSuccess.total_amount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
              <span style={{ color: "#6b7280" }}>Delivery Charge</span>
              {parseFloat(orderSuccess.delivery_charge || 0) === 0 ? (               <span style={{ color: "#16a34a", fontWeight: "600" }}>
                  FREE {orderSuccess.free_delivery ? "🎉" : ""}
                </span>
              ) : (
                <span style={{ color: "#ef4444" }}>₹{orderSuccess.delivery_charge}</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: "10px", fontSize: "16px", fontWeight: "800" }}>
              <span>Total</span>
              <span style={{ color: "#f97316" }}>₹{parseFloat(orderSuccess.total_amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px", textAlign: "left" }}>
            <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>💳 Payment</div>
              <div style={{ fontWeight: "600", color: "#2c3e50", fontSize: "13px" }}>
                {orderSuccess.payment_method === "cod"    ? "Cash on Delivery" :
                 orderSuccess.payment_method === "wallet" ? "Wallet Payment"   : "Online Payment"}
              </div>
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>⏱️ Estimated Delivery</div>
              <div style={{ fontWeight: "600", color: "#28a745", fontSize: "13px" }}>{orderSuccess.estimated_delivery}</div>
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>📍 Address</div>
              <div style={{ fontWeight: "600", color: "#2c3e50", fontSize: "12px" }}>{orderSuccess.delivery_address}</div>
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>📞 Phone</div>
              <div style={{ fontWeight: "600", color: "#2c3e50", fontSize: "13px" }}>{orderSuccess.phone || phone}</div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => navigate(`/orders/${orderSuccess.order_id}/track`)}
              style={{ padding: "14px", background: "#ff6f00", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              📍 Track My Order
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              style={{ padding: "14px", background: "#f8f9fa", color: "#2c3e50", border: "1px solid #dee2e6", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              🧾 View All Orders
            </button>
            <button
              onClick={() => navigate("/")}
              style={{ padding: "14px", background: "#28a745", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ──────────────────────────────────────────
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2 className="checkout-title">Checkout</h2>
        <p className="delivery-time">Delivery in 20–30 minutes 🚚</p>
      </div>

      <div className="checkout-content">

        {/* ── Left: Delivery Details ── */}
        <div className="delivery-details">

          <h3 className="section-title"><span className="section-icon">📍</span>Delivery Address</h3>
          <input
            ref={addressRef} type="text" className="address-input"
            placeholder="Enter your full delivery address"
            value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
            autoComplete="street-address" required
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e9ecef", fontSize: "15px", fontFamily: "inherit", boxSizing: "border-box" }}
          />

          <h3 className="section-title" style={{ marginTop: "20px" }}>
            <span className="section-icon">📞</span>Phone Number
          </h3>
          <input
            type="tel" placeholder="10 digit mobile number"
            value={phone} onChange={handlePhone} maxLength={10}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: `2px solid ${phoneError ? "#dc3545" : phone.length === 10 ? "#28a745" : "#e9ecef"}`, fontSize: "15px", fontFamily: "inherit", boxSizing: "border-box" }}
          />
          {phoneError && <p style={{ color: "#dc3545", fontSize: "13px", marginTop: "4px" }}>{phoneError}</p>}
          {phone.length === 10 && !phoneError && <p style={{ color: "#28a745", fontSize: "13px", marginTop: "4px" }}>✓ Valid phone number</p>}

          <h3 className="section-title" style={{ marginTop: "20px" }}>
            <span className="section-icon">📝</span>Special Instructions (Optional)
          </h3>
          <textarea
            className="instructions-input"
            placeholder="Any special instructions?"
            value={instructions} onChange={(e) => setInstructions(e.target.value)} rows="2"
          />

          {/* ── Order Summary ── */}
          <div style={{ marginTop: "20px", background: "#f8fafc", borderRadius: "14px", padding: "18px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1f2937", marginBottom: "14px" }}>
              🧾 Order Summary
            </h3>

            {/* Cart Items */}
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px", color: "#374151" }}>
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.quantity * parseFloat(item.product.price)).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ borderTop: "1px dashed #e5e7eb", margin: "12px 0" }} />

            {/* Subtotal */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280" }}>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Delivery Charge */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280" }}>Delivery Charge</span>
              {actualCharge === 0 ? (
                <span style={{ color: "#16a34a", fontWeight: "700" }}>
                  FREE {isMember ? "👑 Member" : `🎉 Above ₹${freeAbove}`}
                </span>
              ) : (
                <span style={{ color: "#ef4444", fontWeight: "600" }}>₹{actualCharge}</span>
              )}
            </div>

            {/* Free Delivery Progress */}
            {!isMember && actualCharge > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <p style={{ fontSize: "12px", color: "#f97316", marginBottom: "6px" }}>
                  ₹{(freeAbove - subtotal).toFixed(0)} aur add karo FREE delivery ke liye!
                </p>
                <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "50px" }}>
                  <div style={{
                    height: "100%", borderRadius: "50px",
                    background: "linear-gradient(90deg, #ff6f00, #ff9f43)",
                    width: `${Math.min((subtotal / freeAbove) * 100, 100)}%`,
                    transition: "width 0.3s"
                  }} />
                </div>
              </div>
            )}

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: "12px", fontSize: "17px", fontWeight: "800" }}>
              <span>Total</span>
              <span style={{ color: "#f97316" }}>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── Right: Payment ── */}
        <div className="order-summary">
          <h3 className="section-title"><span className="section-icon">💳</span>Payment Method</h3>

          <div className="payment-options">
            <label className="payment-option">
              <input type="radio" name="payment" value="cod"
                checked={paymentMethod === "cod"} onChange={e => setPaymentMethod(e.target.value)} />
              <span className="payment-option-label">
                <span className="payment-icon">💵</span>Cash on Delivery
              </span>
            </label>

            <label className="payment-option">
              <input type="radio" name="payment" value="online"
                checked={paymentMethod === "online"} onChange={e => setPaymentMethod(e.target.value)} />
              <span className="payment-option-label">
                <span className="payment-icon">💳</span>Online Payment (Razorpay)
              </span>
            </label>

            <label className="payment-option">
              <input type="radio" name="payment" value="wallet"
                checked={paymentMethod === "wallet"} onChange={e => setPaymentMethod(e.target.value)} />
              <span className="payment-option-label">
                <span className="payment-icon">👛</span>Pay from Wallet
                <span style={{ fontSize: "13px", marginLeft: "8px", color: walletBalance > 0 ? "#28a745" : "#dc3545", fontWeight: "700" }}>
                  (₹{walletBalance.toFixed(2)})
                </span>
              </span>
            </label>

            <label className="payment-option">
              <input type="radio" name="payment" value="upi" disabled />
              <span className="payment-option-label disabled">
                <span className="payment-icon">📱</span>UPI (Coming Soon)
              </span>
            </label>
          </div>

          {/* Tips */}
          <div className="order-tips">
            <h4>📋 Order Tips:</h4>
            <ul>
              <li>✓ Minimum order value: ₹100</li>
              <li>✓ Free delivery on orders above ₹{freeAbove}</li>
              <li>✓ Members always get free delivery 👑</li>
              <li>✓ Delivery charge: ₹{deliveryCharge}</li>
              <li>✓ Same day delivery in 20–30 mins</li>
            </ul>
          </div>

          {/* Place Order Button */}
          <button
            className={`place-order-btn ${loading ? "loading" : ""}`}
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner"></span>Placing Order...</>
            ) : (
              `Place Order ✅ — ₹${total.toFixed(2)}`
            )}
          </button>

          <p className="terms-text">
            By placing this order, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
=======
import { useEffect } from "react";
import { createOrder } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Checkout() {
  const navigate = useNavigate();

  // 🔐 Protect checkout route
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
    }
  }, []);

  const placeOrder = async () => {
  const { fullName, phone, pincode, city, state, house, area } = address;

  if (!fullName || !phone || !pincode || !city || !state || !house || !area) {
    alert("Please fill all address fields");
    return;
  }

  try {
    await createOrder({ address });
    alert("Order placed successfully ✅");
    navigate("/");
  } catch (err) {
    if (err.response?.status === 401) {
      alert("Session expired. Please login again.");
      navigate("/login");
    } else {
      alert("Something went wrong while placing order");
    }
  }
};


const [address, setAddress] = useState({
  fullName: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  house: "",
  area: ""
});



  // Complete CSS styles object
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "30px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    card: {
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto"
    },
    mainCard: {
      backgroundColor: "white",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
      padding: "40px",
      position: "relative",
      overflow: "hidden"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    boxIcon: {
      fontSize: "80px",
      marginBottom: "20px",
      display: "block",
      animation: "pulse 2s infinite"
    },
    title: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "10px",
      textShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    deliveryInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      color: "#38a169",
      fontWeight: "600",
      fontSize: "18px"
    },
    truckIcon: {
      fontSize: "24px",
      animation: "bounce 1s infinite"
    },
    divider: {
      height: "2px",
      background: "linear-gradient(to right, transparent, #e2e8f0, transparent)",
      margin: "30px 0",
      position: "relative"
    },
    dividerIcon: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "0 15px",
      fontSize: "20px"
    },
    summaryCard: {
      background: "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
      borderRadius: "15px",
      padding: "25px",
      marginBottom: "30px",
      border: "1px solid rgba(147, 51, 234, 0.1)"
    },
    summaryTitle: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    checkIcon: {
      fontSize: "24px",
      color: "#38a169",
      animation: "pulse 2s infinite"
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid rgba(0,0,0,0.05)"
    },
    summaryLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#4a5568",
      fontSize: "16px"
    },
    summaryValue: {
      fontWeight: "600",
      fontSize: "16px"
    },
    fastDelivery: {
      color: "#38a169",
      backgroundColor: "rgba(56, 161, 105, 0.1)",
      padding: "5px 15px",
      borderRadius: "20px"
    },
    paymentMethod: {
      color: "#2d3748",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      padding: "5px 15px",
      borderRadius: "20px"
    },
    estimatedTime: {
      color: "#805ad5",
      backgroundColor: "rgba(128, 90, 213, 0.1)",
      padding: "5px 15px",
      borderRadius: "20px"
    },
    placeOrderBtn: {
      width: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "18px",
      fontSize: "18px",
      fontWeight: "700",
      borderRadius: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "10px"
    },
    backBtn: {
      width: "100%",
      backgroundColor: "#f7fafc",
      color: "#4a5568",
      border: "1px solid #e2e8f0",
      padding: "15px",
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    fullInput: {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  marginBottom: "10px",
  fontSize: "14px"
},

    footerText: {
      textAlign: "center",
      color: "#718096",
      fontSize: "14px",
      marginTop: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    securityBadges: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: "20px",
      flexWrap: "wrap"
    },
    badge: {
      backgroundColor: "#f7fafc",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      color: "#718096",
      border: "1px solid #e2e8f0"
    }
  };

  // Hover effects
  const placeOrderHover = {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)"
  };

  const backBtnHover = {
    backgroundColor: "#edf2f7",
    transform: "translateY(-3px)"
  };

  

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.card}>
          <div 
            style={styles.mainCard}
            className="hover-lift"
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.boxIcon}>📦</div>
              <h2 style={styles.title}>Checkout</h2>
              <div style={styles.deliveryInfo}>
                <span style={styles.truckIcon}>🚚</span>
                <span>Delivery in 30–45 minutes</span>
              </div>
            </div>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerIcon}>🛒</span>
            </div>

            {/* Order Summary */}
            <div 
              style={styles.summaryCard}
              className="hover-lift"
            >
              <h3 style={styles.summaryTitle}>
                <span style={styles.checkIcon}>✅</span>
                Order Summary
              </h3>

              <div style={{ marginBottom: "25px", marginTop: "10px" }}>
  <h3 style={{ marginBottom: "10px" }}>🏠 Delivery Address</h3>

  <input
    placeholder="Full Name"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
  />

  <input
    placeholder="Mobile Number"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
  />

  <input
    placeholder="Pincode"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
  />

  <input
    placeholder="City"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, city: e.target.value })}
  />

  <input
    placeholder="State"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, state: e.target.value })}
  />

  <input
    placeholder="House No., Building Name"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, house: e.target.value })}
  />

  <input
    placeholder="Road Name, Area, Colony"
    style={styles.fullInput}
    onChange={(e) => setAddress({ ...address, area: e.target.value })}
  />
</div>

              
              <div style={{ marginTop: "15px" }}>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>
                    <span>✅</span>
                    <span>Delivery Status:</span>
                  </div>
                  <div style={{...styles.summaryValue, ...styles.fastDelivery}}>
                    Fast Delivery
                  </div>
                </div>
                
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>
                    <span>💰</span>
                    <span>Payment Method:</span>
                  </div>
                  <div style={{...styles.summaryValue, ...styles.paymentMethod}}>
                    Cash on Delivery
                  </div>
                </div>
                
                <div style={{...styles.summaryItem, borderBottom: "none"}}>
                  <div style={styles.summaryLabel}>
                    <span>⏱️</span>
                    <span>Estimated Time:</span>
                  </div>
                  <div style={{...styles.summaryValue, ...styles.estimatedTime}}>
                    30-45 minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              style={styles.placeOrderBtn}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, placeOrderHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.placeOrderBtn.boxShadow;
              }}
            >
              <span>🛍️</span>
              <span>Place Order</span>
            </button>

            {/* Back Button */}
            <button
              onClick={() => navigate("/cart")}
              style={styles.backBtn}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, backBtnHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = styles.backBtn.backgroundColor;
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>←</span>
              <span>Back to Cart</span>
            </button>

            {/* Footer Text */}
            <p style={styles.footerText}>
              <span>🔒</span>
              By placing your order, you agree to our terms & conditions
            </p>

            {/* Security Badges */}
            <div style={styles.securityBadges}>
              <div style={styles.badge}>🔐 Secure Checkout</div>
              <div style={styles.badge}>💳 No Card Required</div>
              <div style={styles.badge}>⭐ 100% Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
  );
}

export default Checkout;