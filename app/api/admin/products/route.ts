import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
    try {
        // 1. Verificar Autenticación y Rol
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
        const imageFile = formData.get('image') as File;

        if (!name || !price || !category) {
            return NextResponse.json({ success: false, message: 'Faltan campos requeridos' }, { status: 400 });
        }

        let imageUrl = '';

        // 3. Guardar Imagen Principal
        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${nanoid()}-${imageFile.name.replace(/\s+/g, '-').toLowerCase()}`;
            
            // Asegurar que el directorio existe
            const uploadDir = path.join(process.cwd(), 'public/uploads/products');
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (error) {
                // Ignorar error si ya existe
            }

            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/products/${filename}`;
        }

        // 4. Insertar en Base de Datos (Producto Principal)
        const result = await query<any>(
            `INSERT INTO products 
            (name, description, price, original_price, stock, image_url, category, is_featured, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [name, description, price, originalPrice, stock, imageUrl, category, isFeatured]
        );
        
        const productId = result.insertId;

        // 5. Procesar Imágenes Secundarias (hasta 10)
        const secondaryImages = formData.getAll('secondaryImages') as File[];
        
        if (secondaryImages && secondaryImages.length > 0) {
            const uploadDir = path.join(process.cwd(), 'public/uploads/products');
            
            // Limitar a 10 imágenes
            const imagesToProcess = secondaryImages.slice(0, 10);
            
            for (let i = 0; i < imagesToProcess.length; i++) {
                const img = imagesToProcess[i];
                if (img.size > 0) {
                    const buffer = Buffer.from(await img.arrayBuffer());
                    const filename = `${nanoid()}-${img.name.replace(/\s+/g, '-').toLowerCase()}`;
                    const filePath = path.join(uploadDir, filename);
                    
                    try {
                        await writeFile(filePath, buffer);
                        const secImageUrl = `/uploads/products/${filename}`;
                        
                        await query(
                            `INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)`,
                            [productId, secImageUrl, i]
                        );
                    } catch (err) {
                        console.error('Error saving secondary image:', err);
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Producto creado exitosamente',
            productId: productId
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ success: false, message: 'Error al crear el producto' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
     try {
        // 1. Verificar Autenticación y Rol
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'Acceso denegado' }, { status: 403 });
        }

        const products = await query('SELECT * FROM products ORDER BY created_at DESC');
        
        return NextResponse.json({
            success: true,
            products
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
}
