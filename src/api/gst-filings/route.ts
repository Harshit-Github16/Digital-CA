import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import GSTFiling from '@/models/GSTFiling';
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
    const filingType = searchParams.get('filingType');
    const clientId = searchParams.get('clientId');

    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (filingType) {
      query.filingType = filingType;
    }
    
    if (clientId) {
      query.client = clientId;
    }

    const filings = await GSTFiling.find(query)
      .populate('client', 'name gstin email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await GSTFiling.countDocuments(query);

    return NextResponse.json(filings);

  } catch (error: any) {
    console.error('Get GST filings error:', error);
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
      filingType, 
      taxPeriod, 
      dueDate, 
      filingData, 
      lateFee, 
      penalty 
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
    const totalTaxLiability = filingData.outputTax.igst + 
                             filingData.outputTax.cgst + 
                             filingData.outputTax.sgst + 
                             filingData.outputTax.cess;
    
    const totalITC = filingData.itc.igst + 
                    filingData.itc.cgst + 
                    filingData.itc.sgst + 
                    filingData.itc.cess;

    const netTaxPayable = totalTaxLiability - totalITC + (lateFee || 0) + (penalty || 0);

    const filing = new GSTFiling({
      client,
      filingType,
      taxPeriod,
      dueDate: new Date(dueDate),
      filingData,
      totalTaxLiability,
      totalITC,
      netTaxPayable,
      lateFee: lateFee || 0,
      penalty: penalty || 0,
      createdBy: authResult.userId
    });

    await filing.save();

    // Populate the created filing
    await filing.populate('client', 'name gstin email');

    return NextResponse.json({
      success: true,
      message: 'GST filing created successfully',
      filing
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create GST filing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
