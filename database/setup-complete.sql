-- ================================================================
-- SCRIPT COMPLETO DE INSTALACIÓN Y MIGRACIÓN - HUV MEDICAL
-- ================================================================
-- Este script hace TODO lo necesario en un solo paso:
-- 1. Crea la base de datos
-- 2. Crea/actualiza la tabla users con campos de seguridad
-- 3. Crea las tablas de auditoría y sesiones
-- 4. Configura el usuario administrador
-- ================================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS huv_medical;
USE huv_medical;

-- ================================================================
-- PARTE 1: TABLA DE USUARIOS
-- ================================================================

-- Crear tabla users básica si no existe
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('usuario', 'administrador') DEFAULT 'usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar nuevas columnas de seguridad (ignorar errores si ya existen)
-- is_active
SET @sql = CONCAT('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER role');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND COLUMN_NAME = 'is_active');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Column is_active already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- email_verified
SET @sql = CONCAT('ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER is_active');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND COLUMN_NAME = 'email_verified');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Column email_verified already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- failed_login_attempts
SET @sql = CONCAT('ALTER TABLE users ADD COLUMN failed_login_attempts INT DEFAULT 0 AFTER email_verified');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND COLUMN_NAME = 'failed_login_attempts');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Column failed_login_attempts already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- locked_until
SET @sql = CONCAT('ALTER TABLE users ADD COLUMN locked_until TIMESTAMP NULL AFTER failed_login_attempts');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND COLUMN_NAME = 'locked_until');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Column locked_until already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- last_login
SET @sql = CONCAT('ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL AFTER locked_until');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND COLUMN_NAME = 'last_login');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Column last_login already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar índices (solo si no existen)
-- idx_email ya existe por el UNIQUE constraint, lo omitimos
-- idx_role
SET @sql = CONCAT('ALTER TABLE users ADD INDEX idx_role (role)');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND INDEX_NAME = 'idx_role');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Index idx_role already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- idx_active
SET @sql = CONCAT('ALTER TABLE users ADD INDEX idx_active (is_active)');
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = 'huv_medical' 
               AND TABLE_NAME = 'users' 
               AND INDEX_NAME = 'idx_active');
SET @sql = IF(@exists = 0, @sql, 'SELECT "Index idx_active already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ================================================================
-- PARTE 2: TABLA DE REFRESH TOKENS
-- ================================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_user (user_id),
    INDEX idx_token (token),
    INDEX idx_expires (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PARTE 3: TABLA DE AUDITORÍA
-- ================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_event (event_type),
    INDEX idx_created (created_at),
    INDEX idx_ip (ip_address),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PARTE 4: TABLA DE SESIONES ACTIVAS
-- ================================================================

CREATE TABLE IF NOT EXISTS active_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_token (session_token),
    INDEX idx_expires (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PARTE 5: CONFIGURAR USUARIO ADMINISTRADOR
-- ================================================================

-- Insertar o actualizar admin
-- Password: Admin@123456 (bcrypt 12 rounds)
INSERT INTO users (name, email, password, role, is_active, email_verified, failed_login_attempts) 
VALUES ('Administrador', 'admin@huv.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIWNdL5qLu', 'administrador', TRUE, TRUE, 0)
ON DUPLICATE KEY UPDATE 
    password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIWNdL5qLu',
    role = 'administrador',
    is_active = TRUE,
    email_verified = TRUE,
    failed_login_attempts = 0,
    locked_until = NULL;

-- Asegurar que todos los usuarios existentes tengan valores correctos
UPDATE users 
SET is_active = COALESCE(is_active, TRUE),
    email_verified = COALESCE(email_verified, FALSE),
    failed_login_attempts = COALESCE(failed_login_attempts, 0)
WHERE is_active IS NULL OR email_verified IS NULL OR failed_login_attempts IS NULL;

-- ================================================================
-- VERIFICACIÓN FINAL
-- ================================================================

SELECT 
    '=== INSTALACIÓN COMPLETADA ===' AS status,
    '' AS info
UNION ALL
SELECT 
    'Usuario Admin:' AS status,
    CONCAT('Email: admin@huv.com | Password: Admin@123456') AS info
UNION ALL
SELECT 
    'Estado del Admin:' AS status,
    CONCAT('Activo: ', is_active, ' | Verificado: ', email_verified) AS info
FROM users 
WHERE email = 'admin@huv.com'
UNION ALL
SELECT 
    'Total de usuarios:' AS status,
    CAST(COUNT(*) AS CHAR) AS info
FROM users
UNION ALL
SELECT 
    'Tablas creadas:' AS status,
    'users, refresh_tokens, audit_logs, active_sessions' AS info;

-- ================================================================
-- ¡LISTO! Ahora puedes iniciar sesión con:
-- Email: admin@huv.com
-- Password: Admin@123456
-- ⚠️ CAMBIAR ESTA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN
-- ================================================================
