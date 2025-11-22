'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Category {
    id: number;
    name: string;
}

interface CategorySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = Cookies.get('auth_token');
            const res = await fetch('/api/admin/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCategory.trim()) return;
        try {
            const token = Cookies.get('auth_token');
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ name: newCategory.trim() })
            });
            const data = await res.json();
            
            if (data.success) {
                await fetchCategories();
                onChange(newCategory.trim()); // Seleccionar la nueva
                setNewCategory('');
                setIsCreating(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error al crear categoría');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
        
        try {
            const token = Cookies.get('auth_token');
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                fetchCategories();
                if (categories.find(c => c.id === id)?.name === value) {
                    onChange(''); // Deseleccionar si era la actual
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error al eliminar categoría');
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <select 
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                        disabled={loading}
                    >
                        <option value="">Seleccionar...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={() => setIsCreating(!isCreating)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Nueva Categoría"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                {value && (
                    <button 
                        type="button"
                        onClick={() => {
                            const cat = categories.find(c => c.name === value);
                            if (cat) handleDelete(cat.id);
                        }}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Eliminar Categoría Seleccionada"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-2">
                    <input 
                        type="text" 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nombre de la nueva categoría"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        autoFocus
                    />
                    <button 
                        type="button"
                        onClick={handleCreate}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                    >
                        Guardar
                    </button>
                </div>
            )}
        </div>
    );
}
