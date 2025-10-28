import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Mock save - in production, you'd save to a Settings model
    console.log('Saving system settings:', body);
    
    return NextResponse.json({ success: true, message: 'System settings saved successfully' });
  } catch (error) {
    console.error('Error saving system settings:', error);
    return NextResponse.json({ error: 'Failed to save system settings' }, { status: 500 });
  }
}
