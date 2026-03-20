import { useEffect, useState } from "react";
import api from "../services/api";
import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";

function Home() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    api.get("categories/").then(res => {
      setCategories(res.data);
      setActiveCategory(res.data[0]);
    });
  }, []);

  return (
    <div className="p-4">
      <CategoryBar categories={categories} onSelect={setActiveCategory} />

      <div className="mt-4 space-y-3">
        {activeCategory?.products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;
