import { PrismaClient } from '@prisma/client'
import { createLocalDelegate } from '@/lib/local-store'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

function isDatabaseConnectivityError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  return [
    'P1001',
    'Can\'t reach database server',
    'Invalid URL',
    'ENOTFOUND',
    'ECONNREFUSED',
    'timed out',
  ].some((fragment) => message.includes(fragment))
}

let hasWarnedAboutFallback = false

async function withFallback<T>(prismaOperation: () => Promise<T>, fallbackOperation: () => Promise<T>) {
  try {
    return await prismaOperation()
  } catch (error) {
    if (!isDatabaseConnectivityError(error)) {
      throw error
    }
    if (!hasWarnedAboutFallback) {
      hasWarnedAboutFallback = true
      console.warn('Prisma is unavailable, so GrowthOS is using the local persistent workspace store.')
    }
    return fallbackOperation()
  }
}

const localDb = {
  user: createLocalDelegate('users'),
  lead: createLocalDelegate('leads'),
  auditJob: createLocalDelegate('audits'),
  outreachCampaign: createLocalDelegate('campaigns'),
  proposal: createLocalDelegate('proposals'),
  activity: createLocalDelegate('activities'),
  subscription: createLocalDelegate('subscriptions'),
  authEvent: createLocalDelegate('authEvents'),
}

