'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

import PaymentStrip from './components/PaymentStrip';
import Navbar from './components/Navbar';

interface Category {
  id: number;
  name: string;
}

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

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  image_url: string;
  link_url: string;
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const ofertasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error loading categories', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners');
            const data = await res.json();
            if (data.success) {
                setBanners(data.banners);
            }
        } catch (error) {
            console.error('Error loading banners', error);
        } finally {
            setLoadingBanners(false);
        }
    };

    fetchCategories();
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products/ofertas');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading products', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Close dropdown when clicking outside - REMOVED (Navbar handles it)

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600',
      title: 'TECNOLOGÍA MÉDICA',
      subtitle: 'Equipa tu hospital con lo mejor',
      buttonText: 'Ver Ofertas'
    },
    {
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600',
      title: 'EQUIPOS DE DIAGNÓSTICO',
      subtitle: 'Precisión y confiabilidad garantizadas',
      buttonText: 'Explorar Catálogo'
    },
    {
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600',
      title: 'OFERTAS ESPECIALES',
      subtitle: 'Hasta 20% de descuento en equipos seleccionados',
      buttonText: 'Ver Promociones'
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const scrollOfertas = (direction: 'left' | 'right') => {
    if (ofertasRef.current) {
        const { current } = ofertasRef;
        const scrollAmount = 300; // Ancho aproximado de una card + gap
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-sm text-foreground">
      <Navbar />

      <main className="bg-[#EBEBEB] pb-12 min-h-screen">
        {/* Gradient Background Top */}
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#FFF059]/20 to-[#EBEBEB] -z-0"></div>

        <div className="container-fluid relative z-10 pt-6">
          {/* Hero Slider (Rounded) */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 group relative">
            <div className="relative h-[340px] md:h-[400px] w-full">
              {loadingBanners ? (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
                      Cargando banners...
                  </div>
              ) : banners.length > 0 ? (
                  <>
                    {/* Slides */}
                    {banners.map((slide, index) => (
                        <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                        >
                        <Image
                            src={slide.image_url}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-12 text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
                            {slide.title}
                            </h2>
                            {slide.subtitle && (
                                <p className="text-lg md:text-xl mb-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                                {slide.subtitle}
                                </p>
                            )}
                            {slide.button_text && (
                                <Link href={slide.link_url || '#'} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded w-fit transition-colors animate-in fade-in slide-in-from-left-4 duration-700 delay-300 inline-block">
                                {slide.button_text}
                                </Link>
                            )}
                        </div>
                        </div>
                    ))}

                    {/* Navigation Arrows (Minimalist & Hover Only) */}
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-2"
                        aria-label="Anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-2"
                        aria-label="Siguiente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Ir a slide ${index + 1}`}
                        />
                        ))}
                    </div>
                  </>
              ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      Sin banners configurados
                  </div>
              )}
            </div>
          </div>

          {/* Payment Strip */}
          <div className="mb-12">
            <PaymentStrip />
          </div>

          {/* Ofertas Section */}
          <div className="mb-8 relative group/ofertas">
            <div className="flex items-end gap-4 mb-4 px-1">
              <h2 className="text-2xl text-gray-600 font-light">Ofertas</h2>
              <Link href="/ofertas" className="text-primary text-sm hover:underline mb-1">Ver todas</Link>
            </div>

            {/* Navigation Buttons */}
            {!loadingProducts && products.length > 4 && (
                <>
                    <button 
                        onClick={() => scrollOfertas('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2 text-gray-600 opacity-0 group-hover/ofertas:opacity-100 transition-all hover:scale-110 hover:bg-gray-50 hidden md:block"
                        aria-label="Anterior oferta"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => scrollOfertas('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2 text-gray-600 opacity-0 group-hover/ofertas:opacity-100 transition-all hover:scale-110 hover:bg-gray-50 hidden md:block"
                        aria-label="Siguiente oferta"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-md shadow-sm h-80 animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
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
                <h3 className="text-xl text-gray-600 font-medium mb-2">No hay productos en oferta</h3>
                <p className="text-gray-500">Por el momento no tenemos productos con descuento disponibles.</p>
              </div>
            ) : (
              <div 
                ref={ofertasRef}
                className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar scroll-smooth snap-x snap-mandatory"
              >
                {products.map((product) => (
                  <div key={product.id} className="min-w-[280px] max-w-[280px] md:min-w-[260px] md:max-w-[260px] bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col snap-start">
                    <div className="h-48 border-b border-gray-50 p-4 flex items-center justify-center relative">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-primary hover:bg-blue-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-gray-900 text-sm font-light line-clamp-2 mb-2 h-10">
                        {product.name}
                      </h3>

                      {product.original_price && (
                        <div className="mb-1">
                          <span className="text-xs text-gray-400 line-through">${product.original_price.toLocaleString('es-CO')}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl text-gray-900 font-normal">${product.price.toLocaleString('es-CO')}</span>
                        {product.discount_percentage > 0 && (
                          <span className="text-sm text-green-600 font-medium">{product.discount_percentage}% OFF</span>
                        )}
                      </div>

                      <div className="text-xs text-green-600 font-bold mb-1">
                        Llega gratis mañana
                      </div>

                      <div className="text-xs text-gray-500">
                        en 36x $ {(product.price / 36).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                      </div>

                      {product.is_featured === 1 && (
                        <div className="mt-2">
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            MÁS VENDIDO
                          </span>
                        </div>
                      )}
                      
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="mt-2">
                          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            ¡Solo quedan {product.stock}!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Grid (Mercado Libre Style) */}
          <div className="mb-12">
            <h2 className="text-2xl text-gray-600 font-light mb-4">Categorías populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {loadingCategories ? (
                [1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded shadow-sm p-4 h-32 animate-pulse"></div>
                ))
              ) : (
                categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.id}`} className="bg-white rounded shadow-sm p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer h-32 text-center group">
                        <div className="text-primary group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">{cat.name}</span>
                    </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Corporate) */}
      <footer className="bg-gray-800 text-white pt-12 pb-8 text-sm">
        <div className="container-fluid text-center mb-8">
          <a href="#" className="text-xs hover:underline px-4 border-r border-gray-600">Inicio</a>
          <a href="#" className="text-xs hover:underline px-4 border-r border-gray-600">Mi Cuenta</a>
          <a href="#" className="text-xs hover:underline px-4 border-r border-gray-600">Pedidos</a>
          <a href="#" className="text-xs hover:underline px-4">Ayuda</a>
        </div>

        <div className="container-fluid grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-4">Conócenos</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">Trabajar en HUV</a></li>
              <li><a href="#" className="hover:underline">Blog Corporativo</a></li>
              <li><a href="#" className="hover:underline">Acerca de HUV</a></li>
              <li><a href="#" className="hover:underline">Relaciones con Inversionistas</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Gana Dinero con Nosotros</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">Vender en HUV</a></li>
              <li><a href="#" className="hover:underline">Programa de Afiliados</a></li>
              <li><a href="#" className="hover:underline">Anuncia tus Productos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Métodos de Pago</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">Tarjetas de Crédito/Débito</a></li>
              <li><a href="#" className="hover:underline">Transferencia Bancaria</a></li>
              <li><a href="#" className="hover:underline">Financiamiento HUV</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Ayuda</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">Rastrea tu Pedido</a></li>
              <li><a href="#" className="hover:underline">Devoluciones y Reemplazos</a></li>
              <li><a href="#" className="hover:underline">Soporte Técnico</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <div className="font-bold text-2xl mb-2">HUV</div>
          <p className="text-xs text-gray-400">&copy; 2025 HUV Medical Inc. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
