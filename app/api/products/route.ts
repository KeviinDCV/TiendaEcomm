import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 10;
        
        let sql = `
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
        `;
        
        const params: any[] = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        const products = await query(sql, params);

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, message: 'Error al obtener productos' }, { status: 500 });
    }
}
