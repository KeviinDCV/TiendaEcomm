import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limitParam = searchParams.get('limit');
        const sortBy = searchParams.get('sortBy') || 'newest'; // newest, most_viewed, best_selling, highest_rated, price_low, price_high, featured
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
                views,
                sales_count,
                rating,
                ROUND(((original_price - price) / original_price) * 100) as discount_percentage
            FROM products 
            WHERE is_active = 1
        `;
        
        const params: any[] = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        // Intelligent sorting
        switch (sortBy) {
            case 'most_viewed':
                sql += ' ORDER BY views DESC, created_at DESC';
                break;
            case 'best_selling':
                sql += ' ORDER BY sales_count DESC, views DESC';
                break;
            case 'highest_rated':
                sql += ' ORDER BY rating DESC, sales_count DESC';
                break;
            case 'price_low':
                sql += ' ORDER BY price ASC';
                break;
            case 'price_high':
                sql += ' ORDER BY price DESC';
                break;
            case 'featured':
                sql += ' ORDER BY is_featured DESC, sales_count DESC, views DESC';
                break;
            case 'newest':
            default:
                sql += ' ORDER BY created_at DESC';
                break;
        }

        sql += ' LIMIT ?';
        params.push(limit);

        const products = await query(sql, params);

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, message: 'Error al obtener productos' }, { status: 500 });
    }
}
