import { useEffect, useState } from "react";

function FishCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories/")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shop by Category</h2>

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              width: "150px",
              textAlign: "center",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <img
              src={cat.image || "https://via.placeholder.com/100"}
              alt={cat.name}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FishCategory;
