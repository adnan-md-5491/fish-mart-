import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // check login
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("access"));
    };
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // cart count
  useEffect(() => {
    if (isLoggedIn) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItemsCount(cart.length);
    }
  }, [isLoggedIn]);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: isScrolled
          ? "#4f46e5"
          : "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "12px 24px",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          🐟 FishMart
        </Link>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search fish, meat, grocery..."
          style={{
            width: "300px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
          }}
        />

        {/* RIGHT ACTIONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link
            to="/cart"
            style={{
              color: "#fff",
              textDecoration: "none",
              position: "relative",
            }}
          >
            🛒 Cart
            {cartItemsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-12px",
                  background: "red",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {cartItemsCount}
              </span>
            )}
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  color: "#4f46e5",
                  background: "#fff",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "#fff",
                color: "#ef4444",
                border: "none",
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
