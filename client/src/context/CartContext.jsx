import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Helper to generate unique ID for cart items based on product + options
    const generateCartItemId = (product) => {
        if (!product.selectedOptions || product.selectedOptions.length === 0) {
            return `${product.id}`;
        }
        const sortedOptions = [...product.selectedOptions].sort((a, b) => a.id - b.id);
        const optionsString = sortedOptions.map(o => o.id).join('-');
        return `${product.id}-${optionsString}`;
    };

    const addToCart = (product) => {
        const cartItemId = generateCartItemId(product);

        setCartItems(prev => {
            const existing = prev.find(item => item.cartItemId === cartItemId);
            if (existing) {
                return prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, cartItemId, quantity: 1 }];
        });

        toast.success(`Added ${product.name} to cart`);
        setIsCartOpen(true);
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item));
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
        toast('Item removed', { icon: '🗑️' });
    };

    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared');
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const calculateItemPrice = (item) => {
        let price = item.price;
        if (item.selectedOptions) {
            item.selectedOptions.forEach(opt => {
                price += opt.price || 0;
            });
        }
        return price;
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (calculateItemPrice(item) * item.quantity), 0);

    const value = {
        cartItems,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        cartCount,
        cartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
