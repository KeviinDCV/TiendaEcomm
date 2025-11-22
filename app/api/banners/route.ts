import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const banners = await query('SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC');
        return NextResponse.json({ success: true, banners });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener banners' }, { status: 500 });
    }
}
