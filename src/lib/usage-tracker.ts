type UsageCounter = {
  leads: number
  audits: number
  members: number
  monthKey: string
}

const usageStore = new Map<string, UsageCounter>()

function currentMonthKey() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

function getOrInitUsage(orgId: string) {
  const monthKey = currentMonthKey()
  const current = usageStore.get(orgId)

  if (!current || current.monthKey !== monthKey) {
    const fresh = { leads: 0, audits: 0, members: 0, monthKey }
    usageStore.set(orgId, fresh)
    return fresh
  }

  return current
}

export function getUsage(orgId: string) {
  return getOrInitUsage(orgId)
}

export function incrementUsage(orgId: string, event: 'leads' | 'audits' | 'members', count = 1) {
  const usage = getOrInitUsage(orgId)
  usage[event] += count
  usageStore.set(orgId, usage)
  return usage
}
