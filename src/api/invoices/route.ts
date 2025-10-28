import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Invoice from '@/models/Invoice';
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
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (clientId) {
      query.client = clientId;
    }

    const invoices = await Invoice.find(query)
      .populate('client', 'name email gstin')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Invoice.countDocuments(query);

    return NextResponse.json(invoices);

  } catch (error: any) {
    console.error('Get invoices error:', error);
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
      client, 
      date, 
      dueDate, 
      items, 
      paymentTerms, 
      notes 
    } = body;

    // Validate client exists
    const clientDoc = await Client.findById(client);
    if (!clientDoc) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    const processedItems = items.map((item: any) => {
      const amount = item.quantity * item.rate;
      const itemTaxAmount = (amount * item.taxRate) / 100;
      
      subtotal += amount;
      taxAmount += itemTaxAmount;

      return {
        ...item,
        amount,
        taxAmount: itemTaxAmount
      };
    });

    const total = subtotal + taxAmount;

    const invoice = new Invoice({
      client: client,
      date: new Date(date),
      dueDate: new Date(dueDate),
      items: processedItems,
      subtotal,
      taxAmount,
      total,
      paymentTerms,
      notes,
      createdBy: authResult.userId
    });

    await invoice.save();

    // Populate the created invoice
    await invoice.populate('client', 'name email gstin address');

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
