import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ProductFormModal from '../components/ProductFormModal';
import { useTranslation } from '../context/LanguageContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { MenuItemSkeleton } from '../components/Skeleton';
import ProductImage from '../components/ProductImage';

export default function MenuManager() {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Delete Confirm Dialog State
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, productId: null, productName: '' });

    useEffect(() => {
        document.title = `ProjectM - ${t('menu_manager_title')}`;
        fetchData();
    }, [t]);

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
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product) => {
        setDeleteDialog({
            isOpen: true,
            productId: product.id,
            productName: product.name
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/products/${deleteDialog.productId}`);
            toast.success(t('menu_deleted_success'));
            fetchData();
        } catch (e) {
            toast.error(t('menu_delete_failed'));
        }
    };

    if (isLoading) return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-11 w-36 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-y md:divide-y-0 md:gap-px bg-gray-200 dark:bg-gray-700">
                    {[1, 2, 3, 4].map(i => <MenuItemSkeleton key={i} />)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-800 dark:text-gray-100">
                        {t('menu_manager_title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('menu_manager_subtitle')}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 hover:shadow-lg transition-all active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" /> {t('menu_add_dish')}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {products.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PlusIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{t('menu_no_dishes')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('menu_no_dishes_msg')}</p>
                        <button onClick={() => handleOpenModal()} className="text-orange-600 dark:text-orange-500 font-bold hover:underline">
                            {t('menu_create_dish')}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-y md:divide-y-0 md:gap-px bg-gray-200 dark:bg-gray-700">
                        {products.map(product => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 p-6 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group relative">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                                        <ProductImage
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate pr-2" title={product.name}>
                                                {product.name}
                                            </h3>
                                            <span className="font-bold text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded text-sm">
                                                ¥{product.price}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 h-10">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        {categories.find(c => c.id === product.categoryId)?.name || t('menu_uncategorized')}
                                    </span>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title={t('menu_edit')}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title={t('menu_delete')}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Mobile support for actions since hover doesn't work well */}
                                    <div className="flex gap-2 md:hidden">
                                        <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 dark:text-blue-400">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteClick(product)} className="p-2 text-red-600 dark:text-red-400">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
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

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, productId: null, productName: '' })}
                onConfirm={handleDeleteConfirm}
                title={t('menu_delete_confirm_title')}
                message={t('menu_delete_confirm_msg')}
                confirmText={t('confirm_delete')}
                cancelText={t('confirm_cancel')}
                variant="danger"
            />
        </div>
    );
}
