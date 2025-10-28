import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from './mongodb';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export async function verifyToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function requireAuth(roles?: string[]) {
  return async (request: NextRequest): Promise<{ user: AuthUser } | { error: string }> => {
    const user = await verifyToken(request);
    
    if (!user) {
      return { error: 'Unauthorized' };
    }

    if (roles && !roles.includes(user.role)) {
      return { error: 'Forbidden' };
    }

    return { user };
  };
}
