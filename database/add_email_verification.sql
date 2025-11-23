-- Agregar columnas para verificación de email
ALTER TABLE users 
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_code VARCHAR(6) NULL,
ADD COLUMN verification_code_expires DATETIME NULL;

-- Crear índice para búsquedas rápidas por código de verificación
CREATE INDEX idx_verification_code ON users(verification_code);

-- Los usuarios administradores existentes se marcan como verificados automáticamente
UPDATE users SET is_verified = TRUE WHERE role = 'administrador';
