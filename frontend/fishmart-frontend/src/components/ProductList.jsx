function ProductList({ products }) {
  return (
    <div style={{ marginTop: "20px" }}>
      {products.map(p => (
        <div
          key={p.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #eee"
          }}
        >
          <div>
            <h4>{p.name}</h4>
            <p>₹ {p.price}</p>
          </div>

          <button
            style={{
              background: "green",
              color: "white",
              padding: "5px 15px",
              borderRadius: "5px"
            }}
          >
            ADD
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
