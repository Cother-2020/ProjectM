import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from '../context/LanguageContext';
import {
    ClockIcon,
    FireIcon,
    CheckCircleIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { socket } from '../socket';

const ORDER_STATUSES = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];

export default function OrderTracking() {
    const { t } = useTranslation();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState(orderId || '');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const orderIdRef = useRef(null);

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        } else {
            // Clear order state when navigating back to list view
            setOrder(null);
            setError(null);
            setHistory([]);
            fetchAllOrders();
        }
    }, [orderId]);

    // Update orderIdRef when order changes
    useEffect(() => {
        orderIdRef.current = order?.id;
    }, [order?.id]);

    // Socket listener for order updates
    useEffect(() => {
        const handleOrderUpdate = (updatedOrder) => {
            if (updatedOrder.id === orderIdRef.current) {
                setOrder(updatedOrder);
            }
        };

        socket.on('order:update', handleOrderUpdate);

        return () => {
            socket.off('order:update', handleOrderUpdate);
        };
    }, []);

    const fetchOrder = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/orders/${id}`);
            setOrder(res.data);
            setHistoryLoading(true);
            try {
                const histRes = await axios.get(`/api/orders/${id}/history`);
                setHistory(histRes.data || []);
            } catch (e) {
                setHistory([]);
            } finally {
                setHistoryLoading(false);
            }
        } catch (e) {
            setError(t('order_tracking_not_found'));
            setOrder(null);
            setHistory([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await axios.get('/api/orders');
            setAllOrders(res.data);
        } catch (e) {
            console.error('Failed to fetch orders:', e);
            setAllOrders([]);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            fetchOrder(searchInput.trim());
        }
    };

    const handleConfirmPickup = async () => {
        if (!order) return;
        try {
            await axios.patch(`/api/orders/${order.id}/status`, { status: 'COMPLETED' });
            toast.success(t('order_pickup_confirmed'));
            fetchOrder(order.id);
        } catch (e) {
            toast.error(t('error'));
        }
    };

    const getStatusIcon = (status, isActive, isCompleted) => {
        const baseClass = "w-8 h-8";

        // Use solid icon for completed steps OR when the COMPLETED status is active
        if (isCompleted || (isActive && status === 'COMPLETED')) {
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
                return <CheckCircleIcon className={`${baseClass} text-gray-300 dark:text-gray-600`} />;
            default:
                return null;
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': t('order_status_pending'),
            'PREPARING': t('order_status_preparing'),
            'READY': t('order_status_ready'),
            'COMPLETED': t('order_status_completed'),
            'CANCELED': t('order_status_canceled')
        };
        return labels[status] || status;
    };

    const getStatusBadgeClass = (status) => {
        const base = 'px-2.5 py-0.5 rounded-full text-xs font-semibold border';
        switch (status) {
            case 'PENDING':
                return `${base} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800`;
            case 'PREPARING':
                return `${base} bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800`;
            case 'READY':
                return `${base} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800`;
            case 'COMPLETED':
                return `${base} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800`;
            case 'CANCELED':
                return `${base} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800`;
            default:
                return `${base} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600`;
        }
    };

    const isCanceled = order?.status === 'CANCELED';
    const currentStatusIndex = order && !isCanceled ? ORDER_STATUSES.indexOf(order.status) : -1;

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
                        {orderId ? (
                            <Link
                                to="/order"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                </svg>
                                <span className="hidden sm:inline">{t('back_to_orders')}</span>
                            </Link>
                        ) : (
                            <Link
                                to="/"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <HomeIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('not_found_back_home')}</span>
                            </Link>
                        )}
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
                                <div className={getStatusBadgeClass(order.status)}>
                                    {getStatusLabel(order.status)}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            {!isCanceled ? (
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
                            ) : (
                                <div className="mt-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="font-semibold text-red-700 dark:text-red-300">
                                        {t('order_canceled')}
                                    </p>
                                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                        {t('order_cancel_reason')}: {order.cancelReason || '-'}
                                    </p>
                                </div>
                            )}

                            {/* Confirm Pickup Button - Only show when READY */}
                            {order.status === 'READY' && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={handleConfirmPickup}
                                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 dark:shadow-green-900/20 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    >
                                        {t('order_confirm_pickup')}
                                    </button>
                                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {t('order_confirm_pickup_hint')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                                {t('order_items')}
                            </h3>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {order.items?.map((item) => {
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

                            {/* Customer Notes */}
                            {order.notes && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                                        <ChatBubbleLeftIcon className="w-4 h-4" />
                                        {t('order_notes')}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                        {order.notes}
                                    </p>
                                </div>
                            )}

                            {/* Status History */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {t('order_history')}
                                </p>
                                {historyLoading ? (
                                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('order_history_loading')}</p>
                                ) : history.length === 0 ? (
                                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('order_history_empty')}</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {history.map((entry) => (
                                            <li key={entry.id} className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 flex flex-col items-center">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                                                        <span className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-1"></span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('order_history_from')}</span>
                                                            <span className={getStatusBadgeClass(entry.fromStatus)}>
                                                                {entry.fromStatus ? getStatusLabel(entry.fromStatus) : '-'}
                                                            </span>
                                                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('order_history_to')}</span>
                                                            <span className={getStatusBadgeClass(entry.toStatus)}>
                                                                {getStatusLabel(entry.toStatus)}
                                                            </span>
                                                        </div>
                                                        {(entry.reason || entry.note) && (
                                                            <div className="mt-1 text-gray-500 dark:text-gray-400">
                                                                {entry.reason && <span>{t('order_history_reason')}: {entry.reason}</span>}
                                                                {entry.reason && entry.note && <span className="mx-2">·</span>}
                                                                {entry.note && <span>{t('order_history_note')}: {entry.note}</span>}
                                                            </div>
                                                        )}
                                                        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                            {new Date(entry.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

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
                    <div className="max-w-4xl mx-auto mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-b border-orange-200 dark:border-orange-800">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {t('dashboard_recent_orders')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Click on any order to view details
                                </p>
                            </div>

                            {isLoadingOrders ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                    <p className="mt-4 text-gray-500 dark:text-gray-400">{t('loading')}</p>
                                </div>
                            ) : allOrders.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">📋</span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">{t('kitchen_no_orders')}</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('kitchen_no_orders_msg')}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {allOrders.map((o) => (
                                        <Link
                                            key={o.id}
                                            to={`/order/${o.id}`}
                                            className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                                            #{o.id}
                                                        </span>
                                                        <span className={getStatusBadgeClass(o.status)}>
                                                            {getStatusLabel(o.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <ClockIcon className="w-4 h-4" />
                                                            {new Date(o.createdAt).toLocaleString()}
                                                        </span>
                                                        <span>
                                                            {o.items?.length || 0} {t('items')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                                                        ¥{o.totalAmount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                        {t('btn_view_details')} →
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
