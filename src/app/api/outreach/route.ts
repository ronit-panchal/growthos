import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireTenantContext } from '@/lib/tenant';

// GET /api/outreach - List outreach campaigns for a user
export async function GET(request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const campaigns = await db.outreachCampaign.findMany({
      where: { userId: tenant.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching outreach campaigns:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch outreach campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/outreach - Create a new outreach campaign
export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const body = await request.json();
    const {
      name,
      type,
      tone,
      industry,
      targetAudience,
      subjectLine,
      content,
      cta,
      sequence,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    const campaign = await db.outreachCampaign.create({
      data: {
        name,
        type: type || 'cold_email',
        tone: tone || 'professional',
        industry: industry || null,
        targetAudience: targetAudience || null,
        subjectLine: subjectLine || null,
        content: content || null,
        cta: cta || null,
        sequence: sequence ? JSON.stringify(sequence) : null,
        status: 'draft',
        userId: tenant.userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'outreach_created',
        title: 'Outreach campaign created',
        description: `"${name}" campaign was created`,
        userId: tenant.userId,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating outreach campaign:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create outreach campaign' },
      { status: 500 }
    );
  }
}
