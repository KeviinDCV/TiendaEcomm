'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.message);
            setLoading(false);
        }
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

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando sesión...' : 'Continuar'}
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
