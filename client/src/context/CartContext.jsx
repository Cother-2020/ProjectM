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

    const addToCart = (product) => {
        let isExisting = false;
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                isExisting = true;
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        // Toast outside the setter to avoid double firing in StrictMode or re-renders
        // We can't easily know if it was existing inside the setter callback cleanly without refs or this updated logic.
        // Actually, safer is to just fire a generic "Added to cart" message or just fire it once.
        toast.success(`Added ${product.name} to cart`);
        setIsCartOpen(true);
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast('Item removed', { icon: '🗑️' });
    };

    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared');
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
