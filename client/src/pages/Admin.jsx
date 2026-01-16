import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Admin() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = () => {
        axios.get('/api/orders').then(res => setOrders(res.data)).catch(console.error);
    };

    useEffect(() => {
        document.title = "ProjectM - Kitchen Admin";
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/orders/${id}/status`, { status });
            fetchOrders();
            toast.success(`Order #${id} updated to ${status}`);
        } catch (e) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Kitchen Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Manage live orders</p>
            </div>

            <div className="grid gap-6 max-w-7xl mx-auto">
                {orders.map(order => (
                    <div key={order.id} className="glass p-6 rounded-xl shadow-lg border-l-4 border-l-orange-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="font-bold text-2xl font-heading text-slate-800">Order #{order.id}</span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                        order.status === 'READY' ? 'bg-green-100 text-green-800 border border-green-200' :
                                            'bg-gray-100 text-gray-500'
                                    }`}>
                                    {order.status}
                                </span>
                                <span className="text-gray-400 text-sm font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <ul className="text-gray-600 space-y-2 mb-4">
                                {order.items.map(item => (
                                    <li key={item.id} className="flex gap-3 text-lg items-center">
                                        <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{item.quantity}x</span>
                                        <span>{item.product.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="font-bold text-xl text-slate-900 border-t pt-2 border-dashed border-gray-300">Total: ${order.totalAmount.toFixed(2)}</div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            {order.status === 'PENDING' && (
                                <button onClick={() => updateStatus(order.id, 'PREPARING')} className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all">Start Cooking</button>
                            )}
                            {order.status === 'PREPARING' && (
                                <button onClick={() => updateStatus(order.id, 'READY')} className="flex-1 md:flex-none bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-xl hover:-translate-y-0.5 transition-all">Mark Ready</button>
                            )}
                            {order.status === 'READY' && (
                                <button onClick={() => updateStatus(order.id, 'COMPLETED')} className="flex-1 md:flex-none bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all">Complete</button>
                            )}
                            <button className="md:hidden flex-1 border border-gray-300 rounded-xl font-medium text-gray-600 py-3">Details</button>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <p className="text-2xl font-bold font-heading mb-2">No active orders</p>
                        <p className="text-sm">New orders will appear here automatically.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