export const db = {
  user: {
    findMany: (args?: Parameters<typeof prisma.user.findMany>[0]) =>
      withFallback(() => prisma.user.findMany(args), () => localDb.user.findMany(args as never)),
    findUnique: (args: Parameters<typeof prisma.user.findUnique>[0]) =>
      withFallback(() => prisma.user.findUnique(args), () => localDb.user.findFirst(args as never)),
    findFirst: (args?: Parameters<typeof prisma.user.findFirst>[0]) =>
      withFallback(() => prisma.user.findFirst(args), () => localDb.user.findFirst(args as never)),
    upsert: (args: Parameters<typeof prisma.user.upsert>[0]) =>
      withFallback(() => prisma.user.upsert(args), () => localDb.user.upsert(args as never)),
    count: (args?: Parameters<typeof prisma.user.count>[0]) =>
      withFallback(() => prisma.user.count(args), () => localDb.user.count(args as never)),
    create: (args: Parameters<typeof prisma.user.create>[0]) =>
      withFallback(() => prisma.user.create(args), () => localDb.user.create(args as never)),
    update: (args: Parameters<typeof prisma.user.update>[0]) =>
      withFallback(() => prisma.user.update(args), () => localDb.user.update(args as never)),
    delete: (args: Parameters<typeof prisma.user.delete>[0]) =>
      withFallback(() => prisma.user.delete(args), () => localDb.user.delete(args as never)),
  },
  lead: {
    findMany: (args?: Parameters<typeof prisma.lead.findMany>[0]) =>
      withFallback(() => prisma.lead.findMany(args), () => localDb.lead.findMany(args as never)),
    findFirst: (args?: Parameters<typeof prisma.lead.findFirst>[0]) =>
      withFallback(() => prisma.lead.findFirst(args), () => localDb.lead.findFirst(args as never)),
    count: (args?: Parameters<typeof prisma.lead.count>[0]) =>
      withFallback(() => prisma.lead.count(args), () => localDb.lead.count(args as never)),
    create: (args: Parameters<typeof prisma.lead.create>[0]) =>
      withFallback(() => prisma.lead.create(args), () => localDb.lead.create(args as never)),
    update: (args: Parameters<typeof prisma.lead.update>[0]) =>
      withFallback(() => prisma.lead.update(args), () => localDb.lead.update(args as never)),
    delete: (args: Parameters<typeof prisma.lead.delete>[0]) =>
      withFallback(() => prisma.lead.delete(args), () => localDb.lead.delete(args as never)),
  },
  auditJob: {
    findMany: (args?: Parameters<typeof prisma.auditJob.findMany>[0]) =>
      withFallback(() => prisma.auditJob.findMany(args), () => localDb.auditJob.findMany(args as never)),
    findFirst: (args?: Parameters<typeof prisma.auditJob.findFirst>[0]) =>
      withFallback(() => prisma.auditJob.findFirst(args), () => localDb.auditJob.findFirst(args as never)),
    count: (args?: Parameters<typeof prisma.auditJob.count>[0]) =>
      withFallback(() => prisma.auditJob.count(args), () => localDb.auditJob.count(args as never)),
    create: (args: Parameters<typeof prisma.auditJob.create>[0]) =>
      withFallback(() => prisma.auditJob.create(args), () => localDb.auditJob.create(args as never)),
    update: (args: Parameters<typeof prisma.auditJob.update>[0]) =>
      withFallback(() => prisma.auditJob.update(args), () => localDb.auditJob.update(args as never)),
  },
  outreachCampaign: {
    findMany: (args?: Parameters<typeof prisma.outreachCampaign.findMany>[0]) =>
      withFallback(
        () => prisma.outreachCampaign.findMany(args),
        () => localDb.outreachCampaign.findMany(args as never)
      ),
    count: (args?: Parameters<typeof prisma.outreachCampaign.count>[0]) =>
      withFallback(
        () => prisma.outreachCampaign.count(args),
        () => localDb.outreachCampaign.count(args as never)
      ),
    create: (args: Parameters<typeof prisma.outreachCampaign.create>[0]) =>
      withFallback(
        () => prisma.outreachCampaign.create(args),
        () => localDb.outreachCampaign.create(args as never)
      ),
  },
  proposal: {
    findMany: (args?: Parameters<typeof prisma.proposal.findMany>[0]) =>
      withFallback(() => prisma.proposal.findMany(args), () => localDb.proposal.findMany(args as never)),
    findFirst: (args?: Parameters<typeof prisma.proposal.findFirst>[0]) =>
      withFallback(() => prisma.proposal.findFirst(args), () => localDb.proposal.findFirst(args as never)),
    count: (args?: Parameters<typeof prisma.proposal.count>[0]) =>
      withFallback(() => prisma.proposal.count(args), () => localDb.proposal.count(args as never)),
    create: (args: Parameters<typeof prisma.proposal.create>[0]) =>
      withFallback(() => prisma.proposal.create(args), () => localDb.proposal.create(args as never)),
    update: (args: Parameters<typeof prisma.proposal.update>[0]) =>
      withFallback(() => prisma.proposal.update(args), () => localDb.proposal.update(args as never)),
    delete: (args: Parameters<typeof prisma.proposal.delete>[0]) =>
      withFallback(() => prisma.proposal.delete(args), () => localDb.proposal.delete(args as never)),
  },
  activity: {
    findMany: (args?: Parameters<typeof prisma.activity.findMany>[0]) =>
      withFallback(() => prisma.activity.findMany(args), () => localDb.activity.findMany(args as never)),
    create: (args: Parameters<typeof prisma.activity.create>[0]) =>
      withFallback(() => prisma.activity.create(args), () => localDb.activity.create(args as never)),
    deleteMany: (args?: Parameters<typeof prisma.activity.deleteMany>[0]) =>
      withFallback(() => prisma.activity.deleteMany(args), () => localDb.activity.deleteMany(args as never)),
  },
  subscription: {
    findMany: (args?: Parameters<typeof prisma.subscription.findMany>[0]) =>
      withFallback(
        () => prisma.subscription.findMany(args),
        () => localDb.subscription.findMany(args as never)
      ),
    upsert: (args: Parameters<typeof prisma.subscription.upsert>[0]) =>
      withFallback(() => prisma.subscription.upsert(args), () => localDb.subscription.upsert(args as never)),
  },
  authEvent: {
    findMany: (args?: Parameters<typeof prisma.authEvent.findMany>[0]) =>
      withFallback(() => prisma.authEvent.findMany(args), () => localDb.authEvent.findMany(args as never)),
    create: (args: Parameters<typeof prisma.authEvent.create>[0]) =>
      withFallback(() => prisma.authEvent.create(args), () => localDb.authEvent.create(args as never)),
  },
}
