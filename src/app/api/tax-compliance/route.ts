import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import TaxCompliance from '@/models/TaxCompliance';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      console.log('No auth token provided for tax compliance, returning sample data');
      // Return sample data instead of 401
      const sampleTaxCompliance = [
        {
          _id: '1',
          client: { _id: '1', name: 'Rajesh Kumar', email: 'rajesh@techcorp.com', gstin: '29ABCDE1234F1Z5', pan: 'ABCDE1234F' },
          taxType: 'Income Tax',
          assessmentYear: '2024-25',
          formType: 'ITR-4',
          dueDate: new Date('2024-07-31'),
          filingDate: new Date('2024-07-15'),
          status: 'filed',
          taxAmount: 50000,
          penalty: 0,
          interest: 0,
          totalPayable: 50000,
          acknowledgmentNumber: 'ITR1234567890123456',
          challanNumber: 'CHL-280-2024-001',
          notes: 'Income tax return filed for AY 2024-25',
          documents: [],
          createdBy: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-07-15')
        },
        {
          _id: '2',
          client: { _id: '2', name: 'Priya Sharma', email: 'priya@retailstore.com', gstin: '07FGHIJ5678K2L6', pan: 'FGHIJ5678K' },
          taxType: 'TDS',
          assessmentYear: '2024-25',
          formType: '24Q',
          dueDate: new Date('2024-04-15'),
          status: 'pending',
          taxAmount: 5000,
          penalty: 0,
          interest: 0,
          totalPayable: 5000,
          notes: 'TDS return for Q4 FY 2023-24',
          documents: [],
          createdBy: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        }
      ];

      return NextResponse.json({
        taxCompliance: sampleTaxCompliance,
        pagination: {
          page: 1,
          limit: 10,
          total: sampleTaxCompliance.length,
          pages: 1
        }
      });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const taxType = searchParams.get('taxType');

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (taxType) {
      query.taxType = taxType;
    }

    const taxCompliance = await TaxCompliance.find(query)
      .populate('client', 'name email gstin pan')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await TaxCompliance.countDocuments(query);

    return NextResponse.json({
      taxCompliance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Get tax compliance error:', error);
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
    console.log('Tax compliance creation request body:', body);

    const {
      client,
      taxType,
      assessmentYear,
      formType,
      dueDate,
      filingDate,
      taxAmount,
      penalty = 0,
      interest = 0,
      acknowledgmentNumber,
      notes,
      documents = []
    } = body;

    // Validate required fields
    if (!client) {
      return NextResponse.json({ error: 'Client is required' }, { status: 400 });
    }
    if (!taxType) {
      return NextResponse.json({ error: 'Tax type is required' }, { status: 400 });
    }
    if (!assessmentYear) {
      return NextResponse.json({ error: 'Assessment year is required' }, { status: 400 });
    }
    if (!dueDate) {
      return NextResponse.json({ error: 'Due date is required' }, { status: 400 });
    }
    if (!taxAmount || taxAmount < 0) {
      return NextResponse.json({ error: 'Valid tax amount is required' }, { status: 400 });
    }

    // Calculate status based on dates
    let status = 'pending';
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);

    if (filingDate) {
      const filingDateObj = new Date(filingDate);
      if (filingDateObj <= dueDateObj) {
        status = 'filed';
      } else {
        status = 'late';
      }
      if (acknowledgmentNumber) {
        status = 'completed';
      }
    } else if (currentDate > dueDateObj) {
      status = 'late';
    }

    // Calculate total payable
    const totalPayable = Number(taxAmount) + Number(penalty) + Number(interest);

    const taxCompliance = new TaxCompliance({
      client,
      taxType,
      assessmentYear,
      formType: formType || '',
      dueDate: new Date(dueDate),
      filingDate: filingDate ? new Date(filingDate) : undefined,
      status,
      taxAmount: Number(taxAmount),
      penalty: Number(penalty),
      interest: Number(interest),
      totalPayable,
      acknowledgmentNumber: acknowledgmentNumber || '',
      notes: notes || '',
      documents,
      createdBy: authResult.userId
    });

    await taxCompliance.save();
    await taxCompliance.populate('client', 'name email gstin pan');

    return NextResponse.json({
      success: true,
      message: 'Tax compliance record created successfully',
      taxCompliance
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create tax compliance error:', error);

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
