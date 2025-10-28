import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import Invoice from '@/models/Invoice';
import GSTFiling from '@/models/GSTFiling';
import TaxCompliance from '@/models/TaxCompliance';

export async function GET() {
    try {
        await connectDB();

        // Test database connection and count documents
        const clientCount = await Client.countDocuments();
        const invoiceCount = await Invoice.countDocuments();
        const gstFilingCount = await GSTFiling.countDocuments();
        const taxComplianceCount = await TaxCompliance.countDocuments();

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            counts: {
                clients: clientCount,
                invoices: invoiceCount,
                gstFilings: gstFilingCount,
                taxCompliance: taxComplianceCount
            },
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Database test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Database connection failed',
                details: error.message
            },
            { status: 500 }
        );
    }
}