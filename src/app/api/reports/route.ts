import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Mock report data - in production, you'd aggregate data from various models
    const reportData = {
      invoices: {
        total: 25,
        paid: 20,
        pending: 3,
        overdue: 2,
        totalAmount: 1250000,
        paidAmount: 1000000,
        pendingAmount: 200000,
        overdueAmount: 50000,
        averageInvoiceValue: 50000,
        monthlyGrowth: 15.5
      },
      clients: {
        total: 15,
        active: 12,
        inactive: 3,
        newThisMonth: 2,
        totalRevenue: 850000,
        averageRevenuePerClient: 56667,
        topClient: 'Rajesh Kumar',
        topClientRevenue: 150000
      },
      gstFilings: {
        total: 8,
        filed: 6,
        pending: 1,
        late: 1,
        totalTax: 450000,
        filedTax: 400000,
        pendingTax: 30000,
        lateTax: 20000,
        averageFilingTime: 5,
        complianceRate: 75
      },
      payroll: {
        totalEmployees: 5,
        totalGrossSalary: 250000,
        totalNetSalary: 200000,
        totalDeductions: 50000,
        averageSalary: 50000,
        highestPaidEmployee: 'Rahul Sharma',
        lowestPaidEmployee: 'Vikram Singh',
        monthlyPayrollCost: 200000
      },
      accounting: {
        totalIncome: 1500000,
        totalExpenses: 800000,
        netIncome: 700000,
        totalTransactions: 150,
        profitMargin: 46.7,
        expenseBreakdown: {
          payroll: 200000,
          rent: 25000,
          utilities: 15000,
          software: 30000,
          supplies: 10000,
          other: 50000
        },
        incomeBreakdown: {
          serviceRevenue: 1200000,
          consultingFees: 200000,
          otherIncome: 100000
        }
      },
      taxCompliance: {
        gstReturnsFiled: 6,
        gstReturnsPending: 2,
        tdsReturnsFiled: 4,
        tdsReturnsPending: 1,
        totalTaxLiability: 180000,
        totalTaxPaid: 150000,
        totalTaxPending: 30000,
        complianceScore: 85,
        nextDueDate: '2024-03-11',
        upcomingReturns: 3
      },
      financialSummary: {
        currentAssets: 230000,
        currentLiabilities: 50000,
        workingCapital: 180000,
        cashFlow: 120000,
        accountsReceivable: 45000,
        accountsPayable: 25000,
        inventory: 15000,
        fixedAssets: 100000
      },
      performanceMetrics: {
        revenueGrowth: 12.5,
        clientRetentionRate: 85,
        averagePaymentTime: 25,
        invoiceCollectionRate: 80,
        employeeProductivity: 92,
        systemUptime: 99.5,
        customerSatisfaction: 4.2
      }
    };
    
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Mock PDF generation - in production, you'd generate actual PDFs
    const mockPdfBuffer = Buffer.from('Mock PDF content');
    
    return new NextResponse(mockPdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${body.type}-report.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
