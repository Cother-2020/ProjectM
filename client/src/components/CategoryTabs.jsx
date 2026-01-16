import { useTranslation } from '../context/LanguageContext';

export default function CategoryTabs({ categories, activeCategory, onSelect }) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide py-2 px-1">
            <button
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ring-2 ring-transparent focus:outline-none focus:ring-orange-200 dark:focus:ring-orange-800 ${!activeCategory
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/50 scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-500 shadow-sm border border-transparent dark:border-gray-700'
                    }`}
                onClick={() => onSelect(null)}
            >
                {t('cat_all')}
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ring-2 ring-transparent focus:outline-none focus:ring-orange-200 dark:focus:ring-orange-800 ${activeCategory === cat.id
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/50 scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-500 shadow-sm border border-transparent dark:border-gray-700'
                        }`}
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
