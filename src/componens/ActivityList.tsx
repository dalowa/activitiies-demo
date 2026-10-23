import { useState } from 'react'
import type { Activity } from '../types/api'

const PAGE_AMOUNT = 20

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const ActivityList = ({ activities }: { activities: Activity[] }) => {
  const [page, setPage] = useState(0)

  const pageCount = Math.max(1, Math.ceil(activities.length / PAGE_AMOUNT))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = activities.slice(
    currentPage * PAGE_AMOUNT,
    (currentPage + 1) * PAGE_AMOUNT,
  )

  return (
    <section aria-label="Latest activities" className="mt-8">
      <h2 className="text-lg font-semibold">Latest activities</h2>

      <ul className="mt-4 divide-y divide-neutral-200">
        {visible.map((activity) => {
          const isCompleted = activity.completed === 'Y'

          return (
            <li
              key={activity.id}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div>
                <p>{activity.subject}</p>
                <p className="text-sm text-neutral-600">
                  {activity.responsible_name} · {formatDate(activity.created)}
                </p>
              </div>
              <span
                className={
                  isCompleted
                    ? 'bg-black px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white'
                    : 'border border-black px-2 py-0.5 text-xs font-medium uppercase tracking-wide'
                }
              >
                {isCompleted ? 'Complete' : 'Pending'}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPage((previous) => Math.max(0, previous - 1))}
          disabled={currentPage === 0}
          className="border border-black px-3 py-1 hover:bg-black hover:text-white disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() =>
            setPage((previous) => Math.min(pageCount - 1, previous + 1))
          }
          disabled={currentPage >= pageCount - 1}
          className="border border-black px-3 py-1 hover:bg-black hover:text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  )
}
