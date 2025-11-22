'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { products as featuredProducts, categories } from './data/products';
import PaymentStrip from './components/PaymentStrip';

export default function HomePage() {
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('Todos');
  const [currentSlide, setCurrentSlide] = useState(0);

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
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-background font-sans text-sm text-foreground">
      {/* Header Estilo Amazon */}
      <header className="bg-foreground text-white sticky top-0 z-50">
        {/* Top Bar */}
        <div className="container-fluid h-16 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors">
            <div className="font-bold text-2xl tracking-tight">HUV</div>
            <div className="text-xs mt-1 text-primary font-bold">Medical</div>
          </div>

          {/* Location (Optional but adds to Amazon feel) */}
          <div className="hidden md:flex flex-col text-xs cursor-pointer hover:bg-white/10 p-2 rounded leading-tight transition-colors">
            <span className="text-gray-300">Enviar a</span>
            <span className="font-bold">Hospital Central</span>
          </div>

          {/* Search Bar (Dominant) */}
          <div className="flex-1 flex h-10 rounded overflow-hidden focus-within:ring-2 focus-within:ring-primary bg-white">
            <select
              id="search-department"
              name="department"
              aria-label="Seleccionar departamento"
              className="bg-gray-100 text-gray-600 text-xs px-2 border-r border-gray-300 focus:outline-none cursor-pointer hover:bg-gray-200"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option>Todos</option>
              <option>Equipos</option>
              <option>Insumos</option>
            </select>
            <input
              type="text"
              id="search-query"
              name="q"
              autoComplete="off"
              aria-label="Buscar productos"
              className="flex-1 px-4 text-foreground focus:outline-none"
              placeholder="Buscar productos, marcas y más..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-primary hover:bg-primary-dark px-5 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Account & Orders */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:flex flex-col text-xs cursor-pointer hover:bg-white/10 p-2 rounded leading-tight transition-colors">
              <span className="text-gray-300">Hola, Identifícate</span>
              <span className="font-bold">Cuenta y Listas</span>
            </Link>

            <div className="hidden md:flex flex-col text-xs cursor-pointer hover:bg-white/10 p-2 rounded leading-tight transition-colors">
              <span className="text-gray-300">Devoluciones</span>
              <span className="font-bold">y Pedidos</span>
            </div>

            {/* Cart */}
            <div className="flex items-end cursor-pointer hover:bg-white/10 p-2 rounded relative transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-bold text-primary text-lg leading-none mb-3">{cartCount}</span>
              <span className="font-bold text-xs mb-1 ml-1 hidden md:inline">Carrito</span>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-gray-800 h-10 flex items-center px-4 text-sm gap-6 overflow-x-auto hide-scrollbar">
          <button className="flex items-center gap-1 font-bold hover:bg-white/10 px-2 py-1 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Todo
          </button>
          {categories.slice(0, 6).map((cat) => (
            <a key={cat} href="#" className="whitespace-nowrap hover:bg-white/10 px-2 py-1 rounded transition-colors">{cat}</a>
          ))}
          <a href="#" className="whitespace-nowrap hover:bg-white/10 px-2 py-1 rounded font-bold text-primary transition-colors">Ofertas del Día</a>
        </div>
      </header>

      <main className="bg-[#EBEBEB] pb-12 min-h-screen">
        {/* Gradient Background Top */}
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#FFF059]/20 to-[#EBEBEB] -z-0"></div>

        <div className="container-fluid relative z-10 pt-6">
          {/* Hero Slider (Rounded) */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 group relative">
            <div className="relative h-[340px] md:h-[400px] w-full">
              {/* Slides */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-12 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                      {slide.subtitle}
                    </p>
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded w-fit transition-colors animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows (Minimalist & Hover Only) */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-2"
                aria-label="Anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-2"
                aria-label="Siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
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
            </div>
          </div>

          {/* Payment Strip */}
          <div className="mb-12">
            <PaymentStrip />
          </div>

          {/* Ofertas Section */}
          <div className="mb-8">
            <div className="flex items-end gap-4 mb-4">
              <h2 className="text-2xl text-gray-600 font-light">Ofertas</h2>
              <a href="#" className="text-primary text-sm hover:underline mb-1">Ver todas</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
                  <div className="h-48 border-b border-gray-50 p-4 flex items-center justify-center relative">
                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-primary hover:bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-gray-900 text-sm font-light line-clamp-2 mb-2 h-10">
                      {product.name}
                    </h3>

                    <div className="mb-1">
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice.toLocaleString('es-ES')}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl text-gray-900 font-normal">${product.price.toLocaleString('es-ES')}</span>
                      <span className="text-sm text-green-600 font-medium">{product.discount}% OFF</span>
                    </div>

                    <div className="text-xs text-green-600 font-bold mb-1">
                      Llega gratis mañana
                    </div>

                    <div className="text-xs text-gray-500">
                      en 36x $ {(product.price / 36).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </div>

                    {product.isFeatured && (
                      <div className="mt-2">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                          MÁS VENDIDO
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Grid (Mercado Libre Style) */}
          <div className="mb-12">
            <h2 className="text-2xl text-gray-600 font-light mb-4">Categorías populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="bg-white rounded shadow-sm p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer h-32 text-center">
                  <div className="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">{cat}</span>
                </div>
              ))}
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
