'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: number;
    original_price: number | null;
    stock: number;
    category: string;
    image_url: string;
    is_featured: number;
    discount_percentage: number;
}

interface SectionConfig {
    category?: string;
    limit?: number;
    sortBy?: string;
}

interface SectionProps {
    title: string;
    config: string; // JSON string
    excludeId?: number;
}

export default function ProductSection({ title, config, excludeId }: SectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Parse config
    const sectionConfig: SectionConfig = JSON.parse(config || '{}');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams();
                if (sectionConfig.category) params.append('category', sectionConfig.category);
                // Fetch a few more if we are going to filter one out
                const limit = (sectionConfig.limit || 4) + (excludeId ? 1 : 0);
                params.append('limit', limit.toString());
                if (sectionConfig.sortBy) params.append('sortBy', sectionConfig.sortBy);

                const res = await fetch(`/api/products?${params.toString()}`);
                const data = await res.json();
                if (data.success) {
                    let fetchedProducts = data.products as Product[];
                    if (excludeId) {
                        fetchedProducts = fetchedProducts.filter(p => p.id !== excludeId);
                    }
                    // Limit again to the original requested amount after filtering
                    setProducts(fetchedProducts.slice(0, sectionConfig.limit || 4));
                }
            } catch (error) {
                console.error('Error fetching section products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [config, excludeId]);

    if (!loading && products.length === 0) return null; // Don't show empty sections

    return (
        <div className="mb-12">
            <div className="flex items-end gap-4 mb-4">
                <h2 className="text-2xl text-gray-600 font-light">{title}</h2>
                {sectionConfig.category && (
                    <Link href={`/category/view?name=${encodeURIComponent(sectionConfig.category)}`} className="text-primary text-sm hover:underline mb-1">Ver más</Link>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-md shadow-sm h-80 animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Link 
                            href={`/product/${product.id}`}
                            key={product.id} 
                            className="bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col group"
                        >
                            <div className="h-48 border-b border-gray-50 p-4 flex items-center justify-center relative">
                                {product.image_url ? (
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name} 
                                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {product.discount_percentage > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                                        -{product.discount_percentage}%
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-gray-900 text-sm font-light line-clamp-2 mb-2 h-10 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>

                                {product.original_price && (
                                    <div className="mb-1">
                                        <span className="text-xs text-gray-400 line-through">${product.original_price.toLocaleString('es-CO')}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl text-gray-900 font-normal">${product.price.toLocaleString('es-CO')}</span>
                                </div>

                                <div className="text-xs text-green-600 font-bold mb-1">
                                    Llega gratis mañana
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
