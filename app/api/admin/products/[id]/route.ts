import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

// GET: Obtener un producto por ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        // Verificar auth
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
        }
        
        const products = await query<any[]>('SELECT * FROM products WHERE id = ?', [id]);
        
        if (products.length === 0) {
            return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: products[0] });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener producto' }, { status: 500 });
    }
}

// PUT: Actualizar un producto
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // 1. Verificar Auth y Rol Admin
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'Acceso denegado' }, { status: 403 });
        }

        // 2. Procesar FormData
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null;
        const stock = parseInt(formData.get('stock') as string) || 0;
        const category = formData.get('category') as string;
        const isFeatured = formData.get('isFeatured') === 'true';
        const isActive = formData.get('isActive') === 'true';
        const imageFile = formData.get('image') as File | null;

        if (!name || !price || !category) {
            return NextResponse.json({ success: false, message: 'Faltan campos requeridos' }, { status: 400 });
        }

        // 3. Manejar Imagen (si se sube una nueva)
        let imageUrl = formData.get('currentImageUrl') as string;

        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${nanoid()}-${imageFile.name.replace(/\s+/g, '-').toLowerCase()}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads/products');
            
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (e) {}

            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/products/${filename}`;
        }

        // 4. Actualizar BD
        await query(
            `UPDATE products SET 
                name = ?, description = ?, price = ?, original_price = ?, 
                stock = ?, category = ?, is_featured = ?, is_active = ?, 
                image_url = ?
             WHERE id = ?`,
            [name, description, price, originalPrice, stock, category, isFeatured, isActive, imageUrl, id]
        );

        return NextResponse.json({
            success: true,
            message: 'Producto actualizado correctamente'
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, message: 'Error al actualizar producto' }, { status: 500 });
    }
}

// DELETE: Eliminar producto (lógica o física)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        // Verificar Auth...
        const authHeader = request.headers.get('Authorization');
        // ... (lógica auth igual a arriba)
        if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ success: false }, { status: 401 });
        
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'administrador') return NextResponse.json({ success: false }, { status: 403 });

        // Soft delete (desactivar en lugar de borrar) para mantener integridad referencial de pedidos
        await query('UPDATE products SET is_active = FALSE WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al eliminar' }, { status: 500 });
    }
}
