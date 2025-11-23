'use client';

import { useCart } from '@/contexts/CartContext';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
    const [address, setAddress] = useState({
        fullName: '',
        addressLine: '',
        city: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('card');

    if (items.length === 0 && step !== 'success') {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
                    <Link href="/" className="text-primary hover:underline">Volver a la tienda</Link>
                </div>
            </div>
        );
    }

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearCart();
        setStep('success');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {step === 'success' ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h1>
                        <p className="text-gray-600 mb-8">Hemos recibido tu pedido correctamente. Te enviaremos un correo con los detalles de seguimiento.</p>
                        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-md">
                            Seguir Comprando
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Steps */}
                        <div className="flex-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'address' ? 'bg-primary text-white' : 'bg-green-100 text-green-600'}`}>
                                        {step === 'address' ? '1' : '✓'}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Dirección de Envío</h2>
                                </div>

                                {step === 'address' ? (
                                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                value={address.fullName}
                                                onChange={e => setAddress({...address, fullName: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                value={address.addressLine}
                                                onChange={e => setAddress({...address, addressLine: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    value={address.city}
                                                    onChange={e => setAddress({...address, city: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    value={address.phone}
                                                    onChange={e => setAddress({...address, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                                                Continuar al Pago
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-gray-600">
                                        <p className="font-medium">{address.fullName}</p>
                                        <p>{address.addressLine}, {address.city}</p>
                                        <p>{address.phone}</p>
                                        <button onClick={() => setStep('address')} className="text-primary text-sm hover:underline mt-2">Editar</button>
                                    </div>
                                )}
                            </div>

                            {step === 'payment' && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                            2
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800">Método de Pago</h2>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name="payment" 
                                                    value="card" 
                                                    checked={paymentMethod === 'card'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                <span className="flex-1 font-medium text-gray-700">Tarjeta de Crédito / Débito</span>
                                                <div className="flex gap-2">
                                                    {/* Icons */}
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name="payment" 
                                                    value="cod" 
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                <span className="flex-1 font-medium text-gray-700">Contra Entrega</span>
                                            </label>
                                        </div>

                                        <div className="pt-4">
                                            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md">
                                                Pagar ${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-80">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="font-bold text-gray-800 mb-4">Resumen del Pedido</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-3 text-sm">
                                            <div className="w-12 h-12 bg-gray-50 rounded flex-shrink-0 flex items-center justify-center">
                                                {/* Mini Image */}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                                <p className="text-gray-500">Cant: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">${(item.price * item.quantity).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className="text-green-600">Gratis</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t border-gray-100">
                                        <span>Total</span>
                                        <span>${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
