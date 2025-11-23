-- Agregar campos para métricas de productos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS sales_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_products_views ON products(views DESC);
CREATE INDEX IF NOT EXISTS idx_products_sales ON products(sales_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
