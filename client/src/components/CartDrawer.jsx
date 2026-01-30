import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

import { useTranslation } from '../context/LanguageContext';

export default function CartDrawer() {
    const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const orderData = {
                totalAmount: cartTotal,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    selectedOptions: item.selectedOptions?.map(opt => ({
                        name: opt.name,
                        price: opt.price
                    })) || []
                }))
            };
            const res = await axios.post('/api/orders', orderData);

            // Save to local history
            const bgOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
            const updatedOrders = [
                { id: res.data.id, date: new Date().toISOString(), total: cartTotal },
                ...bgOrders
            ].slice(0, 5); // Keep last 5
            localStorage.setItem('recentOrders', JSON.stringify(updatedOrders));

            // Show success state
            setIsSuccess(true);

            // Delay navigation for animation
            setTimeout(() => {
                toast.success(`${t('order_success')} ${res.data.id}`);
                clearCart();
                setIsSuccess(false);
                setIsCheckingOut(false);
                closeCart();
                // Navigate to order tracking page
                navigate(`/order/${res.data.id}`);
            }, 2000);

        } catch (error) {
            toast.error(t('order_failed'));
            console.error(error);
            setIsCheckingOut(false);
        }
    };

    const calculateItemPrice = (item) => {
        let price = item.price;
        if (item.selectedOptions) {
            item.selectedOptions.forEach(opt => {
                price += opt.price || 0;
            });
        }
        return price;
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={closeCart} />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                <div className="w-screen max-w-md pointer-events-auto bg-white dark:bg-gray-800 shadow-xl flex flex-col h-full transform transition-transform duration-500 ease-in-out">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h2 className="text-lg font-bold font-heading text-gray-900 dark:text-gray-100">{t('cart_title')}</h2>
                        <button onClick={closeCart} className="text-gray-400 hover:text-gray-500 transition-colors">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Success Overlay */}
                    {isSuccess && (
                        <div className="absolute inset-0 z-50 bg-white dark:bg-gray-800 flex flex-col items-center justify-center animate-fadeIn">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <CheckCircleIconSolid className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('success')}!</h3>
                            <p className="text-gray-500 dark:text-gray-400">{t('order_status_pending')}</p>
                        </div>
                    )}

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4">
                                <ShoppingBagIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                                <p className="text-lg">{t('cart_empty')}</p>
                                <button onClick={closeCart} className="text-orange-600 font-bold hover:underline">{t('cart_start_ordering')}</button>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {cartItems.map((item) => (
                                    <li key={item.cartItemId} className="flex py-6 group">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                                                    <h3 className="font-heading">{item.name}</h3>
                                                    <p className="ml-4 text-orange-600 dark:text-orange-500 font-bold">¥{(calculateItemPrice(item) * item.quantity).toFixed(2)}</p>
                                                </div>
                                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                                                        {item.selectedOptions.map((opt, idx) => (
                                                            <p key={idx}>{opt.name} (+¥{opt.price})</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 rounded shadow-sm hover:text-orange-600 dark:text-gray-200 dark:hover:text-orange-400">-</button>
                                                    <span className="font-bold w-4 text-center dark:text-gray-200">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 rounded shadow-sm hover:text-orange-600 dark:text-gray-200 dark:hover:text-orange-400">+</button>
                                                </div>
                                                <button type="button" onClick={() => removeFromCart(item.cartItemId)} className="font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
                                <p>{t('cart_subtotal')}</p>
                                <p className="text-xl font-bold text-orange-600">¥{cartTotal.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="flex w-full items-center justify-center rounded-xl border border-transparent bg-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0"
                            >
                                {isCheckingOut ? t('cart_processing') : t('cart_checkout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper to avoid undefined component
function ShoppingBagIcon(props) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
    )
}
