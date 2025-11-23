import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const products = await query(
            `SELECT 
                id,
                name,
                description,
                price,
                original_price,
                stock,
                category,
                image_url,
                is_featured,
                rating,
                views,
                sales_count,
                ROUND(((original_price - price) / original_price) * 100) as discount_percentage,
                created_at
            FROM products 
            WHERE id = ? AND is_active = 1`,
            [id]
        );

        if (Array.isArray(products) && products.length > 0) {
            // Obtener imágenes secundarias
            const images = await query(
                'SELECT id, image_url, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
                [id]
            );
            
            return NextResponse.json({ 
                success: true, 
                product: { 
                    ...products[0], 
                    images: images || [] 
                } 
            });
        } else {
            return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ success: false, message: 'Error al obtener el producto' }, { status: 500 });
    }
}
