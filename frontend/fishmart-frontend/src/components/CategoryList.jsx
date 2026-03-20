function CategoryList({ categories, onSelect }) {
  return (
    <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            cursor: "pointer"
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryList;
