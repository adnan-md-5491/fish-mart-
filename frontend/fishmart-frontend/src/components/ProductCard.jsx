function ProductCard({ product }) {
  return (
    <div className="border rounded-xl p-4 flex justify-between">
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p>₹ {product.price}</p>
        <p className="text-sm text-gray-500">{product.weight}</p>
      </div>

      <button className="bg-green-600 text-white px-4 py-1 rounded">
        ADD
      </button>
    </div>
  );
}

export default ProductCard;
