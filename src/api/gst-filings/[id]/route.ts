import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import GSTFiling from '@/models/GSTFiling';

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
      filingType, 
      taxPeriod, 
      dueDate, 
      filingData, 
      lateFee, 
      penalty,
      status,
      filingDate,
      arn,
      acknowledgmentNumber
    } = body;

    // Calculate totals
    const totalTaxLiability = filingData.outputTax.igst + 
                             filingData.outputTax.cgst + 
                             filingData.outputTax.sgst + 
                             filingData.outputTax.cess;
    
    const totalITC = filingData.itc.igst + 
                    filingData.itc.cgst + 
                    filingData.itc.sgst + 
                    filingData.itc.cess;

    const netTaxPayable = totalTaxLiability - totalITC + (lateFee || 0) + (penalty || 0);

    const updateData: any = {
      filingType,
      taxPeriod,
      dueDate: new Date(dueDate),
      filingData,
      totalTaxLiability,
      totalITC,
      netTaxPayable,
      lateFee: lateFee || 0,
      penalty: penalty || 0
    };

    if (status) updateData.status = status;
    if (filingDate) updateData.filingDate = new Date(filingDate);
    if (arn) updateData.arn = arn;
    if (acknowledgmentNumber) updateData.acknowledgmentNumber = acknowledgmentNumber;

    const filing = await GSTFiling.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name gstin email');

    if (!filing) {
      return NextResponse.json(
        { error: 'GST filing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'GST filing updated successfully',
      filing
    });

  } catch (error: any) {
    console.error('Update GST filing error:', error);
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

    const filing = await GSTFiling.findByIdAndDelete(params.id);

    if (!filing) {
      return NextResponse.json(
        { error: 'GST filing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'GST filing deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete GST filing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
