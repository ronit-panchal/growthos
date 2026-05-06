import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// GET /api/proposals - List proposals for a user
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

    const proposals = await db.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      clientName,
      clientEmail,
      sections,
      pricing,
      totalValue,
      userId,
    } = body;

    if (!title || !clientName || !userId) {
      return NextResponse.json(
        { error: 'title, clientName, and userId are required' },
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
        userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'proposal_created',
        title: 'Proposal created',
        description: `"${title}" proposal created for ${clientName}`,
        userId,
      },
    });

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}
