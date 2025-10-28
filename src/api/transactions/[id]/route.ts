import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Transaction from '@/models/Transaction';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const transaction = await Transaction.findByIdAndUpdate(
      params.id,
      {
        date: new Date(date),
        description,
        category,
        type,
        amount,
        account,
        reference,
        tags: tags || []
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });

  } catch (error: any) {
    console.error('Update transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const transaction = await Transaction.findByIdAndDelete(params.id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
