'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CategorySelector from './CategorySelector';

interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    original_price?: number | null;
    stock: number;
    category: string;
    image_url?: string;
    is_featured: boolean;
    is_active: boolean;
    images?: { id: number; image_url: string; display_order: number }[];
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    // Gestión de imágenes secundarias
    const [secondaryPreviews, setSecondaryPreviews] = useState<{ id?: number; url: string; file?: File }[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        category: '',
        isFeatured: false,
        isActive: true,
        image: null as File | null
    });

    useEffect(() => {
        if (isOpen && product) {
            // Cargar datos básicos
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                originalPrice: product.original_price ? product.original_price.toString() : '',
                stock: product.stock.toString(),
                category: product.category,
                isFeatured: Boolean(product.is_featured),
                isActive: Boolean(product.is_active),
                image: null
            });
            setImagePreview(product.image_url || null);
            
            // Resetear estados de imágenes secundarias
            setSecondaryPreviews([]);
            setDeletedImageIds([]);

            // Fetch detalles completos (imágenes secundarias)
            const fetchProductDetails = async () => {
                try {
                    const token = Cookies.get('auth_token');
                    const res = await fetch(`/api/admin/products/${product.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.product.images) {
                        setSecondaryPreviews(data.product.images.map((img: any) => ({
                            id: img.id,
                            url: img.image_url
                        })));
                    }
                } catch (err) {
                    console.error('Error loading product details:', err);
                }
            };
            fetchProductDetails();

        } else if (isOpen) {
            // Reset form for new product
            setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                stock: '',
                category: '',
                isFeatured: false,
                isActive: true,
                image: null
            });
            setImagePreview(null);
            setSecondaryPreviews([]);
            setDeletedImageIds([]);
        }
        setError('');
    }, [product, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSecondaryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // Validar límite de 10 imágenes totales
            const currentCount = secondaryPreviews.length;
            const newCount = files.length;
            
            if (currentCount + newCount > 10) {
                alert('Máximo 10 imágenes secundarias permitidas');
                return;
            }

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSecondaryPreviews(prev => [...prev, {
                        url: reader.result as string,
                        file: file
                    }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeSecondaryImage = (index: number) => {
        const img = secondaryPreviews[index];
        if (img.id) {
            setDeletedImageIds(prev => [...prev, img.id!]);
        }
        setSecondaryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            if (formData.originalPrice) data.append('originalPrice', formData.originalPrice);
            data.append('stock', formData.stock);
            data.append('category', formData.category);
            data.append('isFeatured', String(formData.isFeatured));
            data.append('isActive', String(formData.isActive));
            
            if (formData.image) {
                data.append('image', formData.image);
            } else if (product?.image_url) {
                data.append('currentImageUrl', product.image_url);
            }

            // Agregar imágenes secundarias nuevas
            secondaryPreviews.forEach(img => {
                if (img.file) {
                    data.append('secondaryImages', img.file);
                }
            });

            // Agregar IDs de imágenes eliminadas
            deletedImageIds.forEach(id => {
                data.append('deletedImageIds', id.toString());
            });

            const token = Cookies.get('auth_token');
            const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
            const method = product ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();

            if (result.success) {
                onSave();
                onClose();
            } else {
                setError(result.message || 'Error al guardar el producto');
            }
        } catch (err) {
            setError('Error de conexión al guardar producto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-800">
                        {product ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 mx-6 mt-6 rounded-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Sección de Imágenes */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Imágenes del Producto</h4>
                        
                        {/* Imagen Principal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Principal (Portada)</label>
                            <div className="flex items-center gap-6">
                                <div className="h-32 w-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative flex-shrink-0 group">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Esta será la imagen principal que se muestra en listados.</p>
                                </div>
                            </div>
                        </div>

                        {/* Imágenes Secundarias */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Galería de Imágenes (Máx 10)
                                <span className="text-xs font-normal text-gray-500 ml-2">{secondaryPreviews.length}/10</span>
                            </label>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {secondaryPreviews.map((img, index) => (
                                    <div key={index} className="relative h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center group overflow-hidden">
                                        <img src={img.url} alt={`Galería ${index}`} className="h-full w-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => removeSecondaryImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            title="Eliminar imagen"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 8.586 5.707 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                
                                {secondaryPreviews.length < 10 && (
                                    <label className="h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-xs text-gray-500 mt-1">Agregar</span>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            className="hidden"
                                            onChange={handleSecondaryImagesChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información Básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Ej: Monitor de Signos Vitales"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original (Antes)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Opcional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Cantidad"
                            />
                        </div>

                        <div>
                            <CategorySelector 
                                value={formData.category}
                                onChange={(value) => setFormData({...formData, category: value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea 
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            placeholder="Detalles técnicos y características..."
                        ></textarea>
                    </div>

                    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                className="rounded text-primary focus:ring-primary h-4 w-4"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Producto Activo (Visible en tienda)</label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                                className="rounded text-primary focus:ring-primary h-4 w-4"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Destacar en página principal</label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : (product ? 'Guardar Cambios' : 'Crear Producto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
