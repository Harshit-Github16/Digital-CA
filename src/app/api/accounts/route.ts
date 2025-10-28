import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Mock data for accounts
const mockAccounts = [
  {
    _id: '1',
    name: 'HDFC Bank Current Account',
    type: 'asset',
    category: 'Bank Account',
    balance: 150000,
    accountNumber: '1234567890',
    bankName: 'HDFC Bank',
    branch: 'MG Road, Bangalore',
    ifscCode: 'HDFC0001234',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '2',
    name: 'Cash Account',
    type: 'asset',
    category: 'Cash',
    balance: 5000,
    accountNumber: 'CASH-001',
    bankName: 'Cash',
    branch: 'Office',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '3',
    name: 'Office Rent Expense',
    type: 'expense',
    category: 'Rent',
    balance: 0,
    accountNumber: 'EXP-RENT-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '4',
    name: 'Service Revenue',
    type: 'income',
    category: 'Revenue',
    balance: 0,
    accountNumber: 'INC-SRV-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '5',
    name: 'ICICI Bank Savings',
    type: 'asset',
    category: 'Bank Account',
    balance: 75000,
    accountNumber: '9876543210',
    bankName: 'ICICI Bank',
    branch: 'Koramangala, Bangalore',
    ifscCode: 'ICIC0009876',
    isActive: true,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '6',
    name: 'Office Supplies Expense',
    type: 'expense',
    category: 'Office Supplies',
    balance: 0,
    accountNumber: 'EXP-SUP-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '7',
    name: 'GST Payable',
    type: 'liability',
    category: 'Tax Payable',
    balance: 25000,
    accountNumber: 'LIAB-GST-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '8',
    name: 'Accounts Receivable',
    type: 'asset',
    category: 'Receivables',
    balance: 45000,
    accountNumber: 'AR-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '9',
    name: 'Employee Salary Expense',
    type: 'expense',
    category: 'Payroll',
    balance: 0,
    accountNumber: 'EXP-SAL-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    _id: '10',
    name: 'Professional Fees Revenue',
    type: 'income',
    category: 'Revenue',
    balance: 0,
    accountNumber: 'INC-PROF-001',
    bankName: 'N/A',
    branch: 'N/A',
    ifscCode: 'N/A',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-28')
  }
];

export async function GET() {
  try {
    await connectDB();
    // For now, return mock data. In production, you'd fetch from an Account model
    return NextResponse.json(mockAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
