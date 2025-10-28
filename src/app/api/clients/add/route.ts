import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get or create a default user
        let defaultUser = await User.findOne();
        if (!defaultUser) {
            defaultUser = new User({
                name: 'Admin User',
                email: 'admin@digitalca.com',
                password: 'hashedpassword123',
                role: 'admin',
                isActive: true
            });
            await defaultUser.save();
        }

        const body = await request.json();
        const { name, email, phone, gstin, pan, address, businessType, notes } = body;

        // Check if client already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return NextResponse.json(
                { error: 'Client already exists with this email' },
                { status: 400 }
            );
        }

        const client = new Client({
            name,
            email,
            phone,
            gstin,
            pan,
            address,
            businessType,
            notes,
            assignedTo: defaultUser._id
        });

        await client.save();
        await client.populate('assignedTo', 'name email');

        return NextResponse.json({
            success: true,
            message: 'Client added successfully',
            client
        }, { status: 201 });

    } catch (error: any) {
        console.error('Add client error:', error);
        return NextResponse.json(
            { error: 'Failed to add client', details: error.message },
            { status: 500 }
        );
    }
}

// Quick add with minimal data
export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        let defaultUser = await User.findOne();
        if (!defaultUser) {
            defaultUser = new User({
                name: 'Admin User',
                email: 'admin@digitalca.com',
                password: 'hashedpassword123',
                role: 'admin',
                isActive: true
            });
            await defaultUser.save();
        }

        const body = await request.json();
        const { name, email, phone, businessType = 'Individual' } = body;

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Check if client already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return NextResponse.json(
                { error: 'Client already exists with this email' },
                { status: 400 }
            );
        }

        const client = new Client({
            name,
            email,
            phone,
            address: {
                street: 'Not provided',
                city: 'Not provided',
                state: 'Not provided',
                pincode: '000000',
                country: 'India'
            },
            businessType,
            notes: 'Added via quick add API',
            assignedTo: defaultUser._id
        });

        await client.save();
        await client.populate('assignedTo', 'name email');

        return NextResponse.json({
            success: true,
            message: 'Client added successfully (quick add)',
            client
        }, { status: 201 });

    } catch (error: any) {
        console.error('Quick add client error:', error);
        return NextResponse.json(
            { error: 'Failed to add client', details: error.message },
            { status: 500 }
        );
    }
}