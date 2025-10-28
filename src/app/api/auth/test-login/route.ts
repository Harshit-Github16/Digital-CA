import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        console.log('Test login endpoint accessed');

        // Create a test user object
        const testUser = {
            _id: 'test-user-id',
            name: 'Test Admin',
            email: 'admin@digitalca.com',
            role: 'admin',
            isActive: true
        };

        // Generate JWT token (use a default secret if not set)
        const jwtSecret = process.env.JWT_SECRET || 'test-secret-key-for-development';
        const token = jwt.sign(
            {
                userId: testUser._id,
                email: testUser.email,
                role: testUser.role
            },
            jwtSecret,
            { expiresIn: '7d' }
        );

        console.log('Test login successful, token generated');

        return NextResponse.json({
            success: true,
            message: 'Test login successful',
            token,
            user: testUser
        });

    } catch (error: any) {
        console.error('Test login error:', error);
        return NextResponse.json(
            { error: 'Test login failed', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Test Login Endpoint',
        instructions: 'POST to this endpoint to get a test token',
        credentials: 'No credentials required - just POST empty body'
    });
}