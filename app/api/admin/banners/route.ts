import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

// Helper for Auth
const checkAuth = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
};

export async function GET(request: NextRequest) {
    try {
        // Public access for now, or admin only? The homepage needs public access.
        // But this is /api/admin/banners, so it should be protected or I should make a public one.
        // I'll make a separate public endpoint or just allow GET here for public if needed, 
        // but better to keep admin separate.
        // Wait, the request is for ADMIN management.
        
        const user = checkAuth(request);
        if (!user || user.role !== 'administrador') {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
        }

        const banners = await query('SELECT * FROM banners ORDER BY display_order ASC');
        return NextResponse.json({ success: true, banners });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error al obtener banners' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
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

        if (!title || !image) {
            return NextResponse.json({ success: false, message: 'Título e imagen son requeridos' }, { status: 400 });
        }

        // Validate max banners count (7)
        const countResult = await query<any[]>('SELECT COUNT(*) as count FROM banners');
        if (countResult[0].count >= 7) {
             return NextResponse.json({ success: false, message: 'Límite de 7 banners alcanzado' }, { status: 400 });
        }

        // Save image
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `banner_${Date.now()}_${image.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads/banners');
        
        // Ensure directory exists (might need a utility for this, but Next.js usually has public)
        // For now assume public/uploads exists or create it.
        // I'll save to public/uploads/banners
        
        await writeFile(path.join(uploadDir, filename), buffer);
        const imageUrl = `/uploads/banners/${filename}`;

        await query(
            'INSERT INTO banners (title, subtitle, button_text, image_url, link_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, subtitle, buttonText, imageUrl, linkUrl, displayOrder || 0, isActive]
        );

        return NextResponse.json({ success: true, message: 'Banner creado exitosamente' });
    } catch (error) {
        console.error('Error creating banner:', error);
        return NextResponse.json({ success: false, message: 'Error al crear banner' }, { status: 500 });
    }
}
