import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedDatabase';

export async function POST(request: NextRequest) {
    try {
        // In production, you might want to add authentication here
        const result = await seedDatabase();

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            data: result
        });
    } catch (error: any) {
        console.error('Seed database error:', error);
        return NextResponse.json(
            { error: 'Failed to seed database', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST method to seed the database',
        endpoint: '/api/seed',
        method: 'POST'
    });
}