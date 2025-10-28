import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Account from '@/models/Account';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if accounts already exist
    const existingAccounts = await Account.find();
    if (existingAccounts.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Default accounts already exist'
      });
    }

    // Create default accounts
    const defaultAccounts = [
      { name: 'Cash', type: 'asset', balance: 0, description: 'Cash in hand' },
      { name: 'Bank Account', type: 'asset', balance: 0, description: 'Primary bank account' },
      { name: 'Accounts Receivable', type: 'asset', balance: 0, description: 'Money owed by clients' },
      { name: 'Office Equipment', type: 'asset', balance: 0, description: 'Computers, furniture, etc.' },
      { name: 'Accounts Payable', type: 'liability', balance: 0, description: 'Money owed to vendors' },
      { name: 'Owner Equity', type: 'equity', balance: 0, description: 'Owner investment' },
      { name: 'Client Revenue', type: 'income', balance: 0, description: 'Income from clients' },
      { name: 'Office Rent', type: 'expense', balance: 0, description: 'Monthly office rent' },
      { name: 'Utilities', type: 'expense', balance: 0, description: 'Electricity, internet, etc.' },
      { name: 'Office Supplies', type: 'expense', balance: 0, description: 'Stationery, supplies' }
    ];

    const accounts = await Account.insertMany(
      defaultAccounts.map(account => ({
        ...account,
        createdBy: authResult.userId
      }))
    );

    return NextResponse.json({
      success: true,
      message: 'Default accounts created successfully',
      accounts
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create default accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
