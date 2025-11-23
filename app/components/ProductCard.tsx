'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number | null;
    stock: number;
    category: string;
    image_url: string;
    is_featured: number;
    discount_percentage: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Evitar navegación al hacer clic en el botón
        e.stopPropagation();
        addToCart(product, 1);
        // Opcional: Feedback visual
    };

    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full border border-gray-100 flex flex-col relative">
                
                {/* Imagen y Badges */}
                <div className="relative h-36 p-2 bg-white flex items-center justify-center overflow-hidden group-hover:brightness-[1.02] transition-all">
                    {product.image_url ? (
                        <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain mix-blend-multiply" 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {product.discount_percentage > 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                            {product.discount_percentage}% OFF
                        </div>
                    )}

                    {/* Badge 'Agotado' */}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                            <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">AGOTADO</span>
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div className="p-3 flex-1 flex flex-col border-t border-gray-50">
                    {/* Nombre - MÁS GRANDE */}
                    <h3 className="text-gray-900 font-bold text-[15px] leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Precios - Sin mt-auto para evitar hueco */}
                    <div className="mt-2 space-y-0.5">
                        {/* Precio Original */}
                        {product.original_price ? (
                            <div className="text-[11px] text-gray-400 line-through decoration-gray-400 h-3">
                                ${product.original_price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                            </div>
                        ) : (
                            <div className="h-3"></div>
                        )}
                        
                        {/* Precio Actual */}
                        <div className="flex items-end justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">
                                    ${product.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-[10px] text-green-600 font-semibold mt-0.5">
                                    Envío gratis mañana
                                </span>
                            </div>
                            
                            {/* Botón Carrito */}
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="text-primary hover:bg-blue-50 p-1.5 rounded-full transition-colors mb-1"
                                title="Agregar al carrito"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
