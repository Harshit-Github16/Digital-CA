import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Employee from '@/models/Employee';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if employees already exist
    const existingEmployees = await Employee.find();
    if (existingEmployees.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Default employees already exist'
      });
    }

    // Create default employees
    const defaultEmployees = [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '9876543210',
        designation: 'Software Developer',
        department: 'IT',
        joiningDate: new Date('2023-01-15'),
        salary: {
          basic: 50000,
          hra: 15000,
          allowances: 5000,
          total: 70000
        },
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India'
        },
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        pan: 'ABCDE1234F',
        aadhar: '123456789012'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '9876543211',
        designation: 'HR Manager',
        department: 'Human Resources',
        joiningDate: new Date('2023-02-01'),
        salary: {
          basic: 60000,
          hra: 18000,
          allowances: 7000,
          total: 85000
        },
        bankDetails: {
          accountNumber: '1234567891',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank'
        },
        address: {
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        pan: 'FGHIJ5678K',
        aadhar: '123456789013'
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        phone: '9876543212',
        designation: 'Accountant',
        department: 'Finance',
        joiningDate: new Date('2023-03-01'),
        salary: {
          basic: 45000,
          hra: 13500,
          allowances: 4000,
          total: 62500
        },
        bankDetails: {
          accountNumber: '1234567892',
          ifscCode: 'ICIC0001234',
          bankName: 'ICICI Bank'
        },
        address: {
          street: '789 Business District',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        pan: 'LMNOP9012Q',
        aadhar: '123456789014'
      }
    ];

    const employees = await Employee.insertMany(
      defaultEmployees.map(employee => ({
        ...employee,
        createdBy: authResult.userId
      }))
    );

    return NextResponse.json({
      success: true,
      message: 'Default employees created successfully',
      employees
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create default employees error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
