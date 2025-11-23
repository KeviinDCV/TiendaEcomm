'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: number;
  name: string;
}

export default function Navbar() {
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('Todos');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();

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

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowAllCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-foreground text-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="container-fluid h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors">
          <div className="font-bold text-2xl tracking-tight">HUV</div>
          <div className="text-xs mt-1 text-primary font-bold">Medical</div>
        </Link>

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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden md:flex flex-col text-xs cursor-pointer hover:bg-white/10 p-2 rounded leading-tight transition-colors"
              >
                <span className="text-gray-300">Hola, {user.name.split(' ')[0]}</span>
                <span className="font-bold flex items-center gap-1">
                  Cuenta y Listas
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500">Conectado como</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  {user.role === 'administrador' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="block px-4 py-2 text-sm text-primary hover:bg-gray-50 font-medium border-b border-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      ⚡ Panel Administrativo
                    </Link>
                  )}

                  {user.role !== 'administrador' && (
                    <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                    >
                        Mi cuenta
                    </Link>
                  )}
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Mis pedidos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex flex-col text-xs cursor-pointer hover:bg-white/10 p-2 rounded leading-tight transition-colors">
              <span className="text-gray-300">Hola, Identifícate</span>
              <span className="font-bold">Cuenta y Listas</span>
            </Link>
          )}

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
      <div className="bg-gray-800 h-10 flex items-center px-4 text-sm gap-6 overflow-visible relative">
        <div ref={categoryDropdownRef} className="relative">
          <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-1 font-bold hover:bg-white/10 px-2 py-1 rounded transition-colors"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Todo
          </button>

          {/* Dropdown Menu */}
          {showAllCategories && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white text-gray-800 shadow-xl rounded-md border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 mb-2">
                      <h3 className="font-bold text-lg">Categorías</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                      {loadingCategories ? (
                          <div className="px-4 py-2 text-gray-500">Cargando...</div>
                      ) : categories.length > 0 ? (
                          categories.map((cat) => (
                              <Link 
                                  key={cat.id} 
                                  href={`/category/${cat.id}`}
                                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                  onClick={() => setShowAllCategories(false)}
                              >
                                  {cat.name}
                              </Link>
                          ))
                      ) : (
                          <div className="px-4 py-2 text-gray-500">No hay categorías</div>
                      )}
                  </div>
              </div>
          )}
        </div>

        <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
          {loadingCategories ? (
              [1,2,3,4,5].map(i => (
                  <div key={i} className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
              ))
          ) : (
              categories.slice(0, 6).map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.id}`} className="whitespace-nowrap hover:bg-white/10 px-2 py-1 rounded transition-colors">
                      {cat.name}
                  </Link>
              ))
          )}
        </div>
        <Link href="/ofertas" className="whitespace-nowrap hover:bg-white/10 px-2 py-1 rounded font-bold text-primary transition-colors ml-auto">Ofertas del Día</Link>
      </div>
    </header>
  );
}
