-- Tabla de Productos
USE huv_medical;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    category VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    reviews_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar productos de ejemplo (basados en data/products.ts)
INSERT INTO products (name, price, original_price, image_url, category, rating, reviews_count, is_featured, description, stock) VALUES
('Monitor de Signos Vitales Multiparamétrico HUV-2000', 1250000, 1450000, 'https://images.unsplash.com/photo-1581595219310-3c36d792dda6?w=400&h=400&fit=crop', 'Monitoreo', 4.9, 342, TRUE, 'Monitor avanzado para UCI con medición de ECG, SpO2, NIBP, RESP y TEMP. Pantalla táctil de 12 pulgadas.', 50),
('Desfibrilador Externo Automático (DEA) Pro', 3800000, 4200000, 'https://images.unsplash.com/photo-1586492460426-5766a105a2d3?w=400&h=400&fit=crop', 'Emergencias', 5.0, 128, TRUE, 'DEA bifásico con instrucciones de voz en español. Incluye parches para adultos y pediátricos.', 20),
('Ecógrafo Portátil Digital Doppler Color', 8500000, 9200000, 'https://images.unsplash.com/photo-1581595219385-15b5d0f2c8d6?w=400&h=400&fit=crop', 'Diagnóstico', 4.8, 89, TRUE, 'Sistema de ultrasonido portátil con sondas intercambiables. Ideal para diagnóstico en punto de atención.', 10),
('Mesa Quirúrgica Electrohidráulica Universal', 15000000, 16500000, 'https://images.unsplash.com/photo-1581595219379-788a7a4f30e3?w=400&h=400&fit=crop', 'Mobiliario', 4.9, 45, TRUE, 'Mesa de operaciones versátil con control remoto. Soporta hasta 300kg y permite múltiples posiciones.', 5);
