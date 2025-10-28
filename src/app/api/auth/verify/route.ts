import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);

    if (!authResult) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authResult.userId,
        email: authResult.email,
        role: authResult.role
      },
      token: request.headers.get('authorization')?.replace('Bearer ', '')
    });

  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed', details: error.message },
      { status: 500 }
    );
  }
}
