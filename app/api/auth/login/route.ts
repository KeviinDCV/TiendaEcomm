import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken, generateRefreshToken, sanitizeUser } from '@/lib/auth';
import { AuthResponse, User } from '@/lib/types';
import { loginSchema } from '@/lib/validations';
import { checkRateLimit, recordFailedAttempt, resetAttempts, getClientIdentifier } from '@/lib/rate-limit';
import { logAuditEvent, extractRequestInfo, detectSuspiciousActivity } from '@/lib/audit-log';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    const { ipAddress, userAgent } = extractRequestInfo(request);
    const clientId = getClientIdentifier(request);

    try {
        // 1. RATE LIMITING - Prevenir ataques de fuerza bruta
        const rateLimit = checkRateLimit(clientId);
        if (!rateLimit.allowed) {
            await logAuditEvent({
                eventType: 'login_failed',
                ipAddress,
                userAgent,
                metadata: { reason: 'Rate limit exceeded', blockedUntil: rateLimit.blockedUntil },
                success: false,
            });

            const message = rateLimit.blockedUntil === Infinity
                ? 'Tu IP ha sido bloqueada permanentemente por actividad sospechosa'
                : `Demasiados intentos fallidos. Intenta de nuevo en ${Math.ceil((rateLimit.blockedUntil! - Date.now()) / 60000)} minutos`;

            return NextResponse.json<AuthResponse>(
                { success: false, message },
                { status: 429 }
            );
        }

        const body = await request.json();

        // 2. VALIDACIÓN CON ZOD - Entrada segura y sanitizada
        const validatedData = loginSchema.parse(body);
        const { email, password } = validatedData;

        // 3. BUSCAR USUARIO
        const users = await query<User[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            recordFailedAttempt(clientId);
            await logAuditEvent({
                eventType: 'login_failed',
                ipAddress,
                userAgent,
                metadata: { email, reason: 'User not found' },
                success: false,
            });

            return NextResponse.json<AuthResponse>(
                { success: false, message: 'Credenciales incorrectas' },
                { status: 401 }
            );
        }

        const user = users[0];

        // 4. VERIFICAR SI LA CUENTA ESTÁ ACTIVA
        if (!user.is_active) {
            await logAuditEvent({
                userId: user.id,
                eventType: 'login_failed',
                ipAddress,
                userAgent,
                metadata: { reason: 'Account inactive' },
                success: false,
            });

            return NextResponse.json<AuthResponse>(
                { success: false, message: 'Tu cuenta ha sido desactivada. Contacta al administrador' },
                { status: 403 }
            );
        }

        // 5. VERIFICAR SI LA CUENTA ESTÁ BLOQUEADA TEMPORALMENTE
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            await logAuditEvent({
                userId: user.id,
                eventType: 'login_failed',
                ipAddress,
                userAgent,
                metadata: { reason: 'Account locked', lockedUntil: user.locked_until },
                success: false,
            });

            return NextResponse.json<AuthResponse>(
                { 
                    success: false, 
                    message: `Cuenta bloqueada temporalmente. Intenta nuevamente después de ${new Date(user.locked_until).toLocaleTimeString()}` 
                },
                { status: 403 }
            );
        }

        // 6. VERIFICAR CONTRASEÑA
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            recordFailedAttempt(clientId);

            // Incrementar contador de intentos fallidos
            const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
            let lockedUntil = null;

            // Bloquear cuenta después de 5 intentos fallidos
            if (newFailedAttempts >= 5) {
                lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
                await query(
                    'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
                    [newFailedAttempts, lockedUntil, user.id]
                );

                await logAuditEvent({
                    userId: user.id,
                    eventType: 'account_locked',
                    ipAddress,
                    userAgent,
                    metadata: { attempts: newFailedAttempts, lockedUntil },
                    success: false,
                });
            } else {
                await query(
                    'UPDATE users SET failed_login_attempts = ? WHERE id = ?',
                    [newFailedAttempts, user.id]
                );
            }

            await logAuditEvent({
                userId: user.id,
                eventType: 'login_failed',
                ipAddress,
                userAgent,
                metadata: { reason: 'Invalid password', attempts: newFailedAttempts },
                success: false,
            });

            return NextResponse.json<AuthResponse>(
                { 
                    success: false, 
                    message: 'Credenciales incorrectas' 
                },
                { status: 401 }
            );
        }

        // 7. LOGIN EXITOSO - Resetear intentos y actualizar última conexión
        await query(
            'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = ?',
            [user.id]
        );

        resetAttempts(clientId);

        // 8. DETECTAR ACTIVIDAD SOSPECHOSA
        const isSuspicious = await detectSuspiciousActivity(user.id);
        if (isSuspicious) {
            // Notificar al usuario por email (implementar después)
            console.warn(`Suspicious activity detected for user ${user.id}`);
        }

        // 9. GENERAR TOKENS
        const token = generateToken(sanitizeUser(user));
        const refreshToken = generateRefreshToken(sanitizeUser(user));

        // 10. GUARDAR REFRESH TOKEN EN BD
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
        await query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [user.id, refreshToken, expiresAt, ipAddress, userAgent]
        );

        // 11. REGISTRAR SESIÓN ACTIVA
        await query(
            'INSERT INTO active_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
            [user.id, token, ipAddress, userAgent, new Date(Date.now() + 24 * 60 * 60 * 1000)]
        );

        // 12. LOG DE AUDITORÍA
        await logAuditEvent({
            userId: user.id,
            eventType: 'login_success',
            ipAddress,
            userAgent,
            metadata: { email: user.email },
            success: true,
        });

        return NextResponse.json<AuthResponse>(
            {
                success: true,
                message: 'Inicio de sesión exitoso',
                user: sanitizeUser(user),
                token,
            },
            { 
                status: 200,
                headers: {
                    'Set-Cookie': `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
                }
            }
        );
    } catch (error) {
        console.error('Error en login:', error);

        // Si es error de validación Zod, devolver mensaje específico
        if (error instanceof ZodError) {
            return NextResponse.json<AuthResponse>(
                { success: false, message: error.issues[0].message },
                { status: 400 }
            );
        }

        await logAuditEvent({
            eventType: 'login_failed',
            ipAddress,
            userAgent,
            metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
            success: false,
        });

        return NextResponse.json<AuthResponse>(
            { success: false, message: 'Error al iniciar sesión' },
            { status: 500 }
        );
    }
}
