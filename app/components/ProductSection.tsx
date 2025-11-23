'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

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
            <div className="flex items-end gap-4 mb-4 px-1">
                <h2 className="text-2xl text-gray-600 font-light">{title}</h2>
                {/* FixMe: Ajustar ruta de categoría cuando exista */}
                {sectionConfig.category && (
                    <Link href="#" className="text-primary text-sm hover:underline mb-1">Ver más</Link>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white rounded-md shadow-sm h-[260px] animate-pulse">
                            <div className="h-40 bg-gray-200"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="h-[260px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
