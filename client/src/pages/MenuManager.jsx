import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ProductFormModal from '../components/ProductFormModal';

export default function MenuManager() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        document.title = "ProjectM - Menu Manager";
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/categories')
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (e) {
            console.error("Error fetching data", e);
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this dish?")) return;
        try {
            await axios.delete(`/api/products/${id}`);
            toast.success("Dish deleted");
            fetchData();
        } catch (e) {
            toast.error('Failed to delete');
        }
    };

    if (isLoading) return (
        <div className="p-8 text-center text-gray-500 flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse">Loading menu management...</div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-800">Menu Manager</h1>
                    <p className="text-gray-500 mt-1">Manage your dishes, prices, and availability.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 hover:shadow-lg transition-all active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" /> Add New Dish
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {products.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PlusIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No dishes yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first menu item.</p>
                        <button onClick={() => handleOpenModal()} className="text-orange-600 font-bold hover:underline">Create Dish</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-y md:divide-y-0 md:gap-px bg-gray-200">
                        {products.map(product => (
                            <div key={product.id} className="bg-white p-6 flex flex-col hover:bg-gray-50 transition-colors group relative">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 truncate pr-2" title={product.name}>{product.name}</h3>
                                            <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-sm">${product.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">{product.description}</p>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600">
                                        {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                                    </span>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Mobile support for actions since hover doesn't work well */}
                                    <div className="flex gap-2 md:hidden">
                                        <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                categories={categories}
                onSuccess={fetchData}
            />
        </div>
    );
}
