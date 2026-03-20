import { useState } from "react";
import { createOrder } from "../services/api";
import { useNavigate } from "react-router-dom";

function Address() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const handleOrder = () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    createOrder({ address })  // send address to backend
      .then(() => {
        alert("Order placed successfully 🎉");
        navigate("/");
      })
      .catch(err => {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          alert("Error placing order");
        }
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🏠 Delivery Address</h2>

        <textarea
          placeholder="Enter full delivery address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={handleOrder} style={styles.btn}>
          Confirm & Place Order
        </button>

        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "500px"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "15px"
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px"
  },
  backBtn: {
    width: "100%",
    padding: "10px",
    background: "#eee",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default Address;
