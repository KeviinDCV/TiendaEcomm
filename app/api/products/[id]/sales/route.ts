import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const quantity = body.quantity || 1;

        // Increment sales count by quantity
        await query(
            'UPDATE products SET sales_count = sales_count + ? WHERE id = ?',
            [quantity, id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking product sale:', error);
        return NextResponse.json({ success: false, message: 'Error al registrar venta' }, { status: 500 });
    }
}
