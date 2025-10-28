import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Payroll from '@/models/Payroll';
import Employee from '@/models/Employee';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const month = searchParams.get('month');
    const employeeId = searchParams.get('employeeId');

    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (month) {
      query.month = month;
    }
    
    if (employeeId) {
      query.employee = employeeId;
    }

    const payrolls = await Payroll.find(query)
      .populate('employee', 'name email employeeId designation department')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(payrolls);

  } catch (error: any) {
    console.error('Get payrolls error:', error);
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
      employee, 
      month, 
      year, 
      basicSalary, 
      hra, 
      allowances, 
      deductions 
    } = body;

    // Validate employee exists
    const employeeDoc = await Employee.findById(employee);
    if (!employeeDoc) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if payroll already exists for this employee and month
    const existingPayroll = await Payroll.findOne({ 
      employee, 
      month, 
      year 
    });
    if (existingPayroll) {
      return NextResponse.json(
        { error: 'Payroll already exists for this employee and month' },
        { status: 400 }
      );
    }

    const payroll = new Payroll({
      employee,
      month,
      year,
      basicSalary,
      hra,
      allowances,
      deductions,
      createdBy: authResult.userId
    });

    await payroll.save();

    // Populate the created payroll
    await payroll.populate('employee', 'name email employeeId designation department');

    return NextResponse.json({
      success: true,
      message: 'Payroll created successfully',
      payroll
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create payroll error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
