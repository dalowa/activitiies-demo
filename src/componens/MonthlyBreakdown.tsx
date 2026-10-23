import type { MonthGroup } from '../types/dashboard'

export const MonthlyBreakdown = ({ months }: { months: MonthGroup[] }) => {
  return (
    <section aria-label="Activities by month" className="mt-8">
      <h2 className="text-lg font-semibold">Activities by month</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => {
          const completedPercentage = Math.round(
            (month.completed / month.total) * 100,
          )
          const pendingPercentage = 100 - completedPercentage

          return (
            <article
              key={month.key}
              className="border border-black p-4"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-medium">{month.label}</h3>
                <span className="text-sm text-neutral-600">
                  {month.total.toLocaleString()}
                </span>
              </div>

              <div
                className="mt-3 flex h-2.5 border border-black bg-white"
                role="progressbar"
                aria-label={`${month.label} completion`}
                aria-valuenow={completedPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="bg-black"
                  style={{ width: `${completedPercentage}%` }}
                />
                <div
                  className="bg-white"
                  style={{ width: `${pendingPercentage}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-neutral-600">
                {month.completed.toLocaleString()} completed ·{' '}
                {month.pending.toLocaleString()} pending
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
