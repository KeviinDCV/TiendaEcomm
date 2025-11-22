-- ================================================================
-- INSTALACIÓN COMPLETA Y ÚNICA - HUV MEDICAL E-COMMERCE
-- ================================================================
-- EJECUTA TODO ESTE ARCHIVO EN phpMyAdmin
-- No necesitas ejecutar nada más, este es el ÚNICO script
-- ================================================================

CREATE DATABASE IF NOT EXISTS huv_medical;
USE huv_medical;

-- Tabla de usuarios con todos los campos
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('usuario', 'administrador') DEFAULT 'usuario',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de refresh tokens
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

-- Tabla de auditoría
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

-- Tabla de sesiones activas
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

-- Insertar o actualizar usuario administrador
-- Email: admin@huv.com
-- Password: Admin@123456
-- Hash generado y verificado con bcryptjs
INSERT INTO users (name, email, password, role, is_active, email_verified, failed_login_attempts, locked_until)
VALUES ('Administrador', 'admin@huv.com', '$2b$12$jFXXE8iHEa/pvOWuYU.l5Oa/6QNgo3qhVTn537Fdqo.YD7cpHcxgK', 'administrador', TRUE, TRUE, 0, NULL)
ON DUPLICATE KEY UPDATE
    password = '$2b$12$jFXXE8iHEa/pvOWuYU.l5Oa/6QNgo3qhVTn537Fdqo.YD7cpHcxgK',
    role = 'administrador',
    is_active = TRUE,
    email_verified = TRUE,
    failed_login_attempts = 0,
    locked_until = NULL;

-- Verificación final
SELECT 
    '✅ INSTALACIÓN COMPLETADA' AS status,
    '' AS info
UNION ALL
SELECT 
    'Credenciales Admin:' AS status,
    'Email: admin@huv.com | Password: Admin@123456' AS info
UNION ALL
SELECT 
    'Estado:' AS status,
    CONCAT('Activo: ', is_active, ' | Rol: ', role) AS info
FROM users 
WHERE email = 'admin@huv.com'
UNION ALL
SELECT 
    'Total usuarios:' AS status,
    CAST(COUNT(*) AS CHAR) AS info
FROM users;

-- ================================================================
-- ¡LISTO! Ahora puedes iniciar sesión:
-- URL: http://localhost:3000/login
-- Email: admin@huv.com
-- Password: Admin@123456
-- ================================================================
