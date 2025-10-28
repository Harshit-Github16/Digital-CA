import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payroll from '@/models/Payroll';
import Employee from '@/models/Employee';

export async function GET() {
  try {
    await connectDB();
    const payrolls = await Payroll.find()
      .populate('employee', 'name employeeId position department')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    // If no payrolls exist, return dummy data
    if (payrolls.length === 0) {
      const dummyPayrolls = [
        {
          _id: '1',
          employee: { _id: '1', name: 'Rahul Sharma', employeeId: 'EMP001', position: 'Senior Developer', department: 'IT' },
          month: '2024-01',
          year: 2024,
          basicSalary: 50000,
          allowances: {
            hra: 15000,
            transport: 2000,
            medical: 1500,
            other: 1000
          },
          deductions: {
            pf: 6000,
            esi: 750,
            tds: 5000,
            other: 500
          },
          grossSalary: 69500,
          netSalary: 57250,
          status: 'paid',
          paymentDate: new Date('2024-02-01'),
          paymentMethod: 'Bank Transfer',
          notes: 'Monthly salary for January 2024',
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2024-01-31'),
          updatedAt: new Date('2024-02-01')
        },
        {
          _id: '2',
          employee: { _id: '2', name: 'Priya Patel', employeeId: 'EMP002', position: 'Accountant', department: 'Finance' },
          month: '2024-01',
          year: 2024,
          basicSalary: 35000,
          allowances: {
            hra: 10500,
            transport: 1500,
            medical: 1000,
            other: 500
          },
          deductions: {
            pf: 4200,
            esi: 525,
            tds: 3500,
            other: 300
          },
          grossSalary: 48500,
          netSalary: 39975,
          status: 'paid',
          paymentDate: new Date('2024-02-01'),
          paymentMethod: 'Bank Transfer',
          notes: 'Monthly salary for January 2024',
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2024-01-31'),
          updatedAt: new Date('2024-02-01')
        },
        {
          _id: '3',
          employee: { _id: '3', name: 'Amit Kumar', employeeId: 'EMP003', position: 'Marketing Manager', department: 'Marketing' },
          month: '2024-01',
          year: 2024,
          basicSalary: 45000,
          allowances: {
            hra: 13500,
            transport: 2500,
            medical: 1200,
            other: 800
          },
          deductions: {
            pf: 5400,
            esi: 675,
            tds: 4500,
            other: 400
          },
          grossSalary: 60000,
          netSalary: 49025,
          status: 'pending',
          paymentDate: null,
          paymentMethod: 'Bank Transfer',
          notes: 'Salary processing for February 2024',
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2024-02-28'),
          updatedAt: new Date('2024-02-28')
        },
        {
          _id: '4',
          employee: { _id: '4', name: 'Sunita Reddy', employeeId: 'EMP004', position: 'HR Executive', department: 'HR' },
          month: '2024-01',
          year: 2024,
          basicSalary: 30000,
          allowances: {
            hra: 9000,
            transport: 1200,
            medical: 800,
            other: 400
          },
          deductions: {
            pf: 3600,
            esi: 450,
            tds: 3000,
            other: 250
          },
          grossSalary: 41400,
          netSalary: 34100,
          status: 'paid',
          paymentDate: new Date('2024-02-01'),
          paymentMethod: 'Bank Transfer',
          notes: 'Monthly salary for January 2024',
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2024-01-31'),
          updatedAt: new Date('2024-02-01')
        },
        {
          _id: '5',
          employee: { _id: '5', name: 'Vikram Singh', employeeId: 'EMP005', position: 'Sales Executive', department: 'Sales' },
          month: '2024-01',
          year: 2024,
          basicSalary: 25000,
          allowances: {
            hra: 7500,
            transport: 1000,
            medical: 600,
            other: 300
          },
          deductions: {
            pf: 3000,
            esi: 375,
            tds: 2500,
            other: 200
          },
          grossSalary: 34400,
          netSalary: 28325,
          status: 'paid',
          paymentDate: new Date('2024-02-01'),
          paymentMethod: 'Bank Transfer',
          notes: 'Monthly salary for January 2024',
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2024-01-31'),
          updatedAt: new Date('2024-02-01')
        }
      ];
      
      return NextResponse.json(dummyPayrolls);
    }
    
    return NextResponse.json(payrolls);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    return NextResponse.json({ error: 'Failed to fetch payrolls' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const payroll = new Payroll({
      ...body,
      createdBy: body.createdBy || '64f8b8b8b8b8b8b8b8b8b8b8' // Default user ID
    });
    
    await payroll.save();
    await payroll.populate('employee', 'name employeeId position department');
    
    return NextResponse.json(payroll, { status: 201 });
  } catch (error) {
    console.error('Error creating payroll:', error);
    return NextResponse.json({ error: 'Failed to create payroll' }, { status: 500 });
  }
}
