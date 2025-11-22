import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

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

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const buttonText = formData.get('buttonText') as string;
        const linkUrl = formData.get('linkUrl') as string;
        const displayOrder = formData.get('displayOrder') as string;
        const isActive = formData.get('isActive') === 'true' ? 1 : 0;
        const image = formData.get('image') as File | null;
        const currentImageUrl = formData.get('currentImageUrl') as string;

        let imageUrl = currentImageUrl;

        if (image) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `banner_${Date.now()}_${image.name.replace(/\s/g, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads/banners');
            await writeFile(path.join(uploadDir, filename), buffer);
            imageUrl = `/uploads/banners/${filename}`;

            // Optional: Delete old image if it exists and is local
            // if (currentImageUrl && currentImageUrl.startsWith('/uploads/')) { ... }
        }

        await query(
            'UPDATE banners SET title = ?, subtitle = ?, button_text = ?, image_url = ?, link_url = ?, display_order = ?, is_active = ? WHERE id = ?',
            [title, subtitle, buttonText, imageUrl, linkUrl, displayOrder, isActive, id]
        );

        return NextResponse.json({ success: true, message: 'Banner actualizado' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error al actualizar banner' }, { status: 500 });
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

        // Get image url to delete file (optional, but good practice)
        const banner = await query<any[]>('SELECT image_url FROM banners WHERE id = ?', [id]);
        
        await query('DELETE FROM banners WHERE id = ?', [id]);

        if (banner.length > 0 && banner[0].image_url.startsWith('/uploads/banners/')) {
            try {
                const filePath = path.join(process.cwd(), 'public', banner[0].image_url);
                await unlink(filePath);
            } catch (e) {
                console.error('Error deleting banner file:', e);
            }
        }

        return NextResponse.json({ success: true, message: 'Banner eliminado' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al eliminar banner' }, { status: 500 });
    }
}
