import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireTenantContext } from '@/lib/tenant';

// GET /api/audits - List audit jobs for a user
export async function GET(request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const audits = await db.auditJob.findMany({
      where: { userId: tenant.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Error fetching audits:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}

// POST /api/audits - Create a new audit job
export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'url is required' },
        { status: 400 }
      );
    }

    const audit = await db.auditJob.create({
      data: {
        url,
        status: 'pending',
        progress: 0,
        userId: tenant.userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'audit_started',
        title: 'New audit started',
        description: `Audit started for ${url}`,
        userId: tenant.userId,
      },
    });

    return NextResponse.json({ audit }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 500 }
    );
  }
}
