import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, sanitizeUser } from '@/lib/auth';
import { AuthResponse, User } from '@/lib/types';
import { registerSchema } from '@/lib/validations';
import { checkRateLimit, recordFailedAttempt, getClientIdentifier } from '@/lib/rate-limit';
import { logAuditEvent, extractRequestInfo } from '@/lib/audit-log';
import { ZodError } from 'zod';

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

        // 5. INSERTAR USUARIO EN LA BASE DE DATOS
        const result = await query<any>(
            `INSERT INTO users (name, email, password, role, is_active, email_verified, failed_login_attempts) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, 'usuario', true, false, 0]
        );

        // 6. OBTENER EL USUARIO CREADO
        const newUser = {
            id: result.insertId,
            name,
            email,
            role: 'usuario' as const
        };

        // 7. GENERAR TOKEN JWT
        const token = generateToken(newUser);

        // 8. LOG DE AUDITORÍA
        await logAuditEvent({
            userId: newUser.id,
            eventType: 'register',
            ipAddress,
            userAgent,
            metadata: { email: newUser.email },
            success: true,
        });

        return NextResponse.json<AuthResponse>(
            {
                success: true,
                message: 'Usuario registrado exitosamente',
                user: sanitizeUser(newUser),
                token
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
