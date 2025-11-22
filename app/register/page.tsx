'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        setLoading(true);
        const result = await register(name, email, password);

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

            {/* Register Card */}
            <div className="bg-white p-8 rounded shadow-sm w-full max-w-[400px]">
                <h1 className="text-2xl font-normal mb-6 text-gray-800">Crear cuenta</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Tu nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="name"
                            placeholder="Nombre y apellido"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                            required
                        />
                    </div>

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
                            autoComplete="new-password"
                            placeholder="Al menos 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                            required
                            minLength={6}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            La contraseña debe tener al menos 6 caracteres.
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Vuelve a escribir la contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded shadow-sm transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creando cuenta...' : 'Continuar'}
                    </button>
                </form>

                <div className="mt-6 text-sm">
                    <div className="text-gray-600">
                        ¿Ya tienes una cuenta? <Link href="/login" className="text-primary hover:underline">Iniciar sesión</Link>
                    </div>
                </div>
            </div>

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
