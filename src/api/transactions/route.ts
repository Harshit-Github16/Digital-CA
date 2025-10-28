import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Transaction from '@/models/Transaction';

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
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const account = searchParams.get('account');

    const query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (account) {
      query.account = account;
    }

    const transactions = await Transaction.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return NextResponse.json(transactions);

  } catch (error: any) {
    console.error('Get transactions error:', error);
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
    const { 
      date, 
      description, 
      category, 
      type, 
      amount, 
      account, 
      reference, 
      tags 
    } = body;

    const transaction = new Transaction({
      date: new Date(date),
      description,
      category,
      type,
      amount,
      account,
      reference,
      tags: tags || [],
      createdBy: authResult.userId
    });

    await transaction.save();

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
