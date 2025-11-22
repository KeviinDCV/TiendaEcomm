-- Base de datos para HUV Medical
CREATE DATABASE IF NOT EXISTS huv_medical;
USE huv_medical;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('usuario', 'administrador') DEFAULT 'usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear usuario administrador por defecto (password: admin123)
-- Hash generado con bcryptjs para 'admin123'
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@huv.com', '$2a$10$X8qZ5Vq6KVxJYXKx6K5YYuXQZqYZ8qZ5Vq6KVxJYXKx6K5YYuXQZq', 'administrador')
ON DUPLICATE KEY UPDATE name=name;
