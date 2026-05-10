export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise'

export type PlanLimitConfig = {
  monthlyLeads: number
  monthlyAudits: number
  teamMembers: number
}

export const PLAN_LIMITS: Record<PlanId, PlanLimitConfig> = {
  free: { monthlyLeads: 50, monthlyAudits: 1, teamMembers: 1 },
  starter: { monthlyLeads: 500, monthlyAudits: 10, teamMembers: 2 },
  pro: { monthlyLeads: 2000, monthlyAudits: 100, teamMembers: 10 },
  enterprise: { monthlyLeads: Number.MAX_SAFE_INTEGER, monthlyAudits: Number.MAX_SAFE_INTEGER, teamMembers: 100 },
}

type UsageSnapshot = {
  leads: number
  audits: number
  members: number
}

export function assertWithinPlanLimit(plan: PlanId, usage: UsageSnapshot) {
  const limits = PLAN_LIMITS[plan]

  if (usage.leads >= limits.monthlyLeads) {
    throw new Error('Lead limit reached for current plan')
  }

  if (usage.audits >= limits.monthlyAudits) {
    throw new Error('Audit limit reached for current plan')
  }

  if (usage.members >= limits.teamMembers) {
    throw new Error('Team member limit reached for current plan')
  }
}
