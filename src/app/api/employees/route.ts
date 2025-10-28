import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    // If no employees exist, return dummy data
    if (employees.length === 0) {
      const dummyEmployees = [
        {
          _id: '1',
          name: 'Rahul Sharma',
          email: 'rahul@company.com',
          phone: '+91 98765 43210',
          employeeId: 'EMP001',
          position: 'Senior Developer',
          department: 'IT',
          joiningDate: new Date('2023-01-15'),
          salary: 50000,
          address: {
            street: '123 Tech Park',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Priya Sharma',
            phone: '+91 98765 43211',
            relation: 'Spouse'
          },
          isActive: true,
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date('2023-01-15')
        },
        {
          _id: '2',
          name: 'Priya Patel',
          email: 'priya@company.com',
          phone: '+91 87654 32109',
          employeeId: 'EMP002',
          position: 'Accountant',
          department: 'Finance',
          joiningDate: new Date('2023-02-01'),
          salary: 35000,
          address: {
            street: '456 Finance Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Raj Patel',
            phone: '+91 87654 32110',
            relation: 'Father'
          },
          isActive: true,
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2023-02-01'),
          updatedAt: new Date('2023-02-01')
        },
        {
          _id: '3',
          name: 'Amit Kumar',
          email: 'amit@company.com',
          phone: '+91 76543 21098',
          employeeId: 'EMP003',
          position: 'Marketing Manager',
          department: 'Marketing',
          joiningDate: new Date('2023-03-10'),
          salary: 45000,
          address: {
            street: '789 Marketing Avenue',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Sunita Kumar',
            phone: '+91 76543 21099',
            relation: 'Mother'
          },
          isActive: true,
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2023-03-10'),
          updatedAt: new Date('2023-03-10')
        },
        {
          _id: '4',
          name: 'Sunita Reddy',
          email: 'sunita@company.com',
          phone: '+91 65432 10987',
          employeeId: 'EMP004',
          position: 'HR Executive',
          department: 'HR',
          joiningDate: new Date('2023-04-05'),
          salary: 30000,
          address: {
            street: '321 HR Plaza',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Ravi Reddy',
            phone: '+91 65432 10988',
            relation: 'Brother'
          },
          isActive: true,
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2023-04-05'),
          updatedAt: new Date('2023-04-05')
        },
        {
          _id: '5',
          name: 'Vikram Singh',
          email: 'vikram@company.com',
          phone: '+91 54321 09876',
          employeeId: 'EMP005',
          position: 'Sales Executive',
          department: 'Sales',
          joiningDate: new Date('2023-05-20'),
          salary: 25000,
          address: {
            street: '654 Sales Center',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Kavita Singh',
            phone: '+91 54321 09877',
            relation: 'Wife'
          },
          isActive: true,
          createdBy: { _id: '1', name: 'Admin User' },
          createdAt: new Date('2023-05-20'),
          updatedAt: new Date('2023-05-20')
        }
      ];
      
      return NextResponse.json(dummyEmployees);
    }
    
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const employee = new Employee({
      ...body,
      createdBy: body.createdBy || '64f8b8b8b8b8b8b8b8b8b8b8' // Default user ID
    });
    
    await employee.save();
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
