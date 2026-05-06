import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/audits - List audit jobs for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const audits = await db.auditJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}

// POST /api/audits - Create a new audit job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, userId } = body;

    if (!url || !userId) {
      return NextResponse.json(
        { error: 'url and userId are required' },
        { status: 400 }
      );
    }

    const audit = await db.auditJob.create({
      data: {
        url,
        status: 'pending',
        progress: 0,
        userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'audit_started',
        title: 'New audit started',
        description: `Audit started for ${url}`,
        userId,
      },
    });

    return NextResponse.json({ audit }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit:', error);
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 500 }
    );
  }
}
