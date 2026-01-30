import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from '../context/LanguageContext';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { OrderCardSkeleton } from '../components/Skeleton';

const STATUS_FILTERS = ['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED'];
const DATE_FILTERS = ['ALL', 'TODAY', 'WEEK', 'MONTH'];

export default function Admin() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = `ProjectM - ${t('kitchen_title')}`;
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [t]);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/orders/${id}/status`, { status });
            fetchOrders();
            toast.success(`${t('kitchen_order_id')} #${id} → ${t(`status_${status.toLowerCase()}`)}`);
        } catch (e) {
            toast.error(t('error'));
        }
    };

    // Filter logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status filter
            if (statusFilter !== 'ALL' && order.status !== statusFilter) {
                return false;
            }

            // Date filter
            if (dateFilter !== 'ALL') {
                const orderDate = new Date(order.createdAt);
                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const startOfWeek = new Date(startOfToday);
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                if (dateFilter === 'TODAY' && orderDate < startOfToday) return false;
                if (dateFilter === 'WEEK' && orderDate < startOfWeek) return false;
                if (dateFilter === 'MONTH' && orderDate < startOfMonth) return false;
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const orderIdMatch = order.id.toString().includes(query);
                const itemMatch = order.items.some(item =>
                    item.product?.name?.toLowerCase().includes(query)
                );
                if (!orderIdMatch && !itemMatch) return false;
            }

            return true;
        });
    }, [orders, statusFilter, dateFilter, searchQuery]);

    const getStatusTranslation = (status) => {
        const statusMap = {
            'PENDING': t('status_pending'),
            'PREPARING': t('status_preparing'),
            'READY': t('status_ready'),
            'COMPLETED': t('status_completed')
        };
        return statusMap[status] || status;
    };

    const getDateFilterTranslation = (filter) => {
        const map = {
            'ALL': t('filter_all_time'),
            'TODAY': t('filter_today'),
            'WEEK': t('filter_week'),
            'MONTH': t('filter_month')
        };
        return map[filter] || filter;
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="mb-8">
                    <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => <OrderCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('kitchen_title')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('kitchen_subtitle')}</p>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                statusFilter === status
                                    ? 'bg-orange-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {status === 'ALL' ? t('status_all') : getStatusTranslation(status)}
                        </button>
                    ))}
                </div>

                {/* Date Filter & Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2">
                        {DATE_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setDateFilter(filter)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    dateFilter === filter
                                        ? 'bg-gray-800 dark:bg-gray-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {getDateFilterTranslation(filter)}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 max-w-xs">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('filter_search')}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 max-w-7xl mx-auto">
                {filteredOrders.map(order => (
                    <div
                        key={order.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-l-orange-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="font-bold text-2xl font-heading text-slate-800 dark:text-gray-100">
                                    {t('kitchen_order_id')} #{order.id}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                                    order.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800' :
                                    order.status === 'PREPARING' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                                    order.status === 'READY' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' :
                                    'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                }`}>
                                    {getStatusTranslation(order.status)}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                                {order.items.map(item => (
                                    <li key={item.id} className="flex gap-3 text-lg items-center">
                                        <span className="font-bold text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                                            {item.quantity}x
                                        </span>
                                        <span>{item.product.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="font-bold text-xl text-slate-900 dark:text-gray-100 border-t pt-2 border-dashed border-gray-300 dark:border-gray-600">
                                {t('kitchen_total')}: ¥{order.totalAmount.toFixed(2)}
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            {order.status === 'PENDING' && (
                                <button
                                    onClick={() => updateStatus(order.id, 'PREPARING')}
                                    className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    {t('kitchen_start_cooking')}
                                </button>
                            )}
                            {order.status === 'PREPARING' && (
                                <button
                                    onClick={() => updateStatus(order.id, 'READY')}
                                    className="flex-1 md:flex-none bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    {t('kitchen_mark_ready')}
                                </button>
                            )}
                            {order.status === 'READY' && (
                                <button
                                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                                    className="flex-1 md:flex-none bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-green-900/20 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    {t('kitchen_complete')}
                                </button>
                            )}
                            <button className="md:hidden flex-1 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-600 dark:text-gray-300 py-3">
                                {t('kitchen_details')}
                            </button>
                        </div>
                    </div>
                ))}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                        <p className="text-2xl font-bold font-heading mb-2">{t('kitchen_no_orders')}</p>
                        <p className="text-sm">{t('kitchen_no_orders_msg')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
