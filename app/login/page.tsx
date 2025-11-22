'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login logic
        console.log('Login:', { email, password });
        window.location.href = '/';
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

            {/* Login Card */}
            <div className="bg-white p-8 rounded shadow-sm w-full max-w-[400px]">
                <h1 className="text-2xl font-normal mb-6 text-gray-800">Iniciar sesión</h1>

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

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                <div className="mt-4 text-center">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full max-w-[400px] flex items-center gap-4 my-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-xs text-gray-500">¿Eres nuevo en HUV?</span>
                <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* Create Account Button */}
            <Link
                href="/register"
                className="w-full max-w-[400px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded shadow-sm text-center transition-colors"
            >
                Crear tu cuenta de HUV
            </Link>

            {/* Footer Links */}
            <div className="mt-12 flex gap-8 text-xs text-gray-500">
                <a href="#" className="hover:underline">Condiciones de uso</a>
                <a href="#" className="hover:underline">Aviso de privacidad</a>
                <a href="#" className="hover:underline">Ayuda</a>
            </div>
            <div className="mt-2 text-xs text-gray-400">
                © 2025, HUV Medical Inc.
            </div>
        </div>
    );
}
