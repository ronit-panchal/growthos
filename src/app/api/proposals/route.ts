import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { requireTenantContext } from '@/lib/tenant';

// GET /api/proposals - List proposals for a user
export async function GET(request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const proposals = await db.proposal.findMany({
      where: { userId: tenant.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const body = await request.json();
    const {
      title,
      clientName,
      clientEmail,
      sections,
      pricing,
      totalValue,
    } = body;

    if (!title || !clientName) {
      return NextResponse.json(
        { error: 'title and clientName are required' },
        { status: 400 }
      );
    }

    const proposal = await db.proposal.create({
      data: {
        title,
        clientName,
        clientEmail: clientEmail || null,
        sections: sections ? JSON.stringify(sections) : null,
        pricing: pricing ? JSON.stringify(pricing) : null,
        totalValue: totalValue ? parseFloat(String(totalValue)) : 0,
        shareToken: crypto.randomUUID(),
        status: 'draft',
        userId: tenant.userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'proposal_created',
        title: 'Proposal created',
        description: `"${title}" proposal created for ${clientName}`,
        userId: tenant.userId,
      },
    });

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}
