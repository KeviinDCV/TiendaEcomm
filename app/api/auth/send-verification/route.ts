import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import HuvVerifyEmail from '@/emails/huv-verify-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email requerido' }, { status: 400 });
        }

        // Verificar si el usuario existe
        const users = await query('SELECT id, email, name, is_verified FROM users WHERE email = ?', [email]);
        
        if (!Array.isArray(users) || users.length === 0) {
            return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
        }

        const user = users[0];

        if (user.is_verified) {
            return NextResponse.json({ success: false, message: 'Usuario ya verificado' }, { status: 400 });
        }

        // Generar código de 6 dígitos
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Establecer expiración de 15 minutos
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Guardar código en la base de datos
        await query(
            'UPDATE users SET verification_code = ?, verification_code_expires = ? WHERE id = ?',
            [verificationCode, expiresAt, user.id]
        );

        // Enviar email con Resend
        const emailHtml = await render(HuvVerifyEmail({ 
            validationCode: verificationCode,
            userName: user.name
        }));

        const { data, error } = await resend.emails.send({
            from: 'HUV Medical - Verificación <onboarding@resend.dev>',
            to: email,
            subject: 'Verifica tu cuenta en HUV Medical',
            html: emailHtml,
        });

        if (error) {
            console.error('❌ Error detallado de Resend:', JSON.stringify(error, null, 2));
            return NextResponse.json({ 
                success: false, 
                message: 'Error al enviar el código de verificación: ' + error.message 
            }, { status: 500 });
        }

        console.log('✅ Email de reenvío enviado exitosamente. ID:', data?.id);

        return NextResponse.json({ 
            success: true, 
            message: 'Código de verificación enviado a tu correo',
            emailId: data?.id
        });

    } catch (error) {
        console.error('Error en send-verification:', error);
        return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
    }
}
