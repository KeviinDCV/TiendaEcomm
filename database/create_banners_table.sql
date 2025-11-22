CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    button_text VARCHAR(50),
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default banners (optional, based on what was hardcoded)
INSERT INTO banners (title, subtitle, button_text, image_url, display_order) VALUES 
('TECNOLOGÍA MÉDICA', 'Equipa tu hospital con lo mejor', 'Ver Ofertas', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600', 1),
('EQUIPOS DE DIAGNÓSTICO', 'Precisión y confiabilidad garantizadas', 'Explorar Catálogo', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600', 2),
('OFERTAS ESPECIALES', 'Hasta 20% de descuento en equipos seleccionados', 'Ver Promociones', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600', 3);
