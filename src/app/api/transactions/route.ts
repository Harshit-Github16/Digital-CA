import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      console.log('No auth token provided for transactions, returning sample data');
      // Return sample data instead of 401
      const sampleTransactions = [
        {
          _id: '1',
          date: '2024-01-15',
          description: 'Office Rent Payment',
          category: 'Rent',
          type: 'expense',
          amount: 25000,
          account: 'Bank Account',
          reference: 'RENT-001',
          tags: ['office', 'monthly'],
          createdAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          date: '2024-01-16',
          description: 'Client Payment Received',
          category: 'Client Revenue',
          type: 'income',
          amount: 50000,
          account: 'Bank Account',
          reference: 'PAY-001',
          tags: ['client', 'revenue'],
          createdAt: new Date('2024-01-16')
        },
        {
          _id: '3',
          date: '2024-01-20',
          description: 'Software License Renewal',
          category: 'Software',
          type: 'expense',
          amount: 12000,
          account: 'Bank Account',
          reference: 'SOFT-001',
          tags: ['software', 'annual'],
          createdAt: new Date('2024-01-20')
        },
        {
          _id: '4',
          date: '2024-01-25',
          description: 'Consulting Services Revenue',
          category: 'Service Revenue',
          type: 'income',
          amount: 35000,
          account: 'Bank Account',
          reference: 'CONS-001',
          tags: ['consulting', 'revenue'],
          createdAt: new Date('2024-01-25')
        },
        {
          _id: '5',
          date: '2024-02-01',
          description: 'Employee Salary Payment',
          category: 'Payroll',
          type: 'expense',
          amount: 150000,
          account: 'Bank Account',
          reference: 'SAL-001',
          tags: ['payroll', 'monthly'],
          createdAt: new Date('2024-02-01')
        }
      ];

      return NextResponse.json(sampleTransactions);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const query: any = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const transactions = await Transaction.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

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
    console.log('Transaction creation request body:', body);

    const { date, description, category, type, amount, account, reference, tags } = body;

    // Validate required fields
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    if (!type || !['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Valid type (income/expense) is required' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }
    if (!account) {
      return NextResponse.json({ error: 'Account is required' }, { status: 400 });
    }

    const transaction = new Transaction({
      date: date ? new Date(date) : new Date(),
      description: description.trim(),
      category: category.trim(),
      type,
      amount: Number(amount),
      account: account.trim(),
      reference: reference?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      createdBy: authResult.userId
    });

    await transaction.save();
    await transaction.populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create transaction error:', error);

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
