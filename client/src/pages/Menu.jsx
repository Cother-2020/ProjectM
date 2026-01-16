import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useMenuData } from '../hooks/useMenuData';
import CategoryTabs from '../components/CategoryTabs';
import TimeFilter from '../components/TimeFilter';
import ProductCard from '../components/ProductCard';

export default function Menu() {
    const { addToCart } = useCart();

    const {
        products,
        categories,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        selectedTime,
        setSelectedTime
    } = useMenuData();

    useEffect(() => {
        document.title = "ProjectM - Menu";
    }, []);

    if (isLoading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-bounce"></div>
                    <p>Loading deliciousness...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100 p-8">
                <p className="font-bold text-lg">Oops!</p>
                <p>Failed to load the menu. Please try refreshing.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header Section (could be moved to a Hero component) */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold font-heading text-gray-900 mb-2">Our Menu</h2>
                <p className="text-gray-500 max-w-lg mx-auto">Discover our selection of fresh, handcrafted meals prepared just for you.</p>
            </div>

            {/* Time of Day Tabs */}
            <TimeFilter selectedTime={selectedTime} onSelect={setSelectedTime} />

            {/* Category Tabs */}
            <CategoryTabs categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in pb-12">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
            </div>

            {products.length === 0 && !isLoading && (
                <div className="text-center py-24 text-gray-400 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-lg font-medium">No items available for this selection.</p>
                    <p className="text-sm mt-2">Try switching categories or time of day.</p>
                </div>
            )}
        </div>
    );
}
