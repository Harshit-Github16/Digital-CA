import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Invoice from '@/models/Invoice';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      notes,
      status
    } = body;

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

    const updateData: any = {
      date: new Date(date),
      dueDate: new Date(dueDate),
      items: processedItems,
      subtotal,
      taxAmount,
      total,
      paymentTerms,
      notes
    };

    if (status) updateData.status = status;

    const invoice = await Invoice.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name email gstin');

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice
    });

  } catch (error: any) {
    console.error('Update invoice error:', error);
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

    const invoice = await Invoice.findByIdAndUpdate(
      params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice cancelled successfully'
    });

  } catch (error: any) {
    console.error('Delete invoice error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
