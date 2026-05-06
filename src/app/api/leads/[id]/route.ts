import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/leads/[id] - Get lead by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PUT /api/leads/[id] - Update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      title,
      source,
      status,
      score,
      value,
      tags,
      notes,
      website,
      linkedin,
    } = body;

    // Check if lead exists
    const existingLead = await db.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (title !== undefined) updateData.title = title;
    if (source !== undefined) updateData.source = source;
    if (status !== undefined) updateData.status = status;
    if (score !== undefined) updateData.score = parseInt(String(score));
    if (value !== undefined) updateData.value = parseFloat(String(value));
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (notes !== undefined) updateData.notes = JSON.stringify(notes);
    if (website !== undefined) updateData.website = website;
    if (linkedin !== undefined) updateData.linkedin = linkedin;

    // If status changed, update lastContactAt and create activity
    if (status && status !== existingLead.status) {
      updateData.lastContactAt = new Date();

      await db.activity.create({
        data: {
          type: 'lead_status_change',
          title: `Lead moved to ${status}`,
          description: `${existingLead.name} moved from ${existingLead.status} to ${status}`,
          userId: existingLead.userId,
          leadId: id,
        },
      });
    }

    const lead = await db.lead.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete lead by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if lead exists
    const existingLead = await db.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Delete associated activities first
    await db.activity.deleteMany({
      where: { leadId: id },
    });

    // Delete the lead
    await db.lead.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
