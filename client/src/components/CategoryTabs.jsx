export default function CategoryTabs({ categories, activeCategory, onSelect }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide py-2 px-1">
            <button
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ring-2 ring-transparent focus:outline-none focus:ring-orange-200 ${!activeCategory
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                        : 'bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
                    }`}
                onClick={() => onSelect(null)}
            >
                All Categories
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ring-2 ring-transparent focus:outline-none focus:ring-orange-200 ${activeCategory === cat.id
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                            : 'bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
                        }`}
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
