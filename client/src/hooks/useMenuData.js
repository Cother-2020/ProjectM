import { useState, useEffect } from 'react';
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

    const filteredProducts = products.filter(p => {
        if (selectedTime === 'ALL') return true;
        // Check if product is available for ALL day or if the specific time is included in the CSV string
        return p.availableTime === 'ALL' || (p.availableTime && p.availableTime.includes(selectedTime));
    });

    return {
        products: filteredProducts,
        categories,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        selectedTime,
        setSelectedTime
    };
}
