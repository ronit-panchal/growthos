'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ManagedUser = {
  id: string
  name: string | null
  email: string
  role: string
  status: string
}

export function EmployeeManager() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
  const [message, setMessage] = useState('')

  const loadUsers = async () => {
    const res = await fetch('/api/admin/employees')
    const payload = (await res.json()) as { users?: ManagedUser[]; error?: string }
    if (res.ok) setUsers(payload.users || [])
  }

  useEffect(() => {
    loadUsers().catch(() => null)
  }, [])

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/admin/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const payload = (await res.json()) as { error?: string }
    setLoading(false)
    if (!res.ok) {
      setMessage(payload.error || 'Could not create employee.')
      return
    }
    setForm({ name: '', email: '', password: '', role: 'employee' })
    setMessage('Employee created successfully.')
    await loadUsers()
  }

  const removeUser = async (userId: string) => {
    const res = await fetch(`/api/admin/employees?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' })
    const payload = (await res.json()) as { error?: string }
    if (!res.ok) {
      setMessage(payload.error || 'Could not remove user.')
      return
    }
    setMessage('User removed successfully.')
    await loadUsers()
  }

  const setPassword = async (userId: string) => {
    const password = prompt('Enter new password (min 8 chars)')
    if (!password) return
    const res = await fetch('/api/admin/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    })
    const payload = (await res.json()) as { error?: string }
    setMessage(res.ok ? 'Password updated.' : payload.error || 'Failed to update password.')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={createUser} className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Employee name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input type="email" required placeholder="employee@company.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <Input type="password" required minLength={8} placeholder="Temporary password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit" disabled={loading} className="md:col-span-2">
          {loading ? 'Creating user...' : 'Create user'}
        </Button>
      </form>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-3 py-2">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {(user.name || 'No name')} · {user.role} · {user.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPassword(user.id)}>
                Set password
              </Button>
              <Button variant="destructive" size="sm" onClick={() => removeUser(user.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 ? <p className="text-sm text-muted-foreground">No managed users yet.</p> : null}
      </div>
    </div>
  )
}
