import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireTenantContext } from '@/lib/tenant';

// GET /api/stats - Get dashboard stats for a user
export async function GET(_request: NextRequest) {
  try {
    const tenant = await requireTenantContext();
    const userId = tenant.userId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      qualifiedLeads,
      wonLeads,
      auditCount,
      campaignCount,
      pipelineLeads,
      proposalCount,
      recentActivities,
      allLeads,
      allActivities,
      allProposals,
      allAudits,
    ] = await Promise.all([
      db.lead.count({ where: { userId } }),
      db.lead.count({
        where: {
          userId,
          status: { in: ['qualified', 'proposal', 'negotiation'] },
        },
      }),
      db.lead.count({
        where: { userId, status: 'won' },
      }),
      db.auditJob.count({ where: { userId } }),
      db.outreachCampaign.count({ where: { userId } }),
      db.lead.findMany({
        where: {
          userId,
          status: { notIn: ['won', 'lost'] },
        },
        select: { value: true },
      }),
      db.proposal.count({
        where: {
          userId,
          status: { in: ['sent', 'viewed'] },
        },
      }),
      db.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.lead.findMany({
        where: { userId },
        select: { status: true, createdAt: true, value: true },
      }),
      db.activity.findMany({
        where: { userId },
        select: { type: true, createdAt: true },
      }),
      db.proposal.findMany({
        where: { userId },
        select: { status: true, createdAt: true, totalValue: true },
      }),
      db.auditJob.findMany({
        where: { userId },
        select: { status: true, createdAt: true, overallScore: true },
      }),
    ]);

    const pipelineValue = pipelineLeads.reduce((sum, lead) => sum + lead.value, 0);
    const wonLeadValues = await db.lead.findMany({
      where: { userId, status: 'won' },
      select: { value: true },
    });
    const wonValue = wonLeadValues.reduce((sum, lead) => sum + lead.value, 0);
    const conversionRate = totalLeads > 0
      ? Math.round((wonLeads / totalLeads) * 100)
      : 0;
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

    const stageOrder = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const pipelineByStage = stageOrder.map((stage) => ({
      stage,
      count: allLeads.filter((lead) => lead.status === stage).length,
      value: allLeads
        .filter((lead) => lead.status === stage)
        .reduce((sum, lead) => sum + lead.value, 0),
    }));

    const activityByTypeMap = new Map<string, number>();
    for (const activity of allActivities) {
      activityByTypeMap.set(activity.type, (activityByTypeMap.get(activity.type) || 0) + 1);
    }
    const activityByType = Array.from(activityByTypeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const trendMonths = Array.from({ length: 6 }, (_, offset) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - offset), 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        label: date.toLocaleString('en-US', { month: 'short' }),
        key,
        leads: 0,
        audits: 0,
        proposals: 0,
      };
    });

    for (const lead of allLeads) {
      const key = `${lead.createdAt.getFullYear()}-${String(lead.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const month = trendMonths.find((entry) => entry.key === key);
      if (month) month.leads += 1;
    }

    for (const audit of allAudits) {
      const key = `${audit.createdAt.getFullYear()}-${String(audit.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const month = trendMonths.find((entry) => entry.key === key);
      if (month) month.audits += 1;
    }

    for (const proposal of allProposals) {
      const key = `${proposal.createdAt.getFullYear()}-${String(proposal.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const month = trendMonths.find((entry) => entry.key === key);
      if (month) month.proposals += 1;
    }

    const activeLeadsThisMonth = allLeads.filter((lead) => lead.createdAt >= startOfMonth).length;
    const completedAudits = allAudits.filter((audit) => audit.status === 'completed').length;
    const acceptedProposalCount = allProposals.filter((proposal) => proposal.status === 'accepted').length;
    const averageAuditScore =
      allAudits.filter((audit) => typeof audit.overallScore === 'number').reduce((sum, audit) => sum + (audit.overallScore || 0), 0) /
      Math.max(1, allAudits.filter((audit) => typeof audit.overallScore === 'number').length);

    const stats = {
      totalLeads,
      qualifiedLeads,
      pipelineValue,
      wonValue,
      conversionRate,
      proposalsSent: proposalCount,
      monthlyRevenue,
      auditCount,
      campaignCount,
      activeLeadsThisMonth,
      completedAudits,
      acceptedProposalCount,
      averageAuditScore: Number.isFinite(averageAuditScore) ? Math.round(averageAuditScore) : 0,
      pipelineByStage,
      activityByType,
      trend: trendMonths.map(({ key, ...item }) => item),
      recentActivities,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
