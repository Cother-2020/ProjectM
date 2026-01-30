import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import {
    ClockIcon,
    FireIcon,
    CheckCircleIcon,
    HomeIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const ORDER_STATUSES = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];

export default function OrderTracking() {
    const { t } = useTranslation();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState(orderId || '');

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        }
    }, [orderId]);

    // Poll for updates every 10 seconds if order is not completed
    useEffect(() => {
        if (order && order.status !== 'COMPLETED') {
            const interval = setInterval(() => {
                fetchOrder(order.id);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [order]);

    const fetchOrder = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/orders/${id}`);
            setOrder(res.data);
        } catch (e) {
            setError(t('order_tracking_not_found'));
            setOrder(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            fetchOrder(searchInput.trim());
        }
    };

    const getStatusIcon = (status, isActive, isCompleted) => {
        const baseClass = "w-8 h-8";

        if (isCompleted) {
            return <CheckCircleSolid className={`${baseClass} text-green-500`} />;
        }

        switch (status) {
            case 'PENDING':
                return <ClockIcon className={`${baseClass} ${isActive ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />;
            case 'PREPARING':
                return <FireIcon className={`${baseClass} ${isActive ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}`} />;
            case 'READY':
                return <CheckCircleIcon className={`${baseClass} ${isActive ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />;
            case 'COMPLETED':
                return <CheckCircleIcon className={`${baseClass} ${isActive ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />;
            default:
                return null;
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': t('order_status_pending'),
            'PREPARING': t('order_status_preparing'),
            'READY': t('order_status_ready'),
            'COMPLETED': t('order_status_completed')
        };
        return labels[status] || status;
    };

    const currentStatusIndex = order ? ORDER_STATUSES.indexOf(order.status) : -1;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {t('order_tracking_title')}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                {t('order_tracking_subtitle')}
                            </p>
                        </div>
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">{t('not_found_back_home')}</span>
                        </Link>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mt-6 max-w-md">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder={t('order_tracking_input_placeholder')}
                                className="w-full pl-10 pr-24 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                            >
                                {isLoading ? t('order_tracking_searching') : t('order_tracking_button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {t('order_tracking_not_found')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {t('order_tracking_not_found_msg')}
                        </p>
                    </div>
                )}

                {order && (
                    <div className="max-w-2xl mx-auto">
                        {/* Order Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {t('kitchen_order_id')} #{order.id}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {t('order_placed_at')}: {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-full font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                    order.status === 'PREPARING' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                        order.status === 'READY' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                            'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    }`}>
                                    {getStatusLabel(order.status)}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="relative">
                                <div className="flex justify-between">
                                    {ORDER_STATUSES.map((status, index) => {
                                        const isCompleted = index < currentStatusIndex;
                                        const isActive = index === currentStatusIndex;

                                        return (
                                            <div key={status} className="flex flex-col items-center flex-1">
                                                <div className={`relative z-10 ${isCompleted || isActive ? '' : 'opacity-50'}`}>
                                                    {getStatusIcon(status, isActive, isCompleted)}
                                                </div>
                                                <span className={`text-xs mt-2 text-center font-medium ${isActive ? 'text-orange-600 dark:text-orange-400' :
                                                    isCompleted ? 'text-green-600 dark:text-green-400' :
                                                        'text-gray-400 dark:text-gray-500'
                                                    }`}>
                                                    {getStatusLabel(status)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Progress line */}
                                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                                {t('order_items')}
                            </h3>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {order.items.map((item) => {
                                    const basePrice = item.product?.price || 0;
                                    const optionsPrice = item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
                                    const itemTotal = (basePrice + optionsPrice) * item.quantity;

                                    return (
                                        <li key={item.id} className="py-4 flex justify-between items-start">
                                            <div className="flex items-start gap-4">
                                                <span className="font-bold text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
                                                    {item.quantity}x
                                                </span>
                                                <div>
                                                    <span className="text-gray-800 dark:text-gray-200 font-medium block">
                                                        {item.product?.name || 'Unknown'}
                                                    </span>
                                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
                                                            {item.selectedOptions.map((opt, idx) => (
                                                                <p key={idx}>{opt.name} (+¥{opt.price})</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                ¥{itemTotal.toFixed(2)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    {t('order_total')}
                                </span>
                                <span className="text-2xl font-bold text-orange-600">
                                    ¥{order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {!order && !error && !isLoading && (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {t('order_tracking_subtitle')}
                        </h2>
                    </div>
                )}

                {!orderId && !order && !isLoading && (
                    <div className="max-w-md mx-auto mt-12">
                        {(() => {
                            const saved = localStorage.getItem('recentOrders');
                            const recentOrders = saved ? JSON.parse(saved) : [];

                            if (recentOrders.length === 0) return null;

                            return (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200">
                                        {t('dashboard_recent_orders')}
                                    </div>
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {recentOrders.map((o) => (
                                            <li key={o.id}>
                                                <Link to={`/order/${o.id}`} className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                #{o.id}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(o.date).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-orange-600">
                                                            ¥{o.total.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
