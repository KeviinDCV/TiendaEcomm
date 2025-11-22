'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    button_text: string;
    image_url: string;
    link_url: string;
    display_order: number;
    is_active: number;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        linkUrl: '',
        displayOrder: '0',
        isActive: true,
        image: null as File | null,
        imagePreview: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const token = Cookies.get('auth_token');
            const res = await fetch('/api/admin/banners', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBanners(data.banners);
            }
        } catch (error) {
            console.error('Error loading banners', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este banner?')) return;

        try {
            const token = Cookies.get('auth_token');
            const res = await fetch(`/api/admin/banners/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchBanners();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error al eliminar banner');
        }
    };

    const openModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                subtitle: banner.subtitle || '',
                buttonText: banner.button_text || '',
                linkUrl: banner.link_url || '',
                displayOrder: banner.display_order.toString(),
                isActive: banner.is_active === 1,
                image: null,
                imagePreview: banner.image_url
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                buttonText: '',
                linkUrl: '',
                displayOrder: '0',
                isActive: true,
                image: null,
                imagePreview: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('buttonText', formData.buttonText);
            data.append('linkUrl', formData.linkUrl);
            data.append('displayOrder', formData.displayOrder);
            data.append('isActive', String(formData.isActive));
            if (formData.image) {
                data.append('image', formData.image);
            }
            if (editingBanner) {
                data.append('currentImageUrl', editingBanner.image_url);
            }

            const token = Cookies.get('auth_token');
            const url = editingBanner 
                ? `/api/admin/banners/${editingBanner.id}`
                : '/api/admin/banners';
            
            const res = await fetch(url, {
                method: editingBanner ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                fetchBanners();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error al guardar banner');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Banners</h2>
                {banners.length < 7 && (
                    <button 
                        onClick={() => openModal()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Banner
                    </button>
                )}
            </div>

            {banners.length >= 7 && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
                    Has alcanzado el límite máximo de 7 banners. Elimina uno para agregar otro.
                </div>
            )}

            {loading ? (
                <div className="text-center py-10">Cargando...</div>
            ) : (
                <div className="grid gap-6">
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-48 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                                {!banner.is_active && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">INACTIVO</div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-lg text-gray-800">{banner.title}</h3>
                                <p className="text-gray-500 text-sm">{banner.subtitle}</p>
                                <div className="flex gap-2 mt-2 justify-center md:justify-start text-xs text-gray-400">
                                    <span>Orden: {banner.display_order}</span>
                                    <span>•</span>
                                    <span>Botón: {banner.button_text || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openModal(banner)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(banner.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No hay banners configurados.</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingBanner ? 'Editar Banner' : 'Nuevo Banner'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (Requerido)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative hover:bg-gray-50 transition-colors">
                                    {formData.imagePreview ? (
                                        <img src={formData.imagePreview} alt="Preview" className="h-32 mx-auto object-contain" />
                                    ) : (
                                        <div className="text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm">Click para subir imagen</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required={!editingBanner}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ej: TECNOLOGÍA MÉDICA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                                <input 
                                    type="text" 
                                    value={formData.subtitle}
                                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ej: Equipa tu hospital con lo mejor"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Botón</label>
                                    <input 
                                        type="text" 
                                        value={formData.buttonText}
                                        onChange={e => setFormData({...formData, buttonText: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Ej: Ver Ofertas"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Opcional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.linkUrl}
                                        onChange={e => setFormData({...formData, linkUrl: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Ej: /ofertas"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden de Visualización</label>
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
                                        <span className="text-sm font-medium text-gray-700">Banner Activo</span>
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
                                    {saving ? 'Guardando...' : 'Guardar Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
