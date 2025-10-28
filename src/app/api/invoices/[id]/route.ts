import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Invoice from '@/models/Invoice';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await verifyToken(request);
        if (!authResult) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const invoice = await Invoice.findById(params.id)
            .populate('client', 'name email gstin address')
            .populate('createdBy', 'name email');

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(invoice);

    } catch (error: any) {
        console.error('Get invoice error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await verifyToken(request);
        if (!authResult) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { client, date, dueDate, items, paymentTerms, notes, status } = body;

        // Calculate item amounts and taxes
        const processedItems = items.map((item: any) => ({
            ...item,
            amount: item.quantity * item.rate,
            taxAmount: (item.quantity * item.rate * item.taxRate) / 100
        }));

        // Calculate totals
        const subtotal = processedItems.reduce((sum: number, item: any) => sum + item.amount, 0);
        const taxAmount = processedItems.reduce((sum: number, item: any) => sum + item.taxAmount, 0);
        const total = subtotal + taxAmount;

        const invoice = await Invoice.findByIdAndUpdate(
            params.id,
            {
                client,
                date,
                dueDate,
                items: processedItems,
                subtotal,
                taxAmount,
                total,
                paymentTerms,
                notes,
                status
            },
            { new: true, runValidators: true }
        ).populate('client', 'name email gstin');

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Invoice updated successfully',
            invoice
        });

    } catch (error: any) {
        console.error('Update invoice error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await verifyToken(request);
        if (!authResult) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const invoice = await Invoice.findByIdAndUpdate(
            params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Invoice cancelled successfully'
        });

    } catch (error: any) {
        console.error('Delete invoice error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}