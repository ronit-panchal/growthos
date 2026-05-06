'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'

interface UseApiOptions<T> {
  url: string
  demoData: T[]
  enabled?: boolean
}

interface UseApiResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (item: Partial<T>) => Promise<T | null>
  update: (id: string, item: Partial<T>) => Promise<T | null>
  remove: (id: string) => Promise<boolean>
  setData: React.Dispatch<React.SetStateAction<T[]>>
}

export function useApi<T extends { id: string }>(
  options: UseApiOptions<T>
): UseApiResult<T> {
  const { url, demoData, enabled = true } = options
  const { user, isDemoMode } = useAppStore()
  const [data, setData] = useState<T[]>(demoData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFromApi = useCallback(async () => {
    if (isDemoMode || !user?.id) {
      setData(demoData)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${url}?userId=${user.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      // Handle paginated and non-paginated responses
      setData(json.leads || json.audits || json.campaigns || json.proposals || json.data || json)
    } catch (err) {
      console.error('API fetch failed, using demo data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setData(demoData)
    } finally {
      setLoading(false)
    }
  }, [url, user?.id, isDemoMode, demoData])

  useEffect(() => {
    if (enabled) fetchFromApi()
  }, [fetchFromApi, enabled])

  const create = useCallback(
    async (item: Partial<T>): Promise<T | null> => {
      if (isDemoMode || !user?.id) {
        // Demo mode: add locally
        const newItem = {
          ...item,
          id: `${url.split('/').pop()}-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as T
        setData((prev) => [newItem, ...prev])
        return newItem
      }

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, userId: user.id }),
        })
        if (!res.ok) throw new Error('Failed to create')
        const json = await res.json()
        const created = json.lead || json.audit || json.campaign || json.proposal || json
        setData((prev) => [created, ...prev])
        return created
      } catch (err) {
        console.error('Create failed, adding locally:', err)
        const newItem = {
          ...item,
          id: `${url.split('/').pop()}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        } as T
        setData((prev) => [newItem, ...prev])
        return newItem
      }
    },
    [url, user?.id, isDemoMode]
  )

  const update = useCallback(
    async (id: string, item: Partial<T>): Promise<T | null> => {
      if (isDemoMode || !user?.id) {
        // Demo mode: update locally
        setData((prev) =>
          prev.map((d) => (d.id === id ? { ...d, ...item, updatedAt: new Date().toISOString() } : d))
        )
        return { ...data.find((d) => d.id === id), ...item } as T
      }

      try {
        const res = await fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, userId: user.id }),
        })
        if (!res.ok) throw new Error('Failed to update')
        const json = await res.json()
        const updated = json.lead || json.audit || json.proposal || json
        setData((prev) => prev.map((d) => (d.id === id ? updated : d)))
        return updated
      } catch (err) {
        console.error('Update failed, updating locally:', err)
        setData((prev) =>
          prev.map((d) => (d.id === id ? { ...d, ...item } : d))
        )
        return null
      }
    },
    [url, user?.id, isDemoMode, data]
  )

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (isDemoMode || !user?.id) {
        // Demo mode: remove locally
        setData((prev) => prev.filter((d) => d.id !== id))
        return true
      }

      try {
        const res = await fetch(`${url}/${id}?userId=${user.id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error('Failed to delete')
        setData((prev) => prev.filter((d) => d.id !== id))
        return true
      } catch (err) {
        console.error('Delete failed, removing locally:', err)
        setData((prev) => prev.filter((d) => d.id !== id))
        return true
      }
    },
    [url, user?.id, isDemoMode]
  )

  return { data, loading, error, refetch: fetchFromApi, create, update, remove, setData }
}
