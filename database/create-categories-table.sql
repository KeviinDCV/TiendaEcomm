USE huv_medical;

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías iniciales
INSERT IGNORE INTO categories (name) VALUES 
('Equipos de Diagnóstico'),
('Mobiliario Hospitalario'),
('Instrumental Quirúrgico'),
('Insumos Médicos'),
('Ortopedia y Rehabilitación'),
('Emergencias y Rescate'),
('Laboratorio Clínico'),
('Imagenología'),
('Monitoreo'),
('Diagnóstico');
