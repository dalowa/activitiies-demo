import { useEffect, useState } from 'react'
import type { Activity, Root } from '../types/api'

const ACTIVITIES_URL = 'https://api-maestra-prod.up.railway.app/bitrix/activities'

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [total, setTotal] = useState(0)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(ACTIVITIES_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as Root

        const seen = new Set<string>()
        const uniqueActivities = data.activities.filter((activity) => {
          if (seen.has(activity.id)) return false
          seen.add(activity.id)
          return true
        })

        setActivities(uniqueActivities)
        setTotal(uniqueActivities.length)
        setLastSync(data.last_sync)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(
          err instanceof Error ? err.message : 'Unexpected error while fetching activities.',
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [reloadKey])

  return {
    activities,
    total,
    lastSync,
    loading,
    error,
    refetch: () => setReloadKey((key) => key + 1),
  }
}
