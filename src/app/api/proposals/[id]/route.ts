import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/proposals/[id] - Get proposal by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await db.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposals/[id] - Update proposal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      clientName,
      clientEmail,
      status,
      sections,
      pricing,
      totalValue,
      sentAt,
      viewedAt,
      acceptedAt,
    } = body;

    // Check if proposal exists
    const existingProposal = await db.proposal.findUnique({ where: { id } });
    if (!existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (clientName !== undefined) updateData.clientName = clientName;
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail;
    if (status !== undefined) updateData.status = status;
    if (sections !== undefined) updateData.sections = JSON.stringify(sections);
    if (pricing !== undefined) updateData.pricing = JSON.stringify(pricing);
    if (totalValue !== undefined) updateData.totalValue = parseFloat(String(totalValue));
    if (sentAt !== undefined) updateData.sentAt = sentAt ? new Date(sentAt) : null;
    if (viewedAt !== undefined) updateData.viewedAt = viewedAt ? new Date(viewedAt) : null;
    if (acceptedAt !== undefined) updateData.acceptedAt = acceptedAt ? new Date(acceptedAt) : null;

    const proposal = await db.proposal.update({
      where: { id },
      data: updateData,
    });

    // Create activity for status changes
    if (status && status !== existingProposal.status) {
      const activityMap: Record<string, { type: string; title: string; description: string }> = {
        sent: {
          type: 'proposal_sent',
          title: 'Proposal sent',
          description: `"${existingProposal.title}" proposal sent to ${existingProposal.clientName} ($${existingProposal.totalValue.toLocaleString()})`,
        },
        viewed: {
          type: 'proposal_viewed',
          title: 'Proposal viewed',
          description: `${existingProposal.clientName} viewed the "${existingProposal.title}" proposal`,
        },
        accepted: {
          type: 'proposal_accepted',
          title: 'Proposal accepted',
          description: `${existingProposal.clientName} accepted the "${existingProposal.title}" proposal ($${existingProposal.totalValue.toLocaleString()})`,
        },
        rejected: {
          type: 'proposal_rejected',
          title: 'Proposal rejected',
          description: `${existingProposal.clientName} rejected the "${existingProposal.title}" proposal`,
        },
      };

      const activity = activityMap[status];
      if (activity) {
        await db.activity.create({
          data: {
            ...activity,
            userId: existingProposal.userId,
          },
        });
      }
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals/[id] - Delete proposal by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if proposal exists
    const existingProposal = await db.proposal.findUnique({ where: { id } });
    if (!existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    await db.proposal.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}
