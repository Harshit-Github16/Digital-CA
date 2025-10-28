import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Mock save - in production, you'd save to a Settings model
    console.log('Saving user settings:', body);
    
    return NextResponse.json({ success: true, message: 'User settings saved successfully' });
  } catch (error) {
    console.error('Error saving user settings:', error);
    return NextResponse.json({ error: 'Failed to save user settings' }, { status: 500 });
  }
}
