export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'usuario' | 'administrador';
    is_active: boolean;
    email_verified: boolean;
    failed_login_attempts: number;
    locked_until: Date | null;
    last_login: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: 'usuario' | 'administrador';
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: UserResponse;
    token?: string;
    requiresVerification?: boolean;
    email?: string;
}

export interface DecodedToken {
    userId: number;
    email: string;
    role: 'usuario' | 'administrador';
    iat: number;
    exp: number;
}
