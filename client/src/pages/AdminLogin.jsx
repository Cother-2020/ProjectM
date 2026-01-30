import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
    const { t } = useTranslation();
    const { login, bootstrap } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin';

    const [mode, setMode] = useState('login'); // login | setup
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [setupKey, setSetupKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(username, password);
            } else {
                await bootstrap(username, password, setupKey);
            }
            navigate(from, { replace: true });
        } catch (e) {
            const msg = e?.response?.data?.error || t('error');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin_login_title')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_login_subtitle')}</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'login'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                        {t('admin_login_tab')}
                    </button>
                    <button
                        onClick={() => setMode('setup')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'setup'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                        {t('admin_setup_tab')}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin_username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder={t('admin_username_placeholder')}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin_password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder={t('admin_password_placeholder')}
                            required
                        />
                    </div>

                    {mode === 'setup' && (
                        <div>
                            <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin_setup_key')}</label>
                            <input
                                type="password"
                                value={setupKey}
                                onChange={(e) => setSetupKey(e.target.value)}
                                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder={t('admin_setup_key_placeholder')}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? t('admin_login_loading') : (mode === 'login' ? t('admin_login_button') : t('admin_setup_button'))}
                    </button>
                </form>
            </div>
        </div>
    );
}
