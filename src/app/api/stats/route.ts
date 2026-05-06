import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/stats - Get dashboard stats for a user
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

    // Get lead counts and pipeline values
    const [
      totalLeads,
      qualifiedLeads,
      wonLeads,
      pipelineLeads,
      proposalCount,
      recentActivities,
    ] = await Promise.all([
      // Total leads
      db.lead.count({ where: { userId } }),
      // Qualified leads (qualified, proposal, negotiation stages)
      db.lead.count({
        where: {
          userId,
          status: { in: ['qualified', 'proposal', 'negotiation'] },
        },
      }),
      // Won leads
      db.lead.count({
        where: { userId, status: 'won' },
      }),
      // Pipeline leads (not won or lost)
      db.lead.findMany({
        where: {
          userId,
          status: { notIn: ['won', 'lost'] },
        },
        select: { value: true },
      }),
      // Proposals sent
      db.proposal.count({
        where: {
          userId,
          status: { in: ['sent', 'viewed'] },
        },
      }),
      // Recent activities
      db.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate pipeline value
    const pipelineValue = pipelineLeads.reduce((sum, lead) => sum + lead.value, 0);

    // Get won value
    const wonLeadValues = await db.lead.findMany({
      where: { userId, status: 'won' },
      select: { value: true },
    });
    const wonValue = wonLeadValues.reduce((sum, lead) => sum + lead.value, 0);

    // Calculate conversion rate
    const conversionRate = totalLeads > 0
      ? Math.round((wonLeads / totalLeads) * 100)
      : 0;

    // Get monthly revenue (proposals accepted this month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const acceptedProposals = await db.proposal.findMany({
      where: {
        userId,
        status: 'accepted',
        acceptedAt: { gte: startOfMonth },
      },
      select: { totalValue: true },
    });
    const monthlyRevenue = acceptedProposals.reduce(
      (sum, proposal) => sum + proposal.totalValue,
      0
    );

    // If no data exists in the database, return demo-friendly zeros
    // The frontend can detect this and show demo data instead
    const stats = {
      totalLeads,
      qualifiedLeads,
      pipelineValue,
      wonValue,
      conversionRate,
      proposalsSent: proposalCount,
      monthlyRevenue,
      recentActivities,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
