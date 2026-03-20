import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import "./Cart.css"; // Import CSS
=======
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

import {
  getCart,
  updateCartItem,
  removeCartItem
} from "../services/api";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    setLoading(true);
    getCart()
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
=======

  const loadCart = () => {
    getCart()
      .then(res => setCart(res.data))
      .catch(() => {
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
        navigate("/login");
      });
  };

  useEffect(() => {
    loadCart();
  }, []);

<<<<<<< HEAD
  if (loading) {
    return (
      <div className="loading-cart">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet</p>
        <button 
          className="shop-now-btn" 
          onClick={() => navigate("/")}
        >
          Start Shopping
        </button>
=======
  // Styling objects
  const styles = {
    container: {
      padding: "30px 20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column"
    },
    emptyCart: {
      padding: "40px 20px",
      textAlign: "center",
      color: "#666",
      fontSize: "18px",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      marginTop: "20px"
    },
    title: {
      color: "#333",
      marginBottom: "25px",
      paddingBottom: "15px",
      borderBottom: "2px solid #4CAF50",
      fontSize: "28px"
    },
    cartItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 15px",
      margin: "12px 0",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease"
    },
    productInfo: {
      flex: "1",
      minWidth: "200px"
    },
    productName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#2c3e50",
      marginBottom: "8px"
    },
    productPrice: {
      color: "#7f8c8d",
      fontSize: "16px",
      fontWeight: "500"
    },
    quantityControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "1"
    },
    quantityButton: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.3s"
    },
    quantityDisplay: {
      margin: "0 20px",
      fontSize: "18px",
      fontWeight: "600",
      minWidth: "30px",
      textAlign: "center"
    },
    itemTotal: {
      flex: "1",
      textAlign: "right",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    totalAmount: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#2c3e50"
    },
    removeButton: {
      marginLeft: "20px",
      color: "#e74c3c",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "20px",
      transition: "transform 0.2s",
      padding: "5px",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    cartItemsContainer: {
      flex: "1",
      marginBottom: "20px"
    },
    summaryContainer: {
      position: "sticky",
      bottom: "20px",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "25px",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
      marginTop: "auto", // Ye summary ko neeche se upar le aayega
      zIndex: 10
    },
    totalText: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "20px",
      textAlign: "center"
    },
    checkoutButtonContainer: {
      display: "flex",
      justifyContent: "center"
    },
    checkoutButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      padding: "18px 50px",
      fontSize: "18px",
      fontWeight: "600",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      maxWidth: "350px"
    },
    checkoutButtonContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    }
  };

  // Hover effects
  const cartItemHover = {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
  };

  const buttonHover = {
    backgroundColor: "#45a049",
    transform: "scale(1.02)"
  };

  const removeButtonHover = {
    backgroundColor: "#ffebee",
    transform: "scale(1.1)"
  };

  const quantityButtonHover = {
    backgroundColor: "#388E3C"
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Your Cart</h2>
        <div style={styles.emptyCart}>
          <h3>🛒 Your cart is empty</h3>
          <p style={{ marginTop: "10px", color: "#888" }}>
            Add some products to get started!
          </p>
        </div>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
      </div>
    );
  }

  let total = 0;

  const handleUpdate = (productId, action) => {
    updateCartItem({ product_id: productId, action })
<<<<<<< HEAD
      .then(() => {
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
  })
      .catch((error) => {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          alert("Failed to update cart. Please try again.");
        }
      });
  };

  const handleRemove = (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeCartItem({ product_id: productId })
        .then(() => {
         loadCart();
         window.dispatchEvent(new Event("cartUpdated"));
  })
        .catch((error) => {
          if (error.response?.status === 401) {
            navigate("/login");
          } else {
            alert("Failed to remove item. Please try again.");
          }
        });
    }
=======
      .then(() => loadCart());
  };

  const handleRemove = (productId) => {
    removeCartItem({ product_id: productId })
      .then(() => loadCart());
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login to proceed to checkout");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
<<<<<<< HEAD
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {cart.items.map(item => {
        total += item.quantity * item.product.price;

        return (
          <div
            key={item.id}
            className="cart-item"
          >
            {/* LEFT - Product Info */}
            <div className="item-info">
              <div className="item-name">{item.product.name}</div>
              <div className="item-price">₹ {item.product.price}</div>
            </div>

            {/* CENTER - Quantity Controls */}
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleUpdate(item.product.id, "decrease")}
                disabled={item.quantity <= 1}
              >−</button>

              <span className="quantity-display">
                {item.quantity}
              </span>

              <button 
                className="quantity-btn"
                onClick={() => handleUpdate(item.product.id, "increase")}
              >+</button>
            </div>

            {/* RIGHT - Total & Remove */}
            <div className="item-total">
              <span className="item-total-price">
                ₹ {item.quantity * item.product.price}
              </span>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.product.id)}
                title="Remove item"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}

      <div className="cart-summary">
        <h3 className="total-amount">
          Total Amount: <span>₹ {total}</span>
        </h3>
        <button 
          className="checkout-btn" 
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
=======
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>

      <div style={styles.cartItemsContainer}>
        {cart.items.map(item => {
          total += item.quantity * item.product.price;

          return (
            <div
              key={item.id}
              style={styles.cartItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = cartItemHover.transform;
                e.currentTarget.style.boxShadow = cartItemHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.cartItem.boxShadow;
              }}
            >
              {/* LEFT - Product Info */}
              <div style={styles.productInfo}>
                <div style={styles.productName}>{item.product.name}</div>
                <div style={styles.productPrice}>₹ {item.product.price.toLocaleString()}</div>
              </div>

              {/* CENTER - Quantity Controls */}
              <div style={styles.quantityControls}>
                <button 
                  onClick={() => handleUpdate(item.product.id, "decrease")}
                  style={styles.quantityButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = quantityButtonHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = styles.quantityButton.backgroundColor;
                  }}
                >
                  −
                </button>

                <span style={styles.quantityDisplay}>
                  {item.quantity}
                </span>

                <button 
                  onClick={() => handleUpdate(item.product.id, "increase")}
                  style={styles.quantityButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = quantityButtonHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = styles.quantityButton.backgroundColor;
                  }}
                >
                  +
                </button>
              </div>

              {/* RIGHT - Total & Remove */}
              <div style={styles.itemTotal}>
                <div style={styles.totalAmount}>
                  ₹ {(item.quantity * item.product.price).toLocaleString()}
                </div>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  style={styles.removeButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = removeButtonHover.backgroundColor;
                    e.currentTarget.style.transform = removeButtonHover.transform;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'none';
                  }}
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section - Now positioned better */}
      <div style={styles.summaryContainer}>
        <div style={styles.totalText}>
          Total: ₹ {total.toLocaleString()}
        </div>
        <div style={styles.checkoutButtonContainer}>
          <button 
            onClick={handleCheckout}
            style={styles.checkoutButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHover.backgroundColor;
              e.currentTarget.style.transform = buttonHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = styles.checkoutButton.backgroundColor;
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={styles.checkoutButtonContent}>
              <span>Proceed to Checkout</span>
              <span style={{ fontSize: "20px", marginLeft: "8px" }}>→</span>
            </div>
          </button>
        </div>
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
      </div>
    </div>
  );
}

export default Cart;