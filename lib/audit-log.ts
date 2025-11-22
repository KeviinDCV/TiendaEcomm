import { query } from './db';

export type AuditEventType =
    | 'login_success'
    | 'login_failed'
    | 'logout'
    | 'register'
    | 'password_change'
    | 'password_reset_request'
    | 'password_reset_complete'
    | 'account_locked'
    | 'suspicious_activity'
    | 'token_refresh'
    | 'unauthorized_access_attempt';

interface AuditLogEntry {
    userId?: number;
    eventType: AuditEventType;
    ipAddress: string;
    userAgent: string;
    metadata?: Record<string, any>;
    success: boolean;
}

/**
 * Registra un evento de auditoría en la base de datos
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
    try {
        await query(
            `INSERT INTO audit_logs 
            (user_id, event_type, ip_address, user_agent, metadata, success, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [
                entry.userId || null,
                entry.eventType,
                entry.ipAddress,
                entry.userAgent,
                entry.metadata ? JSON.stringify(entry.metadata) : null,
                entry.success,
            ]
        );

        // Log también en consola para desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log('[AUDIT]', {
                timestamp: new Date().toISOString(),
                ...entry,
            });
        }
    } catch (error) {
        // No fallar la operación principal si el logging falla
        console.error('Error logging audit event:', error);
    }
}

/**
 * Extrae información de la request para el audit log
 */
export function extractRequestInfo(request: Request): {
    ipAddress: string;
    userAgent: string;
} {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    let ipAddress = 'Unknown';
    if (forwardedFor) {
        ipAddress = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
        ipAddress = realIp;
    }

    return { ipAddress, userAgent };
}

/**
 * Detecta actividad sospechosa en los logs
 */
export async function detectSuspiciousActivity(userId: number): Promise<boolean> {
    try {
        // Verificar múltiples IPs en corto tiempo
        const recentIps = await query<any[]>(
            `SELECT DISTINCT ip_address, COUNT(*) as count
             FROM audit_logs 
             WHERE user_id = ? 
             AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
             GROUP BY ip_address`,
            [userId]
        );

        // Si hay más de 3 IPs diferentes en 1 hora, es sospechoso
        if (recentIps.length > 3) {
            await logAuditEvent({
                userId,
                eventType: 'suspicious_activity',
                ipAddress: 'Multiple',
                userAgent: 'System',
                metadata: { reason: 'Multiple IPs in short time', ips: recentIps.length },
                success: false,
            });
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error detecting suspicious activity:', error);
        return false;
    }
}
