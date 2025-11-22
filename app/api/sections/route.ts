import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const sections = await query('SELECT * FROM sections WHERE is_active = 1 ORDER BY display_order ASC');
        return NextResponse.json({ success: true, sections });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener secciones' }, { status: 500 });
    }
}
