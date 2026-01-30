import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useMenuData } from '../hooks/useMenuData';
import CategoryTabs from '../components/CategoryTabs';
import TimeFilter from '../components/TimeFilter';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { ProductCardSkeleton } from '../components/Skeleton';
import ProductDetailModal from '../components/ProductDetailModal';
import { useTranslation } from '../context/LanguageContext';

export default function Menu() {
    const { addToCart } = useCart();
    const { t } = useTranslation();

    const {
        products,
        categories,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        selectedTime,
        setSelectedTime,
        searchQuery,
        setSearchQuery
    } = useMenuData();

    // Product Detail Modal state
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        document.title = "ProjectM - Menu";
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    if (isLoading && products.length === 0) {
        return (
            <div>
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100 mb-2">{t('menu_title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{t('menu_subtitle')}</p>
                </div>

                {/* Skeleton loading */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 p-8">
                <p className="font-bold text-lg">{t('menu_error_title')}</p>
                <p>{t('menu_error_msg')}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header Section */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100 mb-2">{t('menu_title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{t('menu_subtitle')}</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={t('search_placeholder')}
                />
            </div>

            {/* Time of Day Tabs */}
            <TimeFilter selectedTime={selectedTime} onSelect={setSelectedTime} />

            {/* Category Tabs */}
            <CategoryTabs categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in pb-12">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onViewDetails={handleProductClick}
                    />
                ))}
            </div>

            {products.length === 0 && !isLoading && (
                <div className="text-center py-24 text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    {searchQuery ? (
                        <>
                            <p className="text-lg font-medium">{t('search_no_results')}</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-orange-600 dark:text-orange-500 font-bold hover:underline"
                            >
                                {t('toast_cleared')}
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium">{t('menu_empty_title')}</p>
                            <p className="text-sm mt-2">{t('menu_empty_msg')}</p>
                        </>
                    )}
                </div>
            )}

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={handleCloseModal}
                onAddToCart={addToCart}
            />
        </div>
    );
}
