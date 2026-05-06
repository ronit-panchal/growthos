import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/activities - List activities for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const activities = await db.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, metadata, userId, leadId } = body;

    if (!type || !title || !userId) {
      return NextResponse.json(
        { error: 'type, title, and userId are required' },
        { status: 400 }
      );
    }

    const activity = await db.activity.create({
      data: {
        type,
        title,
        description: description || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userId,
        leadId: leadId || null,
      },
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
