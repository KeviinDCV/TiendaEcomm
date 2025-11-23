import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email y código requeridos' 
            }, { status: 400 });
        }

        // Buscar usuario con el código
        const users = await query(
            `SELECT id, email, name, is_verified, verification_code, verification_code_expires 
             FROM users 
             WHERE email = ? AND verification_code = ?`,
            [email, code]
        );

        if (!Array.isArray(users) || users.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'Código de verificación inválido' 
            }, { status: 400 });
        }

        const user = users[0];

        // Verificar si ya está verificado
        if (user.is_verified) {
            return NextResponse.json({ 
                success: false, 
                message: 'Usuario ya verificado' 
            }, { status: 400 });
        }

        // Verificar si el código ha expirado
        const now = new Date();
        const expiresAt = new Date(user.verification_code_expires);

        if (now > expiresAt) {
            return NextResponse.json({ 
                success: false, 
                message: 'El código de verificación ha expirado. Solicita uno nuevo.' 
            }, { status: 400 });
        }

        // Activar la cuenta
        await query(
            `UPDATE users 
             SET is_verified = TRUE, 
                 verification_code = NULL, 
                 verification_code_expires = NULL 
             WHERE id = ?`,
            [user.id]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Cuenta verificada exitosamente. Ya puedes iniciar sesión.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en verify-code:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error del servidor' 
        }, { status: 500 });
    }
}
