export const ROLE = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  AGENCY_OWNER: 'agency_owner',
  TEAM_MEMBER: 'team_member',
  MEMBER: 'member',
} as const

export function normalizeRole(role: string | null | undefined) {
  const value = (role || '').trim().toLowerCase()
  if (value === 'super_admin') return ROLE.SUPERADMIN
  return value || ROLE.MEMBER
}

export function isSuperAdmin(role: string | null | undefined) {
  return normalizeRole(role) === ROLE.SUPERADMIN
}

export function canManageUsers(role: string | null | undefined) {
  const r = normalizeRole(role)
  return r === ROLE.SUPERADMIN || r === ROLE.ADMIN || r === ROLE.AGENCY_OWNER
}

export function canManageEmployees(role: string | null | undefined) {
  const r = normalizeRole(role)
  return r === ROLE.SUPERADMIN || r === ROLE.ADMIN || r === ROLE.AGENCY_OWNER
}

export function isEmployee(role: string | null | undefined) {
  return normalizeRole(role) === ROLE.EMPLOYEE
}

/** Accounts created by an admin (employees or invited users); email verification links are optional. */
export function isProvisionedAuthUser(role: string | null | undefined, managedById: string | null | undefined) {
  if (managedById) return true
  return normalizeRole(role) === ROLE.EMPLOYEE
}
