import { useTranslation } from '../context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, toggleLanguage } = useTranslation();

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-gray-600 dark:text-gray-300"
            title="Switch Language"
        >
            <span className={language === 'en' ? 'text-orange-600' : 'text-gray-400 dark:text-gray-500'}>EN</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className={language === 'zh' ? 'text-orange-600' : 'text-gray-400 dark:text-gray-500'}>中</span>
        </button>
    );
}
