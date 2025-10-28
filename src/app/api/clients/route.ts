import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Client from '@/models/Client';

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for testing
    // const authResult = await verifyToken(request);
    // if (!authResult) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { gstin: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Client.countDocuments(query);

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Get clients error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Try to get auth, but don't require it for now (for testing)
    const authResult = await verifyToken(request);

    // Get or create a default user if no auth
    let assignedUserId;
    if (authResult) {
      assignedUserId = authResult.userId;
    } else {
      // Create or find default user for testing
      const User = (await import('@/models/User')).default;
      let defaultUser = await User.findOne({ email: 'admin@digitalca.com' });
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
      assignedUserId = defaultUser._id;
    }

    const body = await request.json();
    const { name, email, phone, gstin, pan, address, businessType, notes } = body;

    // Validate required fields
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

    // Prepare address with defaults
    const clientAddress = {
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      pincode: address?.pincode || '',
      country: address?.country || 'India'
    };

    const client = new Client({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\D/g, ''), // Remove non-digits
      gstin: gstin?.trim().toUpperCase() || undefined,
      pan: pan?.trim().toUpperCase() || undefined,
      address: clientAddress,
      businessType: businessType || 'Individual',
      notes: notes?.trim() || '',
      assignedTo: assignedUserId
    });

    await client.save();
    await client.populate('assignedTo', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create client error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
