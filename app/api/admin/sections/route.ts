import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const checkAuth = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
};

export async function GET(request: NextRequest) {
    try {
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const sections = await query('SELECT * FROM sections ORDER BY display_order ASC');
        return NextResponse.json({ success: true, sections });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener secciones' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const body = await request.json();
        const { title, type, config, displayOrder, isActive } = body;

        if (!title || !type) {
            return NextResponse.json({ success: false, message: 'Título y tipo son requeridos' }, { status: 400 });
        }

        await query(
            'INSERT INTO sections (title, type, config, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
            [title, type, JSON.stringify(config), displayOrder || 0, isActive ? 1 : 0]
        );

        return NextResponse.json({ success: true, message: 'Sección creada exitosamente' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error al crear sección' }, { status: 500 });
    }
}
