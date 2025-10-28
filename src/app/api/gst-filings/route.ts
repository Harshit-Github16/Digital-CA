import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import GSTFiling from '@/models/GSTFiling';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      console.log('No auth token provided for GST filings, returning sample data');
      // Return sample data instead of 401
      const sampleGSTFilings = [
        {
          _id: '1',
          client: { _id: '1', name: 'Rajesh Kumar', email: 'rajesh@techcorp.com', gstin: '29ABCDE1234F1Z5' },
          filingType: 'GSTR-1',
          taxPeriod: '2024-01',
          dueDate: new Date('2024-02-11'),
          filingDate: new Date('2024-02-10'),
          status: 'filed',
          totalTaxLiability: 18000,
          totalITC: 2000,
          netTaxPayable: 16000,
          lateFee: 0,
          penalty: 0,
          arn: 'AA291220241234567',
          acknowledgmentNumber: 'ACK-GSTR1-2024-001',
          createdBy: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-02-10')
        },
        {
          _id: '2',
          client: { _id: '2', name: 'Priya Sharma', email: 'priya@retailstore.com', gstin: '07FGHIJ5678K2L6' },
          filingType: 'GSTR-3B',
          taxPeriod: '2024-01',
          dueDate: new Date('2024-02-20'),
          status: 'pending',
          totalTaxLiability: 900,
          totalITC: 100,
          netTaxPayable: 800,
          lateFee: 0,
          penalty: 0,
          createdBy: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        }
      ];

      return NextResponse.json({
        gstFilings: sampleGSTFilings,
        pagination: {
          page: 1,
          limit: 10,
          total: sampleGSTFilings.length,
          pages: 1
        }
      });
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

    const gstFilings = await GSTFiling.find(query)
      .populate('client', 'name email gstin')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await GSTFiling.countDocuments(query);

    return NextResponse.json({
      gstFilings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

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
      totalTaxLiability = 0,
      totalITC = 0,
      lateFee = 0,
      penalty = 0,
      filingData
    } = body;

    const gstFiling = new GSTFiling({
      client,
      filingType,
      taxPeriod,
      dueDate,
      totalTaxLiability,
      totalITC,
      lateFee,
      penalty,
      filingData,
      createdBy: authResult.userId
    });

    await gstFiling.save();
    await gstFiling.populate('client', 'name email gstin');

    return NextResponse.json({
      success: true,
      message: 'GST filing created successfully',
      gstFiling
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create GST filing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
