import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useTranslation } from '../context/LanguageContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { CategoryItemSkeleton } from '../components/Skeleton';

export default function CategoryManager() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    // Delete confirm dialog
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        categoryId: null,
        categoryName: '',
        isForceDelete: false,
        count: 0
    });

    useEffect(() => {
        document.title = `ProjectM - ${t('category_title')}`;
        fetchCategories();
    }, [t]);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (e) {
            console.error(e);
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await axios.post('/api/categories', { name: newCategory });
            setNewCategory('');
            fetchCategories();
            toast.success(t('category_created'));
        } catch (e) {
            toast.error(t('category_create_failed'));
        }
    };

    const handleEditStart = (category) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleEditSave = async (id) => {
        if (!editingName.trim()) return;

        try {
            await axios.put(`/api/categories/${id}`, { name: editingName });
            toast.success(t('category_updated'));
            fetchCategories();
            setEditingId(null);
            setEditingName('');
        } catch (e) {
            toast.error(t('category_update_failed'));
        }
    };

    const handleDeleteClick = (category) => {
        setDeleteDialog({
            isOpen: true,
            categoryId: category.id,
            categoryName: category.name,
            isForceDelete: false,
            count: category.products?.length || 0
        });
    };

    const handleDeleteConfirm = async () => {
        const { categoryId, isForceDelete } = deleteDialog;

        try {
            const url = isForceDelete
                ? `/api/categories/${categoryId}?force=true`
                : `/api/categories/${categoryId}`;

            await axios.delete(url);
            fetchCategories();
            toast.success(isForceDelete ? t('category_force_deleted') : t('category_deleted'));
        } catch (e) {
            if (e.response?.status === 400 && e.response?.data?.requiresForce) {
                // Show force delete confirmation
                setDeleteDialog(prev => ({
                    ...prev,
                    isForceDelete: true,
                    count: e.response.data.count
                }));
                return; // Don't close the dialog
            }

            const msg = e.response?.data?.error || t('category_delete_failed');
            toast.error(msg);
        }
    };

    if (isLoading) return (
        <div className="max-w-4xl mx-auto">
            <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8" />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="flex gap-4">
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
            </div>
            <div className="grid gap-4">
                {[1, 2, 3].map(i => <CategoryItemSkeleton key={i} />)}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
                {t('category_title')}
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    {t('category_add_title')}
                </h2>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder={t('category_placeholder')}
                        className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        type="submit"
                        disabled={!newCategory.trim()}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        {t('category_add_button')}
                    </button>
                </form>
            </div>

            <div className="grid gap-4">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex-1">
                            {editingId === cat.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleEditSave(cat.id);
                                            if (e.key === 'Escape') handleEditCancel();
                                        }}
                                    />
                                    <button
                                        onClick={() => handleEditSave(cat.id)}
                                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                                        title={t('category_save')}
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleEditCancel}
                                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                        title={t('cancel')}
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                        {cat.name}
                                    </span>
                                    <span className="ml-3 text-sm text-gray-400 dark:text-gray-500">
                                        {cat.products?.length || 0} {t('category_items_count')}
                                    </span>
                                </div>
                            )}
                        </div>
                        {editingId !== cat.id && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditStart(cat)}
                                    className="text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition"
                                    title={t('category_edit')}
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(cat)}
                                    className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                                    title={t('category_delete')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                        <p>{t('dashboard_no_data')}</p>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, categoryId: null, categoryName: '', isForceDelete: false, count: 0 })}
                onConfirm={handleDeleteConfirm}
                title={deleteDialog.isForceDelete ? t('category_force_delete_title') : t('category_delete_confirm_title')}
                message={
                    deleteDialog.isForceDelete
                        ? t('category_force_delete_msg').replace('{count}', deleteDialog.count)
                        : t('category_delete_confirm_msg')
                }
                confirmText={t('confirm_delete')}
                cancelText={t('confirm_cancel')}
                variant={deleteDialog.isForceDelete ? 'warning' : 'danger'}
            />
        </div>
    );
}
