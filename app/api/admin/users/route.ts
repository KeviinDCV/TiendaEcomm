import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
        // 1. Verificar Autenticación
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
        }

        // 2. Verificar Rol de Administrador
        if (decoded.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'Acceso denegado' }, { status: 403 });
        }

        // 3. Obtener usuarios (excluyendo contraseñas)
        const users = await query<User[]>(
            `SELECT id, name, email, role, is_active, email_verified, 
                    failed_login_attempts, locked_until, last_login, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );

        return NextResponse.json({
            success: true,
            users
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
}

// Actualizar usuario (Rol, Estado)
export async function PUT(request: NextRequest) {
    try {
        // 1. Verificar Autenticación y Rol
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'Acceso denegado' }, { status: 403 });
        }

        const body = await request.json();
        const { id, role, is_active } = body;

        // Evitar que el admin se bloquee a sí mismo
        if (id === decoded.userId && is_active === false) {
            return NextResponse.json({ success: false, message: 'No puedes desactivar tu propia cuenta' }, { status: 400 });
        }

        // Actualizar usuario
        await query(
            'UPDATE users SET role = ?, is_active = ? WHERE id = ?',
            [role, is_active, id]
        );

        return NextResponse.json({
            success: true,
            message: 'Usuario actualizado correctamente'
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
}
