'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('info');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No has iniciado sesión</h1>
                    <Link href="/login" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: 'Las contraseñas nuevas no coinciden', type: 'error' });
            return;
        }

        try {
            // Aquí iría la llamada a la API para cambiar la contraseña
            // Por ahora simularemos éxito
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ text: 'Contraseña actualizada correctamente', type: 'success' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ text: 'Error al actualizar contraseña', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-light text-gray-800 mb-6">Mi Cuenta</h1>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                        {/* Sidebar */}
                        <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6">
                            <div className="flex flex-col items-center mb-8 text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-3">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="font-medium text-gray-800">{user.name}</h2>
                                <p className="text-xs text-gray-500">{user.email}</p>
                                <span className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                                    {user.role}
                                </span>
                            </div>

                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'info' 
                                            ? 'bg-white text-primary shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Información Personal
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'security' 
                                            ? 'bg-white text-primary shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Seguridad
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'orders' 
                                            ? 'bg-white text-primary shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Mis Pedidos
                                </button>
                            </nav>
                        </aside>

                        {/* Content */}
                        <div className="flex-1 p-8">
                            {activeTab === 'info' && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-xl font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Información Personal
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Nombre Completo</label>
                                            <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                {user.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
                                            <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Rol de Usuario</label>
                                            <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border border-gray-100 capitalize">
                                                {user.role}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Miembro desde</label>
                                            <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                {new Date().toLocaleDateString()} {/* Placeholder */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="animate-in fade-in duration-300 max-w-md">
                                    <h2 className="text-xl font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Cambiar Contraseña
                                    </h2>
                                    
                                    {message.text && (
                                        <div className={`p-3 rounded-lg text-sm mb-4 ${
                                            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium"
                                        >
                                            Actualizar Contraseña
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-xl font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Mis Pedidos
                                    </h2>
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <p>Aún no has realizado pedidos.</p>
                                        <Link href="/" className="text-primary hover:underline mt-2 inline-block">
                                            Ir a comprar
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
