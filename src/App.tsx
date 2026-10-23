import { useMemo } from 'react'
import { ActivityList } from './componens/ActivityList'
import { MonthlyBreakdown } from './componens/MonthlyBreakdown'
import { StatsCards } from './componens/StatsCards'
import { useActivities } from './hooks/useActivities'
import type { DashboardStats, MonthGroup } from './types/dashboard'

const formatMonth = (key: string) => {
  const [year, month] = key.split('-').map(Number)

  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const formatSync = (value: string) => {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

function App() {
  const { loading, error, activities, total, lastSync, refetch } =
    useActivities()

  const stats = useMemo<DashboardStats>(() => {
    let completed = 0

    for (const activity of activities) {
      if (activity.completed === 'Y') {
        completed += 1
      }
    }

    return {
      total: activities.length,
      completed,
      pending: activities.length - completed,
      completionRate:
        activities.length === 0
          ? 0
          : Math.round((completed / activities.length) * 100),
    }
  }, [activities])

  const months = useMemo<MonthGroup[]>(() => {
    const groups = new Map<string, { completed: number; pending: number }>()

    for (const activity of activities) {
      const key = activity.created.slice(0, 7)
      const group = groups.get(key) ?? { completed: 0, pending: 0 }

      if (activity.completed === 'Y') {
        group.completed += 1
      } else {
        group.pending += 1
      }

      groups.set(key, group)
    }

    return [...groups.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, group]) => ({
        key,
        label: formatMonth(key),
        total: group.completed + group.pending,
        completed: group.completed,
        pending: group.pending,
      }))
  }, [activities])

  const sortedActivities = useMemo(
    () =>
      [...activities].sort(
        (a, b) => Date.parse(b.created) - Date.parse(a.created),
      ),
    [activities],
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex items-start justify-between gap-4 border-b border-black pb-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            CRM Activities
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {total.toLocaleString()} activities
            {lastSync ? ` · last sync ${formatSync(lastSync)}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="border border-black px-3 py-1.5 text-sm font-medium hover:bg-black hover:text-white disabled:opacity-40"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {loading && activities.length === 0 && <p className="mt-6">Loading..</p>}

      {error && (
        <p role="alert" className="mt-6 border border-black p-3 font-medium">
          {error}
        </p>
      )}

      {activities.length > 0 && (
        <>
          <StatsCards stats={stats} />
          <ActivityList activities={sortedActivities} />
          <MonthlyBreakdown months={months} />
        </>
      )}
    </main>
  )
}

export default App
