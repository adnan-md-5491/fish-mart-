import { useEffect, useState } from "react";
import { getWalletBalance, createWalletOrder, verifyWalletPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function MyWallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { navigate("/login"); return; }
    loadWallet();
  }, []);

  const loadWallet = () => {
    setLoading(true);
    getWalletBalance()
      .then(res => { setWallet(res.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate("/login"); });
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setAmount(val);
    if (val < 10) setAmountError("Minimum amount is ₹10");
    else if (val > 50000) setAmountError("Maximum amount is ₹50,000");
    else setAmountError("");
  };

  const handleAddMoney = () => {
    if (!amount || amount < 10) { setAmountError("Minimum amount is ₹10"); return; }
    if (amount > 50000) { setAmountError("Maximum amount is ₹50,000"); return; }

    setAdding(true);
    createWalletOrder({ amount: parseInt(amount) })
      .then(res => {
        const options = {
          key: "rzp_test_e664V0FP0zQy7N",
          order_id: res.data.id,
          amount: res.data.amount * 100,
          currency: "INR",
          name: "FishMart Wallet",
          description: "Add money to wallet",
          handler: function (response) {
            verifyWalletPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: parseInt(amount)
            }).then(() => {
              setAdding(false);
              setAmount("");
              setSuccessMsg(`✅ ₹${amount} added successfully!`);
              loadWallet();
              setTimeout(() => setSuccessMsg(""), 3000);
            });
          },
          prefill: {},
          theme: { color: "#007bff" }
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => { setAdding(false); alert("Payment failed."); });
        rzp.open();
        setAdding(false);
      })
      .catch(() => { setAdding(false); alert("Something went wrong."); });
  };

  const quickAmounts = [100, 200, 500, 1000, 2000];

  if (loading) return <div style={{ textAlign: "center", padding: "60px" }}>Loading wallet...</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: "24px" }}>My Wallet</h2>

      {/* Balance Card */}
      <div style={{
        background: "linear-gradient(135deg, #007bff, #0056b3)",
        borderRadius: "16px", padding: "32px", color: "white",
        marginBottom: "20px", textAlign: "center"
      }}>
        <div style={{ fontSize: "14px", opacity: 0.85, marginBottom: "8px" }}>Available Balance</div>
        <div style={{ fontSize: "48px", fontWeight: "700", marginBottom: "4px" }}>
          ₹{parseFloat(wallet?.balance || 0).toFixed(2)}
        </div>
        <div style={{ fontSize: "13px", opacity: 0.75 }}>FishMart Wallet</div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{
          background: "#e8f5e9", border: "1px solid #b7ebc8", borderRadius: "10px",
          padding: "12px", color: "#28a745", fontWeight: "600",
          marginBottom: "16px", textAlign: "center"
        }}>
          {successMsg}
        </div>
      )}

      {/* Add Money */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: "20px"
      }}>
        <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>💰 Add Money</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          {quickAmounts.map(q => (
            <button key={q} onClick={() => { setAmount(String(q)); setAmountError(""); }}
              style={{
                padding: "8px 16px",
                background: amount == q ? "#007bff" : "#f8f9fa",
                color: amount == q ? "white" : "#2c3e50",
                border: `1px solid ${amount == q ? "#007bff" : "#dee2e6"}`,
                borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px"
              }}>
              +₹{q}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <input type="text" placeholder="Enter custom amount" value={amount}
              onChange={handleAmountChange}
              style={{
                width: "100%", padding: "12px", borderRadius: "10px",
                border: `2px solid ${amountError ? "#dc3545" : "#e9ecef"}`,
                fontSize: "16px", fontFamily: "inherit", boxSizing: "border-box"
              }}
            />
            {amountError && <p style={{ color: "#dc3545", fontSize: "13px", marginTop: "4px" }}>{amountError}</p>}
          </div>
          <button onClick={handleAddMoney} disabled={adding || !amount || amountError}
            style={{
              padding: "12px 24px",
              background: adding || !amount || amountError ? "#6c757d" : "#007bff",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "16px", fontWeight: "600",
              cursor: adding || !amount || amountError ? "not-allowed" : "pointer",
              whiteSpace: "nowrap"
            }}>
            {adding ? "Processing..." : "Add Money"}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
      }}>
        <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>📋 Transaction History</h3>

        {!wallet?.transactions || wallet.transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#888" }}>No transactions yet</div>
        ) : (
          [...wallet.transactions].reverse().map(txn => (
            <div key={txn.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 0", borderBottom: "1px solid #f0f0f0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: txn.transaction_type === "credit" ? "#e8f5e9" : "#ffebee",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
                }}>
                  {txn.transaction_type === "credit" ? "⬇️" : "⬆️"}
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "15px", color: "#2c3e50" }}>
                    {txn.description}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {new Date(txn.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </div>
                </div>
              </div>
              <div style={{
                fontWeight: "700", fontSize: "16px",
                color: txn.transaction_type === "credit" ? "#28a745" : "#dc3545"
              }}>
                {txn.transaction_type === "credit" ? "+" : "-"}₹{parseFloat(txn.amount).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyWallet;