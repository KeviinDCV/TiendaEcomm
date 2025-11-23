import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, sanitizeUser } from '@/lib/auth';
import { AuthResponse, User } from '@/lib/types';
import { registerSchema } from '@/lib/validations';
import { checkRateLimit, recordFailedAttempt, getClientIdentifier } from '@/lib/rate-limit';
import { logAuditEvent, extractRequestInfo } from '@/lib/audit-log';
import { ZodError } from 'zod';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import HuvVerifyEmail from '@/emails/huv-verify-email';

// Verificar que la API key esté configurada
if (!process.env.RESEND_API_KEY) {
    console.error('⚠️ RESEND_API_KEY no está configurada en .env.local');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const { ipAddress, userAgent } = extractRequestInfo(request);
    const clientId = getClientIdentifier(request);

    try {
        // 1. RATE LIMITING - Prevenir spam de registros
        const rateLimit = checkRateLimit(clientId);
        if (!rateLimit.allowed) {
            await logAuditEvent({
                eventType: 'register',
                ipAddress,
                userAgent,
                metadata: { reason: 'Rate limit exceeded' },
                success: false,
            });

            return NextResponse.json<AuthResponse>(
                { success: false, message: 'Demasiados intentos. Intenta más tarde' },
                { status: 429 }
            );
        }

        const body = await request.json();

        // 2. VALIDACIÓN CON ZOD - Entrada segura y sanitizada
        const validatedData = registerSchema.parse(body);
        const { name, email, password } = validatedData;

        // 3. VERIFICAR SI EL USUARIO YA EXISTE
        const existingUsers = await query<User[]>(
            'SELECT id, email FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            recordFailedAttempt(clientId);
            
            await logAuditEvent({
                eventType: 'register',
                ipAddress,
                userAgent,
                metadata: { email, reason: 'Email already exists' },
                success: false,
            });

            return NextResponse.json<AuthResponse>(
                { success: false, message: 'Este correo electrónico ya está registrado' },
                { status: 409 }
            );
        }

        // 4. HASH DE LA CONTRASEÑA CON SALT ROUNDS ALTO
        const hashedPassword = await hashPassword(password);

        // 5. GENERAR CÓDIGO DE VERIFICACIÓN
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // 6. INSERTAR USUARIO EN LA BASE DE DATOS (NO VERIFICADO)
        const result = await query<any>(
            `INSERT INTO users (name, email, password, role, is_active, email_verified, failed_login_attempts, is_verified, verification_code, verification_code_expires) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, 'usuario', true, false, 0, false, verificationCode, expiresAt]
        );

        // 7. ENVIAR EMAIL DE VERIFICACIÓN
        try {
            const emailHtml = await render(HuvVerifyEmail({ 
                validationCode: verificationCode,
                userName: name
            }));

            const { data, error } = await resend.emails.send({
                from: 'HUV Medical - Verificación <onboarding@resend.dev>',
                to: email,
                subject: 'Verifica tu cuenta en HUV Medical',
                html: emailHtml,
            });

            if (error) {
                console.error('❌ Error detallado de Resend:', JSON.stringify(error, null, 2));
                throw new Error('Falló el envío de email: ' + error.message);
            }

            console.log('✅ Email enviado exitosamente. ID:', data?.id);
        } catch (emailError) {
            console.error('Error al enviar email de verificación:', emailError);
            // No fallar el registro si el email falla, el usuario podrá reenviar el código
        }

        // 8. LOG DE AUDITORÍA
        await logAuditEvent({
            userId: result.insertId,
            eventType: 'register',
            ipAddress,
            userAgent,
            metadata: { email, verification_sent: true },
            success: true,
        });

        return NextResponse.json<AuthResponse>(
            {
                success: true,
                message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
                requiresVerification: true,
                email: email
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error en registro:', error);

        // Si es error de validación Zod, devolver mensaje específico
        if (error instanceof ZodError) {
            return NextResponse.json<AuthResponse>(
                { success: false, message: error.issues[0].message },
                { status: 400 }
            );
        }

        await logAuditEvent({
            eventType: 'register',
            ipAddress,
            userAgent,
            metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
            success: false,
        });

        return NextResponse.json<AuthResponse>(
            { success: false, message: 'Error al registrar usuario' },
            { status: 500 }
        );
    }
}
