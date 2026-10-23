export interface DashboardStats {
  total: number
  completed: number
  pending: number
  completionRate: number
}

export interface MonthGroup {
  key: string
  label: string
  total: number
  completed: number
  pending: number
}
