'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ProductModal from './ProductModal';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number | null;
    stock: number;
    category: string;
    image_url: string;
    is_featured: boolean;
    is_active: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = Cookies.get('auth_token');
            const res = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Ensure types match
                const mappedProducts = data.products.map((p: any) => ({
                    ...p,
                    original_price: p.original_price ? parseFloat(p.original_price) : null,
                    is_featured: Boolean(p.is_featured),
                    is_active: Boolean(p.is_active)
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const token = Cookies.get('auth_token');
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await res.json();
            
            if (data.success) {
                fetchProducts();
            } else {
                alert(data.message || 'Error al eliminar producto');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleModalSave = () => {
        fetchProducts();
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
                <button 
                    onClick={openCreateModal}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Imagen</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    ${new Intl.NumberFormat('es-CO').format(product.price)}
                                    {product.original_price && (
                                        <span className="block text-xs text-gray-400 line-through">
                                            ${new Intl.NumberFormat('es-CO').format(product.original_price)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block w-2 h-2 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-red-500'}`} title={product.is_active ? 'Activo' : 'Inactivo'}></span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => openEditModal(product)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                            title="Editar producto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                            title="Eliminar producto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                product={editingProduct}
            />
        </div>
    );
}
