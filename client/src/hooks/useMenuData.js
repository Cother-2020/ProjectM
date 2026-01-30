import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useMenuData() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedTime, setSelectedTime] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Initial load of categories
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/categories');
                setCategories(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const url = activeCategory ? `/api/products?categoryId=${activeCategory}` : '/api/products';
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                setError(err);
                toast.error("Failed to load dishes");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    // Memoized filtered products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Time filter
            if (selectedTime !== 'ALL') {
                if (p.availableTime !== 'ALL' && (!p.availableTime || !p.availableTime.includes(selectedTime))) {
                    return false;
                }
            }

            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const nameMatch = p.name?.toLowerCase().includes(query);
                const descMatch = p.description?.toLowerCase().includes(query);
                if (!nameMatch && !descMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [products, selectedTime, searchQuery]);

    return {
        products: filteredProducts,
        allProducts: products, // raw products for reference
        categories,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        selectedTime,
        setSelectedTime,
        searchQuery,
        setSearchQuery
    };
}
