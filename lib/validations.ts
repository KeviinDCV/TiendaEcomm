import { z } from 'zod';

// Validación de email
export const emailSchema = z
    .string()
    .email('Email inválido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(255, 'El email no puede exceder 255 caracteres')
    .toLowerCase()
    .trim();

// Validación de contraseña con requisitos de seguridad
export const passwordSchema = z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
    );

// Validación de nombre
export const nameSchema = z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .trim();

// Schema de registro
export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});

// Schema de login
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'La contraseña es requerida'),
});

// Tipos TypeScript derivados de los schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
