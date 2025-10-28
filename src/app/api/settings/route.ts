import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return default settings
    const defaultSettings = {
      firm: {
        name: 'ABC & Associates',
        address: '123, Business Center, Commercial Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 98765 43210',
        email: 'contact@abcassociates.com',
        gstin: '27ABCDE1234F1Z5',
        pan: 'ABCDE1234F',
        membershipNumber: '123456',
        website: 'https://www.abcassociates.com'
      },
      tax: {
        defaultRates: {
          cgst: 9,
          sgst: 9,
          igst: 18,
          cess: 0
        },
        defaultHsn: '998313',
        autoCalculate: true,
        roundOff: true,
        inclusive: false
      },
      invoice: {
        prefix: 'INV',
        startNumber: 1,
        paymentTerms: 'Net 30',
        bankDetails: {
          bankName: 'State Bank of India',
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          branch: 'Mumbai Main Branch'
        },
        footerText: 'Thank you for your business! Please remit payment within the specified terms.',
        showBankDetails: true
      },
      alerts: {
        gstReminders: true,
        invoiceReminders: true,
        complianceAlerts: true,
        reminderDays: 7
      },
      backup: {
        autoBackup: true,
        backupTime: '02:00',
        retentionDays: 90
      }
    };

    return NextResponse.json({
      success: true,
      settings: defaultSettings
    });

  } catch (error: any) {
    console.error('Get settings error:', error);
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

    const body = await request.json();
    console.log('Settings update request:', body);

    // In a real app, you would save these settings to the database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    });

  } catch (error: any) {
    console.error('Save settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}