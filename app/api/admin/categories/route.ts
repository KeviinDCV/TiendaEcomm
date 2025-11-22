import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Middleware de Auth (helper)
const checkAuth = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
};

export async function GET(request: NextRequest) {
    try {
        // Auth check opcional para GET? Mejor protegido.
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const categories = await query('SELECT * FROM categories ORDER BY name ASC');
        return NextResponse.json({ success: true, categories });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener categorías' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const { name } = await request.json();
        if (!name) return NextResponse.json({ success: false, message: 'Nombre requerido' }, { status: 400 });

        await query('INSERT INTO categories (name) VALUES (?)', [name]);
        return NextResponse.json({ success: true, message: 'Categoría creada' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ success: false, message: 'La categoría ya existe' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Error al crear categoría' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, message: 'ID requerido' }, { status: 400 });

        // Verificar si hay productos usando esta categoría
        const category = await query<any[]>('SELECT name FROM categories WHERE id = ?', [id]);
        if (category.length > 0) {
            const productsCount = await query<any[]>('SELECT COUNT(*) as count FROM products WHERE category = ?', [category[0].name]);
            if (productsCount[0].count > 0) {
                return NextResponse.json({ 
                    success: false, 
                    message: `No se puede eliminar: Hay ${productsCount[0].count} productos en esta categoría` 
                }, { status: 400 });
            }
        }

        await query('DELETE FROM categories WHERE id = ?', [id]);
        return NextResponse.json({ success: true, message: 'Categoría eliminada' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al eliminar categoría' }, { status: 500 });
    }
}
