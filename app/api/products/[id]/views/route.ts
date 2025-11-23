import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Increment view count and update last viewed timestamp
        await query(
            'UPDATE products SET views = views + 1, last_viewed_at = NOW() WHERE id = ?',
            [id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking product view:', error);
        return NextResponse.json({ success: false, message: 'Error al registrar vista' }, { status: 500 });
    }
}
