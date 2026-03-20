function CategoryBar({ categories, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-4">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;
