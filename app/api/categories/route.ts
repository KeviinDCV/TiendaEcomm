import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const categories = await query('SELECT * FROM categories ORDER BY name ASC');
        return NextResponse.json({ success: true, categories });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener categorías' }, { status: 500 });
    }
}
