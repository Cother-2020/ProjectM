import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from '../context/LanguageContext';

const DEFAULT_IMAGE = "https://placehold.co/400x300?text=Food";

export default function ProductFormModal({ isOpen, onClose, product, categories, onSuccess }) {
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: DEFAULT_IMAGE,
        availableTime: 'ALL',
        categoryId: ''
    });

    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null);
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    imageUrl: product.imageUrl || DEFAULT_IMAGE,
                    availableTime: product.availableTime || 'ALL',
                    categoryId: product.categoryId,
                    optionGroups: product.optionGroups || []
                });
                setPreviewUrl(product.imageUrl);
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    imageUrl: DEFAULT_IMAGE,
                    availableTime: 'ALL',
                    categoryId: categories.length > 0 ? categories[0].id : '',
                    optionGroups: []
                });
                setPreviewUrl('');
            }
        }
    }, [isOpen, product, categories]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.categoryId) {
            toast.error(t('dish_form_category_required'));
            return;
        }

        setIsSaving(true);
        try {
            let finalImageUrl = formData.imageUrl;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('image', selectedFile);

                try {
                    const uploadRes = await axios.post('/api/upload', uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    finalImageUrl = uploadRes.data.imageUrl;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error(t('dish_form_upload_failed'));
                }
            }

            const productData = { ...formData, imageUrl: finalImageUrl };

            if (product) {
                await axios.put(`/api/products/${product.id}`, productData);
                toast.success(t('dish_form_updated_success'));
            } else {
                await axios.post('/api/products', productData);
                toast.success(t('dish_form_added_success'));
            }
            onSuccess();
            onClose();
        } catch (e) {
            toast.error(t('dish_form_save_failed') + ': ' + (e.response?.data?.error || e.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 w-full max-w-lg">
                    <div className="bg-white dark:bg-gray-800 px-8 pb-8 pt-6">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 font-heading text-gray-900 dark:text-gray-100">
                            {product ? t('dish_form_title_edit') : t('dish_form_title_new')}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('dish_form_name')}</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('dish_form_name_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('dish_form_description')}</label>
                                <textarea
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                    rows="2"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder={t('dish_form_description_placeholder')}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('dish_form_price')}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder={t('dish_form_price_placeholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('dish_form_category')}</label>
                                    <select
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                        required
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="" disabled>{t('dish_form_category_select')}</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('dish_form_availability')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, availableTime: 'ALL' }));
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${formData.availableTime === 'ALL'
                                            ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {t('dish_form_all_day')}
                                    </button>
                                    {['BREAKFAST', 'LUNCH', 'DINNER'].map((time) => {
                                        const isSelected = formData.availableTime !== 'ALL' && formData.availableTime.split(',').includes(time);
                                        const timeLabels = {
                                            'BREAKFAST': t('dish_form_breakfast'),
                                            'LUNCH': t('dish_form_lunch'),
                                            'DINNER': t('dish_form_dinner')
                                        };
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => {
                                                        const current = prev.availableTime === 'ALL' ? [] : prev.availableTime.split(',');
                                                        let newTimes;
                                                        if (current.includes(time)) {
                                                            newTimes = current.filter(t => t !== time);
                                                            if (newTimes.length === 0) newTimes = ['ALL'];
                                                        } else {
                                                            newTimes = [...current, time];
                                                        }
                                                        return { ...prev, availableTime: newTimes.join(',') };
                                                    });
                                                }}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isSelected
                                                    ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                {timeLabels[time]}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('dish_form_availability_hint')}</p>
                            </div>

                            {/* Modifiers Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('dish_form_modifiers_title')}</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                optionGroups: [
                                                    ...(prev.optionGroups || []),
                                                    { name: '', minSelect: 0, maxSelect: 1, options: [{ name: '', priceModifier: 0 }] }
                                                ]
                                            }));
                                        }}
                                        className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 px-3 py-1 rounded-full font-medium transition-colors"
                                    >
                                        {t('dish_form_add_group')}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.optionGroups?.map((group, gIndex) => (
                                        <div key={gIndex} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                                            <div className="flex gap-3 mb-3">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder={t('dish_form_group_name_placeholder')}
                                                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        value={group.name}
                                                        onChange={e => {
                                                            const newGroups = [...formData.optionGroups];
                                                            newGroups[gIndex].name = e.target.value;
                                                            setFormData({ ...formData, optionGroups: newGroups });
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newGroups = formData.optionGroups.filter((_, i) => i !== gIndex);
                                                        setFormData({ ...formData, optionGroups: newGroups });
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex gap-4 mb-3 text-xs text-gray-600 dark:text-gray-400">
                                                <label className="flex items-center gap-2">
                                                    {t('dish_form_required')}
                                                    <select
                                                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        value={group.minSelect}
                                                        onChange={e => {
                                                            const newGroups = [...formData.optionGroups];
                                                            newGroups[gIndex].minSelect = parseInt(e.target.value);
                                                            setFormData({ ...formData, optionGroups: newGroups });
                                                        }}
                                                    >
                                                        <option value={0}>{t('dish_form_optional')}</option>
                                                        <option value={1}>{t('dish_form_required_yes')}</option>
                                                    </select>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    {t('dish_form_selection')}
                                                    <select
                                                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        value={group.maxSelect}
                                                        onChange={e => {
                                                            const newGroups = [...formData.optionGroups];
                                                            newGroups[gIndex].maxSelect = parseInt(e.target.value);
                                                            setFormData({ ...formData, optionGroups: newGroups });
                                                        }}
                                                    >
                                                        <option value={1}>{t('dish_form_single_select')}</option>
                                                        <option value={5}>{t('dish_form_multi_select')}</option>
                                                    </select>
                                                </label>
                                            </div>

                                            <div className="space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600">
                                                {group.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            placeholder={t('dish_form_option_name_placeholder')}
                                                            className="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            value={option.name}
                                                            onChange={e => {
                                                                const newGroups = [...formData.optionGroups];
                                                                newGroups[gIndex].options[oIndex].name = e.target.value;
                                                                setFormData({ ...formData, optionGroups: newGroups });
                                                            }}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder={t('dish_form_price_modifier_placeholder')}
                                                            className="w-20 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            value={option.priceModifier}
                                                            onChange={e => {
                                                                const newGroups = [...formData.optionGroups];
                                                                newGroups[gIndex].options[oIndex].priceModifier = e.target.value;
                                                                setFormData({ ...formData, optionGroups: newGroups });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newGroups = [...formData.optionGroups];
                                                                newGroups[gIndex].options = newGroups[gIndex].options.filter((_, i) => i !== oIndex);
                                                                setFormData({ ...formData, optionGroups: newGroups });
                                                            }}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newGroups = [...formData.optionGroups];
                                                        newGroups[gIndex].options.push({ name: '', priceModifier: 0 });
                                                        setFormData({ ...formData, optionGroups: newGroups });
                                                    }}
                                                    className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                                                >
                                                    {t('dish_form_add_option')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!formData.optionGroups || formData.optionGroups.length === 0) && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic py-2">{t('dish_form_no_modifiers')}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('dish_form_image')}</label>
                                <div className="flex items-center gap-4 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                                    <div className="w-20 h-20 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden relative shadow-sm">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <PhotoIcon className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-orange-100 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-300
                                                hover:file:bg-orange-200 dark:hover:file:bg-orange-900/50
                                                cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('dish_form_image_hint')}</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                {isSaving ? t('dish_form_saving') : t('dish_form_save')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
