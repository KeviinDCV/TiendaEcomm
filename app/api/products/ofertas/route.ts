import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Obtener productos activos que tienen precio original (están en descuento)
        const products = await query(`
            SELECT 
                id,
                name,
                description,
                price,
                original_price,
                stock,
                category,
                image_url,
                is_featured,
                ROUND(((original_price - price) / original_price) * 100) as discount_percentage
            FROM products 
            WHERE is_active = 1 
            AND original_price IS NOT NULL 
            AND original_price > price
            ORDER BY discount_percentage DESC, created_at DESC
            LIMIT 20
        `);

        return NextResponse.json({ 
            success: true, 
            products 
        });
    } catch (error) {
        console.error('Error fetching ofertas:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error al obtener productos en oferta' 
        }, { status: 500 });
    }
}
