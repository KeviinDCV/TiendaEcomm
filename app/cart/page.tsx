'use client';

import { useCart } from '@/contexts/CartContext';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12">
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito de HUV está vacío</h1>
                        <p className="text-gray-500 mb-6">Explora nuestros equipos médicos y encuentra lo que necesitas.</p>
                        <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-block">
                            Ir a comprar
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-light text-gray-800 mb-6">Carrito de Compras</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <div className="relative w-32 h-32 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center">
                                        {item.image_url ? (
                                            <Image 
                                                src={item.image_url} 
                                                alt={item.name} 
                                                fill 
                                                className="object-contain p-2 mix-blend-multiply" 
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                                                <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <p className="text-lg font-bold text-gray-900 whitespace-nowrap ml-4">
                                                ${(item.price * item.quantity).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Precio unitario: ${item.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-lg h-9">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 text-gray-600 hover:bg-gray-100 h-full rounded-l-lg transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-medium text-gray-800 text-sm">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 text-gray-600 hover:bg-gray-100 h-full rounded-r-lg transition-colors"
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={clearCart}
                                className="text-gray-500 text-sm hover:text-red-600 transition-colors"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} productos)</span>
                                    <span>${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className="text-green-600">Gratis</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-xl text-gray-900">
                                    <span>Total</span>
                                    <span>${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>

                            <Link 
                                href="/checkout"
                                className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-sm"
                            >
                                Proceder al Pago
                            </Link>
                            
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                                <svg className="h-8" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visa"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#fff"/><path d="M27.8 19.2h-1.9c-.7 0-1.2-.2-1.4-1.1L23 10.7l-1.7 8.6h-2L22 7.3h2.1l3.7 11.9zM13.4 12.5c0-1.7 1.6-2.5 2.8-3.1 1-.5 1.4-.8 1.4-1.3 0-.4-.5-.7-1.5-.7-1.4 0-2.4.4-3.3.9l-.6-1.6c1.1-.5 2.6-.9 4.2-.9 2.7 0 4.5 1.3 4.5 3.4 0 2.7-3.7 2.8-3.7 4 0 .4.4.6 1.4.7.6 0 1-.1 1.6-.3l.5 1.6c-.7.3-1.7.6-2.9.6-2.9 0-4.4-1.4-4.4-3.3zM10 7.3l-2 9.7h-2L4.4 8.7c-.2-.8-.7-1.3-1.4-1.7L2.4 6.8h3.2c.8 0 1.5.5 1.7 1.4l1.5 7 2.4-7.9h2.2zM34.4 17l-1.6-7.7c-.1-.4-.2-.6-.6-.6h-2.2l2.9 10.6h2.2L38 7.3h-2.1l-1.5 9.7z" fill="#1434cb"/></svg>
                                <svg className="h-8" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#fff"/><path d="M13.5 12c0 3.7 2.2 6.9 5.4 8.6-2.2 1.2-4.8 1.9-7.5 1.9C5.1 22.5 0 17.3 0 11.2S5.1 0 11.4 0c2.7 0 5.3.7 7.5 1.9-3.2 1.7-5.4 4.9-5.4 8.6v1.5z" fill="#eb001b"/><path d="M38 11.2C38 17.3 32.9 22.5 26.6 22.5c-2.6 0-5-.7-7.1-1.9 3.2-1.7 5.4-4.9 5.4-8.6s-2.2-6.9-5.4-8.6c2.1-1.2 4.5-1.9 7.1-1.9C32.9 0 38 5.1 38 11.2z" fill="#f79e1b"/><path d="M24.9 12c0 3.7-2.2 6.9-5.4 8.6-3.2-1.7-5.4-4.9-5.4-8.6s2.2-6.9 5.4-8.6c3.2 1.7 5.4 4.9 5.4 8.6z" fill="#ff5f00"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
