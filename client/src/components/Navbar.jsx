import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { cartCount, openCart } = useCart();
    const { t } = useTranslation();

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-transparent dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold font-heading text-orange-600 tracking-tight hover:opacity-80 transition-opacity">
                    {t('nav_title')}
                </Link>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        to="/order"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        {t('nav_my_orders')}
                    </Link>
                    <ThemeToggle />
                    <LanguageSwitcher />

                    <button onClick={openCart} className="p-2 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-full relative transition-colors group">
                        <ShoppingBagIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
