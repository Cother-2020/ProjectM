import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import {
    ShoppingCartIcon,
    CurrencyYenIcon,
    ReceiptPercentIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { StatsCardSkeleton } from '../components/Skeleton';

export default function Dashboard() {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = `ProjectM - ${t('dashboard_title')}`;
        fetchStats();
    }, [t]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/stats');
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
                    {subValue && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{subValue}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-500',
            PREPARING: 'bg-blue-500',
            READY: 'bg-green-500',
            COMPLETED: 'bg-gray-400'
        };
        return colors[status] || 'bg-gray-300';
    };

    const getStatusTranslation = (status) => {
        const statusMap = {
            'PENDING': t('status_pending'),
            'PREPARING': t('status_preparing'),
            'READY': t('status_ready'),
            'COMPLETED': t('status_completed')
        };
        return statusMap[status] || status;
    };

    if (isLoading) {
        return (
            <div>
                <div className="mb-8">
                    <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => <StatsCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <p>{t('dashboard_no_data')}</p>
            </div>
        );
    }

    const totalStatusOrders = Object.values(stats.statusDistribution).reduce((a, b) => a + b, 0);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard_title')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('dashboard_subtitle')}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={ShoppingCartIcon}
                    label={t('dashboard_today_orders')}
                    value={stats.todayOrders}
                    subValue={`¥${stats.todayRevenue.toFixed(2)}`}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={CurrencyYenIcon}
                    label={t('dashboard_total_revenue')}
                    value={`¥${stats.totalRevenue.toFixed(2)}`}
                    subValue={`${stats.totalOrders} ${t('items')}`}
                    color="bg-green-500"
                />
                <StatCard
                    icon={ReceiptPercentIcon}
                    label={t('dashboard_avg_order')}
                    value={`¥${stats.avgOrderValue.toFixed(2)}`}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={ClockIcon}
                    label={t('dashboard_pending_orders')}
                    value={stats.pendingOrders}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        {t('dashboard_order_status')}
                    </h3>

                    {/* Simple bar chart */}
                    <div className="space-y-4">
                        {Object.entries(stats.statusDistribution).map(([status, count]) => {
                            const percentage = totalStatusOrders > 0 ? (count / totalStatusOrders) * 100 : 0;
                            return (
                                <div key={status}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {getStatusTranslation(status)}
                                        </span>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {count}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getStatusColor(status)} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Selling Dishes */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        {t('dashboard_top_dishes')}
                    </h3>

                    {stats.topDishes.length === 0 ? (
                        <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                            {t('dashboard_no_data')}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {stats.topDishes.map((dish, index) => (
                                <div
                                    key={dish.id}
                                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                        index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                        index === 1 ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300' :
                                        index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                            {dish.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {dish.quantity} {t('items')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-orange-600 dark:text-orange-500">
                                            ¥{dish.revenue.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {t('dashboard_recent_orders')}
                </h3>

                {stats.recentOrders.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                        {t('dashboard_no_data')}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                    <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">{t('kitchen_order_id')}</th>
                                    <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">{t('filter_status')}</th>
                                    <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">{t('items')}</th>
                                    <th className="pb-3 font-medium text-gray-500 dark:text-gray-400 text-right">{t('kitchen_total')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {stats.recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="py-3 font-bold text-gray-800 dark:text-gray-200">
                                            #{order.id}
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                order.status === 'PREPARING' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                order.status === 'READY' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                            }`}>
                                                {getStatusTranslation(order.status)}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600 dark:text-gray-400">
                                            {order.itemCount}
                                        </td>
                                        <td className="py-3 text-right font-bold text-orange-600 dark:text-orange-500">
                                            ¥{order.totalAmount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
