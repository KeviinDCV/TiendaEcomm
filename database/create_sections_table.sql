CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'category_grid', -- 'category_grid', 'featured_list', 'banner_strip'
    config JSON, -- Stores categories, limits, etc. Example: {"categories": ["Monitoreo", "UCI"], "limit": 4}
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a sample section
INSERT INTO sections (title, type, config, display_order) VALUES 
('Equipos de Monitoreo', 'category_grid', '{"categories": ["Monitoreo"], "limit": 4}', 1);
