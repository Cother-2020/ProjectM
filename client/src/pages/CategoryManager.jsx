import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "ProjectM - Category Manager";
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (e) {
            console.error(e);
            console.error(e);
            toast.error("Failed to load categories");
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
            toast.success("Category created");
        } catch (e) {
            toast.error("Failed to create category");
        }
    };

    const handleDelete = async (id, name, productCount) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await axios.delete(`/api/categories/${id}`);
            fetchCategories();
            toast.success("Category deleted");
        } catch (e) {
            // Check if it's the specific safe-delete error
            if (e.response?.status === 400 && e.response?.data?.requiresForce) {
                const count = e.response.data.count;
                if (confirm(`⚠️ WARNING: This category contains ${count} dishes.\n\nDeleting it will PERMANENTLY DELETE all those dishes too.\n\nAre you absolutely sure you want to proceed?`)) {
                    try {
                        // Retry with force=true
                        await axios.delete(`/api/categories/${id}?force=true`);
                        fetchCategories();
                        toast.success("Category force deleted");
                    } catch (retryErr) {
                        toast.error("Failed to force delete: " + retryErr.message);
                    }
                }
            } else {
                const msg = e.response?.data?.error || "Failed to delete category";
                toast.error(msg);
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading categories...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Category Management</h1>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Appetizers"
                        className="flex-1 border rounded-lg px-4 py-2"
                    />
                    <button
                        type="submit"
                        disabled={!newCategory.trim()}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Add Category
                    </button>
                </form>
            </div>

            <div className="grid gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100">
                        <div>
                            <span className="font-semibold text-lg text-gray-800">{cat.name}</span>
                            <span className="ml-3 text-sm text-gray-400">
                                {cat.products?.length || 0} items
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {/* Future: Edit button */}
                            <button
                                onClick={() => handleDelete(cat.id, cat.name, cat.products?.length || 0)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Delete Category"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
