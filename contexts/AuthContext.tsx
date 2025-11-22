'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { UserResponse } from '@/lib/types';

interface AuthContextType {
    user: UserResponse | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Verificar si hay un usuario autenticado al cargar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = Cookies.get('auth_token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token inválido, limpiar
                Cookies.remove('auth_token');
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            Cookies.remove('auth_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success && data.token) {
                // Guardar token en cookie (7 días)
                Cookies.set('auth_token', data.token, { expires: 7 });
                setUser(data.user);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: 'Error al iniciar sesión' };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (data.success && data.token) {
                // Guardar token en cookie (7 días)
                Cookies.set('auth_token', data.token, { expires: 7 });
                setUser(data.user);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, message: 'Error al registrar usuario' };
        }
    };

    const logout = () => {
        Cookies.remove('auth_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
