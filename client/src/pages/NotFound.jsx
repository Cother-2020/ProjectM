import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';

export default function NotFound() {
    const { t } = useTranslation();
    const location = useLocation();

    // Check if we're in admin area
    const isAdminArea = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center">
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <span className="text-5xl">🍽️</span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">
                    {t('not_found_title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                    {t('not_found_message')}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <HomeIcon className="w-5 h-5" />
                        {t('not_found_back_home')}
                    </Link>

                    {isAdminArea && (
                        <Link
                            to="/admin"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            {t('not_found_back_admin')}
                        </Link>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="mt-16 flex justify-center gap-8 opacity-30">
                    <span className="text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>🍕</span>
                    <span className="text-4xl animate-bounce" style={{ animationDelay: '100ms' }}>🍔</span>
                    <span className="text-4xl animate-bounce" style={{ animationDelay: '200ms' }}>🍜</span>
                    <span className="text-4xl animate-bounce" style={{ animationDelay: '300ms' }}>🍰</span>
                </div>
            </div>
        </div>
    );
}
