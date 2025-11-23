'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        todayLogins: 0,
        securityAlerts: 0
    });
    const [loading, setLoading] = useState(true);

    // TODO: Conectar con API real
    useEffect(() => {
        // Mock data
        const timer = setTimeout(() => {
            setStats({
                totalUsers: 15,
                activeUsers: 12,
                todayLogins: 45,
                securityAlerts: 2
            });
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div>
                <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-32 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard General</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Usuarios Totales</h3>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        +12% vs mes anterior
                    </p>
                </div>

                {/* Active Users Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Sesiones Activas</h3>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
                    <p className="text-xs text-gray-400 mt-1">En los últimos 5 min</p>
                </div>

                {/* Logins Today Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Accesos Hoy</h3>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.todayLogins}</p>
                    <p className="text-xs text-gray-400 mt-1">Total de inicios de sesión</p>
                </div>

                {/* Security Alerts Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Alertas de Seguridad</h3>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.securityAlerts}</p>
                    <p className="text-xs text-red-500 mt-1">Requieren atención</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Actividad Reciente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                                    US
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Inicio de sesión exitoso</p>
                                    <p className="text-xs text-gray-500">Usuario #123 • hace {i * 5} min</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Accesos Rápidos</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-primary/30 transition-all text-left group">
                            <span className="block font-bold text-gray-700 group-hover:text-primary mb-1">Nuevo Usuario</span>
                            <span className="text-xs text-gray-500">Registrar manualmente</span>
                        </button>
                        <button className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-primary/30 transition-all text-left group">
                            <span className="block font-bold text-gray-700 group-hover:text-primary mb-1">Ver Auditoría</span>
                            <span className="text-xs text-gray-500">Revisar logs de seguridad</span>
                        </button>
                        <button className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-primary/30 transition-all text-left group">
                            <span className="block font-bold text-gray-700 group-hover:text-primary mb-1">Configuración</span>
                            <span className="text-xs text-gray-500">Ajustes del sistema</span>
                        </button>
                        <button className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-primary/30 transition-all text-left group">
                            <span className="block font-bold text-gray-700 group-hover:text-primary mb-1">Reportes</span>
                            <span className="text-xs text-gray-500">Descargar informes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
