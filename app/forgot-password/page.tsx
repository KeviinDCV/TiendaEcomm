'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock password recovery logic
        console.log('Password recovery for:', email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#EBEBEB] flex flex-col items-center pt-12 px-4 font-sans">
            {/* Logo */}
            <Link href="/" className="mb-8">
                <div className="flex items-center gap-1">
                    <div className="font-bold text-3xl tracking-tight text-foreground">HUV</div>
                    <div className="text-sm mt-1 text-primary font-bold">Medical</div>
                </div>
            </Link>

            {/* Recovery Card */}
            <div className="bg-white p-8 rounded shadow-sm w-full max-w-[400px]">
                <h1 className="text-2xl font-normal mb-4 text-gray-800">Recuperar contraseña</h1>
                
                {!isSubmitted ? (
                    <>
                        <p className="text-sm text-gray-600 mb-6">
                            Ingresa la dirección de correo electrónico asociada a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded shadow-sm transition-colors"
                            >
                                Continuar
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="mb-4 text-green-500 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">¡Correo enviado!</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Si existe una cuenta asociada a <strong>{email}</strong>, recibirás las instrucciones para restablecer tu contraseña.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-sm text-primary hover:underline"
                        >
                            Intentar con otro correo
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
                <div className="text-sm text-gray-600 mb-4">
                    ¿Ya recordaste tu contraseña? <Link href="/login" className="text-primary hover:underline">Iniciar sesión</Link>
                </div>
            </div>

            <div className="mt-auto mb-8 flex gap-8 text-xs text-gray-500">
                <a href="#" className="hover:underline">Condiciones de uso</a>
                <a href="#" className="hover:underline">Aviso de privacidad</a>
                <a href="#" className="hover:underline">Ayuda</a>
            </div>
            <div className="mb-4 text-xs text-gray-400">
                © 2025, HUV Medical Inc.
            </div>
        </div>
    );
}
