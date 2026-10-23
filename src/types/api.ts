export interface Root {
  source: string
  last_sync: string
  total: number
  activities: Activity[]
}

export interface Activity {
  id: string
  type_id: string
  subject: string
  completed: string
  created: string
  end_time: string
  responsible_id: string
  responsible_name: string
  owner_type_id: string
  owner_id: string
  provider_id: string
}
