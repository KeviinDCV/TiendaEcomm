'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PaymentStrip from '../components/PaymentStrip';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

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

export default function OfertasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        // Fetch all offers (limit -1)
        const res = await fetch('/api/products/ofertas?limit=-1');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading offers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  return (
    <div className="min-h-screen bg-[#EBEBEB] font-sans text-sm text-foreground">
      <Navbar />

      <main className="pb-12">
        {/* Banner Ofertas */}
        <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="container-fluid py-8">
                <h1 className="text-3xl font-light text-gray-800 mb-2">Grandes descuentos en equipamiento médico</h1>
                <p className="text-gray-500">Aprovecha precios especiales por tiempo limitado.</p>
            </div>
        </div>

        <div className="container-fluid">
            {/* Payment Strip */}
            <div className="mb-8">
                <PaymentStrip />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div key={i} className="bg-white rounded-md shadow-sm h-[260px] animate-pulse">
                            <div className="h-40 bg-gray-200"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl text-gray-600 font-medium mb-2">No hay ofertas disponibles</h3>
                    <p className="text-gray-500">Revisa más tarde para ver nuevos descuentos.</p>
                    <Link href="/" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                        Volver al inicio
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="h-[260px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container-fluid text-center">
            <p className="text-gray-500 text-sm">&copy; 2025 HUV Medical Inc. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
