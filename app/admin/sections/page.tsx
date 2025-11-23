'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Section {
    id: number;
    title: string;
    type: string;
    config: string; // JSON string from DB
    display_order: number;
    is_active: number;
}

interface Category {
    id: number;
    name: string;
}

export default function SectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'category_grid',
        displayOrder: '0',
        isActive: true,
        config: {
            category: '',
            limit: 4,
            sortBy: 'newest'
        }
    });

    useEffect(() => {
        fetchSections();
        fetchCategories();
    }, []);

    const fetchSections = async () => {
        try {
            const token = Cookies.get('auth_token');
            const res = await fetch('/api/admin/sections', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSections(data.sections);
            }
        } catch (error) {
            console.error('Error loading sections', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error loading categories', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta sección?')) return;

        try {
            const token = Cookies.get('auth_token');
            const res = await fetch(`/api/admin/sections/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchSections();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error al eliminar sección');
        }
    };

    const openModal = (section?: Section) => {
        if (section) {
            setEditingSection(section);
            let parsedConfig = { category: '', limit: 4, sortBy: 'newest' };
            try {
                parsedConfig = JSON.parse(section.config);
                // Ensure sortBy exists for backward compatibility
                if (!parsedConfig.sortBy) parsedConfig.sortBy = 'newest';
            } catch (e) {}

            setFormData({
                title: section.title,
                type: section.type,
                displayOrder: section.display_order.toString(),
                isActive: section.is_active === 1,
                config: parsedConfig
            });
        } else {
            setEditingSection(null);
            setFormData({
                title: '',
                type: 'category_grid',
                displayOrder: '0',
                isActive: true,
                config: {
                    category: categories.length > 0 ? categories[0].name : '',
                    limit: 4,
                    sortBy: 'newest'
                }
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                title: formData.title,
                type: formData.type,
                displayOrder: formData.displayOrder,
                isActive: formData.isActive,
                config: formData.config
            };

            const token = Cookies.get('auth_token');
            const url = editingSection 
                ? `/api/admin/sections/${editingSection.id}`
                : '/api/admin/sections';
            
            const res = await fetch(url, {
                method: editingSection ? 'PUT' : 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                fetchSections();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error al guardar sección');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Secciones</h2>
                <button 
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Sección
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Cargando...</div>
            ) : (
                <div className="space-y-4">
                    {sections.map((section) => {
                        const config = JSON.parse(section.config || '{}');
                        const sortLabels: Record<string, string> = {
                            'newest': 'Más Recientes',
                            'most_viewed': 'Más Vistos',
                            'best_selling': 'Más Vendidos',
                            'highest_rated': 'Mejor Calificados',
                            'price_low': 'Precio: Menor a Mayor',
                            'price_high': 'Precio: Mayor a Menor',
                            'featured': 'Destacados'
                        };
                        return (
                        <div key={section.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-800">{section.title}</h3>
                                    {!section.is_active && (
                                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded">Inactivo</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Categoría: <span className="font-medium">{config.category || 'N/A'}</span> • 
                                    Límite: <span className="font-medium">{config.limit || 0}</span> • 
                                    Orden: <span className="font-medium">{section.display_order}</span>
                                </p>
                                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    Ordenamiento: <span className="font-medium">{sortLabels[config.sortBy] || config.sortBy || 'Más Recientes'}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openModal(section)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(section.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        );
                    })}
                    {sections.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No hay secciones configuradas.</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingSection ? 'Editar Sección' : 'Nueva Sección'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título Visible</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ej: Equipos de Monitoreo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sección</label>
                                <select 
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="category_grid">Productos por Categoría (Grilla)</option>
                                    {/* <option value="featured_list">Productos Destacados</option> */}
                                </select>
                            </div>

                            {formData.type === 'category_grid' && (
                                <div className="space-y-4 border-t border-gray-100 pt-4">
                                    <h4 className="font-medium text-gray-800">Configuración</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría a Mostrar</label>
                                        <select 
                                            value={formData.config.category}
                                            onChange={e => setFormData({...formData, config: { ...formData.config, category: e.target.value }})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        >
                                            <option value="">Seleccionar categoría...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Productos</label>
                                        <input 
                                            type="number" 
                                            value={formData.config.limit}
                                            onChange={e => setFormData({...formData, config: { ...formData.config, limit: parseInt(e.target.value) || 4 }})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            min="1"
                                            max="20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar Productos Por</label>
                                        <select 
                                            value={formData.config.sortBy}
                                            onChange={e => setFormData({...formData, config: { ...formData.config, sortBy: e.target.value }})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="newest">Más Recientes</option>
                                            <option value="most_viewed">Más Vistos</option>
                                            <option value="best_selling">Más Vendidos</option>
                                            <option value="highest_rated">Mejor Calificados</option>
                                            <option value="price_low">Precio: Menor a Mayor</option>
                                            <option value="price_high">Precio: Mayor a Menor</option>
                                            <option value="featured">Destacados</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Define cómo se organizan los productos en esta sección
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                                    <input 
                                        type="number" 
                                        value={formData.displayOrder}
                                        onChange={e => setFormData({...formData, displayOrder: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="flex items-center h-full pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isActive}
                                            onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                            className="rounded text-primary focus:ring-primary h-4 w-4"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Sección Activa</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Guardar Sección'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
