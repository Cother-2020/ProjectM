import { useState, Fragment } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    TagIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function AdminLayout() {
    const location = useLocation();
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigation = [
        { name: t('admin_kitchen'), href: '/admin', icon: ClipboardDocumentListIcon },
        { name: t('admin_menu'), href: '/admin/menu', icon: Squares2X2Icon },
        { name: t('admin_categories'), href: '/admin/categories', icon: TagIcon },
        { name: t('admin_dashboard'), href: '/admin/dashboard', icon: ChartBarIcon },
    ];

    const SidebarContent = ({ onLinkClick }) => (
        <>
            <div className="p-6 md:p-8 border-b border-gray-800 dark:border-gray-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {t('admin_title')}
                </h1>
                <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
                    {t('admin_portal')}
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={onLinkClick}
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

            {/* Theme & Language Controls */}
            <div className="p-4 border-t border-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <ThemeToggle />
                    <LanguageSwitcher />
                </div>
            </div>

            <div className="p-4 border-t border-gray-800/50 dark:border-gray-700/50">
                <Link
                    to="/"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span className="font-medium">{t('admin_back_to_client')}</span>
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile hamburger button */}
            <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-slate-900 dark:bg-gray-800 shadow-lg">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            {t('admin_title')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <Transition.Root show={isSidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                {/* Close button */}
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5 text-white"
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>

                                {/* Sidebar content */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 dark:bg-gray-800">
                                    <SidebarContent onLinkClick={() => setIsSidebarOpen(false)} />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:flex w-64 bg-slate-900 dark:bg-gray-800 text-white flex-col shadow-2xl">
                <SidebarContent onLinkClick={() => {}} />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 pt-16 md:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
