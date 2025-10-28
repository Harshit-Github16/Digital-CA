import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        console.log('🔄 Starting client test add...');

        // Connect to database
        await connectDB();
        console.log('✅ Database connected');

        // Get or create default user
        let defaultUser = await User.findOne({ email: 'admin@digitalca.com' });
        if (!defaultUser) {
            console.log('📝 Creating default user...');
            defaultUser = new User({
                name: 'Admin User',
                email: 'admin@digitalca.com',
                password: 'hashedpassword123',
                role: 'admin',
                isActive: true
            });
            await defaultUser.save();
            console.log('✅ Default user created');
        } else {
            console.log('✅ Default user found');
        }

        const body = await request.json();
        console.log('📥 Request body:', body);

        // Create test client with minimal required data
        const testClient = {
            name: body.name || 'Test Client',
            email: body.email || `test${Date.now()}@example.com`,
            phone: body.phone || '9876543210',
            address: {
                street: body.address?.street || 'Test Street',
                city: body.address?.city || 'Test City',
                state: body.address?.state || 'Test State',
                pincode: body.address?.pincode || '123456',
                country: body.address?.country || 'India'
            },
            businessType: body.businessType || 'Individual',
            assignedTo: defaultUser._id,
            notes: 'Test client created via test API'
        };

        console.log('📝 Creating client with data:', testClient);

        const client = new Client(testClient);
        await client.save();

        console.log('✅ Client saved successfully');

        await client.populate('assignedTo', 'name email');

        return NextResponse.json({
            success: true,
            message: 'Test client created successfully',
            client,
            debug: {
                userId: defaultUser._id,
                clientId: client._id
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('❌ Test add client error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to create test client',
            details: error.message,
            stack: error.stack,
            name: error.name
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const clientCount = await Client.countDocuments();
        const userCount = await User.countDocuments();

        const recentClients = await Client.find()
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({
            success: true,
            counts: {
                clients: clientCount,
                users: userCount
            },
            recentClients
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}