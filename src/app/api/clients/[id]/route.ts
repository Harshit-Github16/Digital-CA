import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Client from '@/models/Client';

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

        const client = await Client.findById(params.id)
            .populate('assignedTo', 'name email');

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json(client);

    } catch (error: any) {
        console.error('Get client error:', error);
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
        const { name, email, phone, gstin, pan, address, businessType, notes, isActive } = body;

        const client = await Client.findByIdAndUpdate(
            params.id,
            {
                name,
                email,
                phone,
                gstin,
                pan,
                address,
                businessType,
                notes,
                isActive
            },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Client updated successfully',
            client
        });

    } catch (error: any) {
        console.error('Update client error:', error);
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

        // Soft delete - set isActive to false
        const client = await Client.findByIdAndUpdate(
            params.id,
            { isActive: false },
            { new: true }
        );

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Client deleted successfully'
        });

    } catch (error: any) {
        console.error('Delete client error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}