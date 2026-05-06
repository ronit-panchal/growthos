import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/outreach - List outreach campaigns for a user
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

    const campaigns = await db.outreachCampaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching outreach campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outreach campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/outreach - Create a new outreach campaign
export async function POST(request: NextRequest) {
  try {
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
      userId,
    } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'name and userId are required' },
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
        userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'outreach_created',
        title: 'Outreach campaign created',
        description: `"${name}" campaign was created`,
        userId,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating outreach campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create outreach campaign' },
      { status: 500 }
    );
  }
}
