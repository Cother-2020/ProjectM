import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = "https://placehold.co/400x300?text=Food";

export default function ProductFormModal({ isOpen, onClose, product, categories, onSuccess }) {
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
                    categoryId: product.categoryId
                });
                setPreviewUrl(product.imageUrl);
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    imageUrl: DEFAULT_IMAGE,
                    availableTime: 'ALL',
                    categoryId: categories.length > 0 ? categories[0].id : ''
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
            toast.error("Please create or select a category first.");
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
                    toast.error("Image upload failed, using previous image");
                }
            }

            const productData = { ...formData, imageUrl: finalImageUrl };

            if (product) {
                await axios.put(`/api/products/${product.id}`, productData);
                toast.success("Dish updated successfully");
            } else {
                await axios.post('/api/products', productData);
                toast.success("Dish added successfully");
            }
            onSuccess();
            onClose();
        } catch (e) {
            toast.error('Failed to save product: ' + (e.response?.data?.error || e.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-lg">
                    <div className="bg-white px-8 pb-8 pt-6">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"><XMarkIcon className="w-5 h-5" /></button>
                        <h2 className="text-2xl font-bold mb-6 font-heading text-gray-900">{product ? 'Edit Dish' : 'New Dish'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Spicy Chicken Burger" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all" rows="2"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe ingredients and taste..." />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all" required
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all" required
                                        value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Availability</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                    value={formData.availableTime}
                                    onChange={e => setFormData({ ...formData, availableTime: e.target.value })}
                                >
                                    <option value="ALL">All Day</option>
                                    <option value="BREAKFAST">Breakfast Only</option>
                                    <option value="LUNCH">Lunch Only</option>
                                    <option value="DINNER">Dinner Only</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Food Image</label>
                                <div className="flex items-center gap-4 p-3 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                    <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden relative shadow-sm">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <PhotoIcon className="w-8 h-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-orange-100 file:text-orange-700
                                                hover:file:bg-orange-200
                                                cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-400 mt-2">Recommended: 800x600px</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                {isSaving ? 'Saving...' : 'Save Dish'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
