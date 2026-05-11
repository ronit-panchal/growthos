export type RuntimeDiagnostic = {
  code: string
  level: 'info' | 'warning'
  message: string
}

function getDatabaseHost(databaseUrl: string) {
  try {
    return new URL(databaseUrl).hostname
  } catch {
    return null
  }
}

export function getRuntimeDiagnostics(): RuntimeDiagnostic[] {
  const diagnostics: RuntimeDiagnostic[] = []
  const databaseUrl = process.env.DATABASE_URL?.trim()
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim()

  if (!databaseUrl) {
    diagnostics.push({
      code: 'DATABASE_URL_MISSING',
      level: 'warning',
      message: 'DATABASE_URL is not configured, so database-backed workspace features cannot load.',
    })
  } else {
    const host = getDatabaseHost(databaseUrl)

    if (!host) {
      diagnostics.push({
        code: 'DATABASE_URL_INVALID',
        level: 'warning',
        message:
          'DATABASE_URL is not a valid connection string. URL-encode special characters in the password, then retry.',
      })
    } else if (host.startsWith('db.') && host.endsWith('.supabase.co')) {
      diagnostics.push({
        code: 'SUPABASE_DIRECT_DB_HOST',
        level: 'warning',
        message:
          'DATABASE_URL is using a direct Supabase database host. On IPv4-only local networks this host can fail to resolve; prefer the Supabase connection pooler URL for localhost development.',
      })
    }
  }

  if (openAiApiKey?.includes('YOUR_KEY_HERE')) {
    diagnostics.push({
      code: 'OPENAI_PLACEHOLDER',
      level: 'info',
      message: 'OPENAI_API_KEY is still a placeholder, so AI features will fall back to mock content.',
    })
  }

  return diagnostics
}

export function getDatabaseConnectionHint() {
  return (
    getRuntimeDiagnostics().find((diagnostic) =>
      ['DATABASE_URL_MISSING', 'DATABASE_URL_INVALID', 'SUPABASE_DIRECT_DB_HOST'].includes(
        diagnostic.code
      )
    )?.message ?? 'The workspace database is unreachable right now. Check DATABASE_URL and try again.'
  )
}
