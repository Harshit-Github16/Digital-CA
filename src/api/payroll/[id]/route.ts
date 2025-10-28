import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Payroll from '@/models/Payroll';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { 
      month, 
      year, 
      basicSalary, 
      hra, 
      allowances, 
      deductions,
      status,
      paymentDate,
      payslipGenerated
    } = body;

    const updateData: any = {
      month,
      year,
      basicSalary,
      hra,
      allowances,
      deductions
    };

    if (status) updateData.status = status;
    if (paymentDate) updateData.paymentDate = new Date(paymentDate);
    if (payslipGenerated !== undefined) updateData.payslipGenerated = payslipGenerated;

    const payroll = await Payroll.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employee', 'name email employeeId designation department');

    if (!payroll) {
      return NextResponse.json(
        { error: 'Payroll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payroll updated successfully',
      payroll
    });

  } catch (error: any) {
    console.error('Update payroll error:', error);
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

    const payroll = await Payroll.findByIdAndDelete(params.id);

    if (!payroll) {
      return NextResponse.json(
        { error: 'Payroll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payroll deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete payroll error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
