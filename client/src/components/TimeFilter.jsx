import { useTranslation } from '../context/LanguageContext';

export default function TimeFilter({ selectedTime, onSelect }) {
    const { t } = useTranslation();
    const times = ['ALL', 'BREAKFAST', 'LUNCH', 'DINNER'];

    return (
        <div className="flex justify-center mb-8">
            <div className="glass p-1.5 rounded-full flex gap-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-sm border border-white/60 dark:border-gray-700">
                {times.map((time) => {
                    const isActive = selectedTime === time;
                    return (
                        <button
                            key={time}
                            onClick={() => onSelect(time)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden ${isActive
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <span className="relative z-10">
                                {t(`time_${time.toLowerCase()}`)}
                            </span>
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
