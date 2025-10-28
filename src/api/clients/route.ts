import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Client from '@/models/Client';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json(clients);

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
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

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
      assignedTo: authResult.userId
    });

    await client.save();

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
