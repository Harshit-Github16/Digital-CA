import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Debug environment variables
        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpire = process.env.JWT_EXPIRE;
        const mongoUri = process.env.MONGODB_URI;

        return NextResponse.json({
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                hasJwtSecret: !!jwtSecret,
                jwtSecretLength: jwtSecret?.length || 0,
                jwtExpire: jwtExpire || 'not set',
                hasMongoUri: !!mongoUri,
                mongoUriStart: mongoUri?.substring(0, 20) + '...' || 'not set'
            },
            headers: {
                authorization: request.headers.get('authorization'),
                contentType: request.headers.get('content-type'),
                userAgent: request.headers.get('user-agent')
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Debug endpoint error',
            details: error.message
        }, { status: 500 });
    }
}