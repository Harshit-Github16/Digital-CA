import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Account from '@/models/Account';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const accounts = await Account.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ type: 1, name: 1 });

    return NextResponse.json(accounts);

  } catch (error: any) {
    console.error('Get accounts error:', error);
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
    const { name, type, balance, description } = body;

    // Check if account already exists
    const existingAccount = await Account.findOne({ name });
    if (existingAccount) {
      return NextResponse.json(
        { error: 'Account already exists with this name' },
        { status: 400 }
      );
    }

    const account = new Account({
      name,
      type,
      balance: balance || 0,
      description,
      createdBy: authResult.userId
    });

    await account.save();

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      account
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create account error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
