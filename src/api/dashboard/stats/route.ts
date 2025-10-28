import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client';
import GSTFiling from '@/models/GSTFiling';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Calculate total sales for current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const totalSales = await Invoice.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['sent', 'paid'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Calculate tax liability
    const taxLiability = await Invoice.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['sent', 'paid'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$taxAmount' }
        }
      }
    ]);

    // Calculate ITC (Input Tax Credit)
    const itc = await Invoice.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['sent', 'paid'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$taxAmount', 0.5] } } // Assuming 50% ITC
        }
      }
    ]);

    // Count pending returns
    const pendingReturns = await GSTFiling.countDocuments({
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    // Count total clients
    const totalClients = await Client.countDocuments({ isActive: true });

    // Count active invoices
    const activeInvoices = await Invoice.countDocuments({
      status: { $in: ['sent', 'draft'] }
    });

    // Calculate monthly growth (mock data for now)
    const monthlyGrowth = 12.5;

    // Calculate revenue
    const revenue = totalSales[0]?.total || 0;

    const stats = {
      totalSales: totalSales[0]?.total || 0,
      taxLiability: taxLiability[0]?.total || 0,
      itc: itc[0]?.total || 0,
      pendingReturns,
      totalClients,
      activeInvoices,
      monthlyGrowth,
      revenue
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
