import type { DashboardStats } from '../types/dashboard'

export const StatsCards = ({ stats }: { stats: DashboardStats }) => {
  const items = [
    { label: 'Total activities', value: stats.total.toLocaleString() },
    { label: 'Completed', value: stats.completed.toLocaleString() },
    { label: 'Pending', value: stats.pending.toLocaleString() },
    { label: 'Completion rate', value: `${stats.completionRate}%` },
  ]

  return (
    <section
      aria-label="Summary"
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} className="border border-black p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-600">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-semibold">{item.value}</p>
        </div>
      ))}
    </section>
  )
}
