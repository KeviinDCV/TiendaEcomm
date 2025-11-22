import { nanoid } from 'nanoid';

// Estructura para almacenar intentos
interface RateLimitRecord {
    count: number;
    resetTime: number;
    blockedUntil?: number;
}

// Almacenamiento en memoria (en producción usar Redis)
const loginAttempts = new Map<string, RateLimitRecord>();
const ipBlacklist = new Set<string>();

// Configuración
const MAX_ATTEMPTS = 5; // Máximo 5 intentos
const WINDOW_MS = 15 * 60 * 1000; // Ventana de 15 minutos
const BLOCK_DURATION_MS = 60 * 60 * 1000; // Bloquear por 1 hora después de 5 intentos

// Limpiar registros antiguos cada 10 minutos
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of loginAttempts.entries()) {
        if (record.resetTime < now && (!record.blockedUntil || record.blockedUntil < now)) {
            loginAttempts.delete(key);
        }
    }
}, 10 * 60 * 1000);

/**
 * Verifica si una IP está permitida para hacer login
 */
export function checkRateLimit(identifier: string): {
    allowed: boolean;
    remainingAttempts: number;
    resetTime?: number;
    blockedUntil?: number;
} {
    // Verificar blacklist permanente
    if (ipBlacklist.has(identifier)) {
        return {
            allowed: false,
            remainingAttempts: 0,
            blockedUntil: Infinity,
        };
    }

    const now = Date.now();
    const record = loginAttempts.get(identifier);

    // Si no hay registro, crear uno nuevo
    if (!record) {
        loginAttempts.set(identifier, {
            count: 0,
            resetTime: now + WINDOW_MS,
        });
        return {
            allowed: true,
            remainingAttempts: MAX_ATTEMPTS,
        };
    }

    // Si está bloqueado temporalmente
    if (record.blockedUntil && record.blockedUntil > now) {
        return {
            allowed: false,
            remainingAttempts: 0,
            blockedUntil: record.blockedUntil,
        };
    }

    // Si la ventana de tiempo expiró, resetear
    if (record.resetTime < now) {
        record.count = 0;
        record.resetTime = now + WINDOW_MS;
        delete record.blockedUntil;
    }

    const remainingAttempts = MAX_ATTEMPTS - record.count;

    return {
        allowed: remainingAttempts > 0,
        remainingAttempts: Math.max(0, remainingAttempts),
        resetTime: record.resetTime,
        blockedUntil: record.blockedUntil,
    };
}

/**
 * Registra un intento fallido de login
 */
export function recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const record = loginAttempts.get(identifier);

    if (!record) {
        loginAttempts.set(identifier, {
            count: 1,
            resetTime: now + WINDOW_MS,
        });
        return;
    }

    record.count += 1;

    // Si alcanza el máximo de intentos, bloquear
    if (record.count >= MAX_ATTEMPTS) {
        record.blockedUntil = now + BLOCK_DURATION_MS;
        
        // Si hay muchos bloqueos, agregar a blacklist
        if (record.count >= MAX_ATTEMPTS * 3) {
            ipBlacklist.add(identifier);
        }
    }
}

/**
 * Resetea los intentos después de un login exitoso
 */
export function resetAttempts(identifier: string): void {
    loginAttempts.delete(identifier);
}

/**
 * Agrega una IP a la blacklist permanente
 */
export function addToBlacklist(identifier: string): void {
    ipBlacklist.add(identifier);
}

/**
 * Remueve una IP de la blacklist
 */
export function removeFromBlacklist(identifier: string): void {
    ipBlacklist.delete(identifier);
}

/**
 * Obtiene la IP del cliente desde los headers de la request
 */
export function getClientIdentifier(request: Request): string {
    // Intentar obtener la IP real detrás de proxies
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    
    if (realIp) {
        return realIp;
    }
    
    // Fallback a un identificador único
    return nanoid();
}
