import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, sanitizeUser } from '@/lib/auth';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
        // Obtener el token del header Authorization
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'No autorizado' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7); // Remover 'Bearer '
        
        // Verificar y decodificar el token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Token inválido o expirado' },
                { status: 401 }
            );
        }

        // Obtener los datos del usuario desde la BD
        const users = await query<User[]>(
            'SELECT * FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: sanitizeUser(users[0])
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error en verificación de token:', error);
        return NextResponse.json(
            { success: false, message: 'Error al verificar autenticación' },
            { status: 500 }
        );
    }
}
