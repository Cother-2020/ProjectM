import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import ProductImage from './ProductImage';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});

    // Reset state when product changes
    useEffect(() => {
        setQuantity(1);
        setSelectedOptions({});
    }, [product]);

    if (!product) return null;

    const calculateTotal = () => {
        let total = product.price;
        Object.values(selectedOptions).flat().forEach(opt => {
            total += opt.priceModifier;
        });
        return total;
    };

    const isValidSelection = () => {
        if (!product.optionGroups) return true;
        return product.optionGroups.every(group => {
            if (group.minSelect > 0) {
                const selected = selectedOptions[group.id] || [];
                return selected.length >= group.minSelect;
            }
            return true;
        });
    };

    const handleOptionSelect = (group, option) => {
        setSelectedOptions(prev => {
            const currentSelected = prev[group.id] || [];
            const isAlreadySelected = currentSelected.find(o => o.id === option.id);

            if (group.maxSelect === 1) {
                // Single select behavior
                if (isAlreadySelected && group.minSelect === 0) {
                    // Deselect if optional
                    return { ...prev, [group.id]: [] };
                }
                return { ...prev, [group.id]: [option] };
            } else {
                // Multi select behavior
                if (isAlreadySelected) {
                    return {
                        ...prev,
                        [group.id]: currentSelected.filter(o => o.id !== option.id)
                    };
                } else {
                    if (currentSelected.length < group.maxSelect) {
                        return {
                            ...prev,
                            [group.id]: [...currentSelected, option]
                        };
                    }
                    return prev;
                }
            }
        });
    };

    const handleAddToCart = () => {
        const finalProduct = {
            ...product,
            selectedOptions: Object.values(selectedOptions).flat().map(opt => ({
                id: opt.id,
                name: opt.name,
                price: opt.priceModifier
            }))
        };
        for (let i = 0; i < quantity; i++) {
            onAddToCart(finalProduct);
        }
        onClose();
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors shadow-lg"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>

                                {/* Product Image */}
                                <div className="relative h-64 sm:h-80">
                                    <ProductImage
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full"
                                        fallbackClassName="w-full h-full"
                                    />

                                    {/* Time Badge */}
                                    {product.availableTime !== 'ALL' && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur text-orange-700 text-xs px-3 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
                                                {product.availableTime.replace(/,/g, ' & ')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    <div className="absolute bottom-4 right-4">
                                        <span className="bg-orange-600 text-white text-xl font-bold px-4 py-2 rounded-xl shadow-lg">
                                            ¥{product.price}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-heading mb-3"
                                    >
                                        {product.name}
                                    </Dialog.Title>

                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                        {product.description}
                                    </p>

                                    {/* Modifiers Selection */}
                                    {product.optionGroups && product.optionGroups.map((group) => (
                                        <div key={group.id} className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {group.name}
                                                    {group.minSelect > 0 && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">Required</span>}
                                                </h4>
                                                {group.maxSelect > 1 && <span className="text-xs text-gray-500">Select up to {group.maxSelect}</span>}
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {group.options.map((option) => {
                                                    const isSelected = selectedOptions[group.id]?.find(o => o.id === option.id);
                                                    return (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => handleOptionSelect(group, option)}
                                                            className={`flex justify-between items-center p-3 rounded-lg border text-left transition-all ${isSelected
                                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500'
                                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-orange-300 dark:hover:border-orange-700'
                                                                }`}
                                                        >
                                                            <span className="font-medium">{option.name}</span>
                                                            {option.priceModifier > 0 && (
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">+¥{option.priceModifier}</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            {t('product_quantity')}
                                        </span>
                                        <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                                            <button
                                                onClick={decrementQuantity}
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <MinusIcon className="w-5 h-5" />
                                            </button>
                                            <span className="font-bold text-xl w-8 text-center text-gray-900 dark:text-gray-100">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={incrementQuantity}
                                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total & Add to Cart */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('cart_subtotal')}</p>
                                            <p className="text-2xl font-bold text-orange-600">
                                                ¥{(calculateTotal() * quantity).toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!isValidSelection()}
                                            className="flex-1 max-w-xs bg-orange-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-700 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('btn_add_to_cart')}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
