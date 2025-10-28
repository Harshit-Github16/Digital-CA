import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Employee from '@/models/Employee';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const employees = await Employee.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(employees);

  } catch (error: any) {
    console.error('Get employees error:', error);
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
      name, 
      email, 
      phone, 
      designation, 
      department, 
      joiningDate, 
      salary, 
      bankDetails, 
      address, 
      pan, 
      aadhar 
    } = body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee already exists with this email' },
        { status: 400 }
      );
    }

    const employee = new Employee({
      name,
      email,
      phone,
      designation,
      department,
      joiningDate: new Date(joiningDate),
      salary,
      bankDetails,
      address,
      pan,
      aadhar,
      createdBy: authResult.userId
    });

    await employee.save();

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      employee
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
