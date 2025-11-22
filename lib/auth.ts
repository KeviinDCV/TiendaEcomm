import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DecodedToken, UserResponse } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'huv_medical_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'huv_medical_refresh_secret_key';

// Configuración de seguridad mejorada
const SALT_ROUNDS = 12; // Aumentado de 10 a 12 para mayor seguridad
const TOKEN_EXPIRY = '24h'; // Token de acceso válido por 24 horas
const REFRESH_TOKEN_EXPIRY = '7d'; // Refresh token válido por 7 días

// Hash de contraseña con salt rounds más alto
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Generar JWT token con expiración más corta para seguridad
export function generateToken(user: UserResponse): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { 
            expiresIn: TOKEN_EXPIRY,
            issuer: 'huv-medical',
            audience: 'huv-medical-app'
        }
    );
}

// Generar refresh token para renovación de sesión
export function generateRefreshToken(user: UserResponse): string {
    return jwt.sign(
        {
            userId: user.id,
            type: 'refresh'
        },
        JWT_REFRESH_SECRET,
        { 
            expiresIn: REFRESH_TOKEN_EXPIRY,
            issuer: 'huv-medical',
            audience: 'huv-medical-app'
        }
    );
}

// Verificar y decodificar JWT token
export function verifyToken(token: string): DecodedToken | null {
    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
        return null;
    }
}

// Extraer usuario de la respuesta de BD (sin password)
export function sanitizeUser(user: any): UserResponse {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}
