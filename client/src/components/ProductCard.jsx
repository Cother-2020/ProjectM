import { PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import ProductImage from './ProductImage';

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
    const { t } = useTranslation();

    const handleImageClick = () => {
        if (onViewDetails) {
            onViewDetails(product);
        }
    };

    return (
        <div className="group glass bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border border-white/50 dark:border-gray-700">
            <div
                className="relative h-56 overflow-hidden cursor-pointer"
                onClick={handleImageClick}
            >
                <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    fallbackClassName="w-full h-full"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Time Badge (optional) */}
                {product.availableTime !== 'ALL' && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-white/90 backdrop-blur text-orange-700 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                            {product.availableTime.replace(/,/g, ' & ')}
                        </span>
                    </div>
                )}

                {/* Customizable Badge */}
                {product.optionGroups && product.optionGroups.length > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-orange-500/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm flex items-center gap-1">
                            <AdjustmentsHorizontalIcon className="w-3 h-3" />
                            {t('tag_customizable')}
                        </span>
                    </div>
                )}

                {/* Quick Add Button showing on hover */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                    className="absolute bottom-3 right-3 bg-white text-orange-600 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600 hover:text-white"
                    title={t('btn_add_to_cart')}
                >
                    <PlusIcon className="w-6 h-6" />
                </button>

                {/* View Details hint */}
                {onViewDetails && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-lg">
                            {t('btn_view_details')}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="font-bold text-xl font-heading text-slate-800 dark:text-gray-100 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors cursor-pointer"
                        onClick={handleImageClick}
                    >
                        {product.name}
                    </h3>
                    <span className="font-bold text-lg text-slate-900 dark:text-white bg-orange-50 dark:bg-gray-700 px-2 py-1 rounded-lg ml-2 border border-transparent dark:border-gray-600">
                        ¥{product.price}
                    </span>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                    {product.description}
                </p>

                <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-orange-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    {t('btn_add_to_cart')}
                </button>
            </div>
        </div>
    );
}
