import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    TagIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
    const location = useLocation();

    const navigation = [
        { name: 'Kitchen Dashboard', href: '/admin', icon: ClipboardDocumentListIcon },
        { name: 'Menu Items', href: '/admin/menu', icon: Squares2X2Icon },
        { name: 'Categories', href: '/admin/categories', icon: TagIcon },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
                <div className="p-8 border-b border-gray-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">ProjectM</h1>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">Admin Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                                <span className="font-medium tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800/50">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Back to Client</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
