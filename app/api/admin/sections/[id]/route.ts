import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const checkAuth = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
};

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const body = await request.json();
        const { title, type, config, displayOrder, isActive } = body;

        await query(
            'UPDATE sections SET title = ?, type = ?, config = ?, display_order = ?, is_active = ? WHERE id = ?',
            [title, type, JSON.stringify(config), displayOrder, isActive ? 1 : 0, id]
        );

        return NextResponse.json({ success: true, message: 'Sección actualizada' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al actualizar sección' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        await query('DELETE FROM sections WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: 'Sección eliminada' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al eliminar sección' }, { status: 500 });
    }
}
