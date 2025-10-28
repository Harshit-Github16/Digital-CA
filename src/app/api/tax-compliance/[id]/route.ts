import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import TaxCompliance from '@/models/TaxCompliance';

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

        const taxCompliance = await TaxCompliance.findById(params.id)
            .populate('client', 'name email gstin pan address')
            .populate('createdBy', 'name email');

        if (!taxCompliance) {
            return NextResponse.json({ error: 'Tax compliance record not found' }, { status: 404 });
        }

        return NextResponse.json(taxCompliance);

    } catch (error: any) {
        console.error('Get tax compliance error:', error);
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
        const {
            taxType,
            assessmentYear,
            formType,
            dueDate,
            filingDate,
            status,
            taxAmount,
            penalty,
            interest,
            acknowledgmentNumber,
            challanNumber,
            refundAmount,
            notes,
            documents
        } = body;

        const taxCompliance = await TaxCompliance.findByIdAndUpdate(
            params.id,
            {
                taxType,
                assessmentYear,
                formType,
                dueDate,
                filingDate,
                status,
                taxAmount,
                penalty,
                interest,
                acknowledgmentNumber,
                challanNumber,
                refundAmount,
                notes,
                documents
            },
            { new: true, runValidators: true }
        ).populate('client', 'name email gstin pan');

        if (!taxCompliance) {
            return NextResponse.json({ error: 'Tax compliance record not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Tax compliance record updated successfully',
            taxCompliance
        });

    } catch (error: any) {
        console.error('Update tax compliance error:', error);
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

        const taxCompliance = await TaxCompliance.findByIdAndUpdate(
            params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!taxCompliance) {
            return NextResponse.json({ error: 'Tax compliance record not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Tax compliance record cancelled successfully'
        });

    } catch (error: any) {
        console.error('Delete tax compliance error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}