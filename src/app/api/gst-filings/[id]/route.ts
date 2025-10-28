import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import GSTFiling from '@/models/GSTFiling';

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

        const gstFiling = await GSTFiling.findById(params.id)
            .populate('client', 'name email gstin address')
            .populate('createdBy', 'name email');

        if (!gstFiling) {
            return NextResponse.json({ error: 'GST filing not found' }, { status: 404 });
        }

        return NextResponse.json(gstFiling);

    } catch (error: any) {
        console.error('Get GST filing error:', error);
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
            filingType,
            taxPeriod,
            dueDate,
            filingDate,
            status,
            totalTaxLiability,
            totalITC,
            lateFee,
            penalty,
            arn,
            acknowledgmentNumber,
            filingData
        } = body;

        const gstFiling = await GSTFiling.findByIdAndUpdate(
            params.id,
            {
                filingType,
                taxPeriod,
                dueDate,
                filingDate,
                status,
                totalTaxLiability,
                totalITC,
                lateFee,
                penalty,
                arn,
                acknowledgmentNumber,
                filingData
            },
            { new: true, runValidators: true }
        ).populate('client', 'name email gstin');

        if (!gstFiling) {
            return NextResponse.json({ error: 'GST filing not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'GST filing updated successfully',
            gstFiling
        });

    } catch (error: any) {
        console.error('Update GST filing error:', error);
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

        const gstFiling = await GSTFiling.findByIdAndUpdate(
            params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!gstFiling) {
            return NextResponse.json({ error: 'GST filing not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'GST filing cancelled successfully'
        });

    } catch (error: any) {
        console.error('Delete GST filing error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}