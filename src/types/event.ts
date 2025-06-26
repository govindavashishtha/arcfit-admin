export interface EventMetaData {
  name?: string
  type?: string
  level?: string
  description?: string
  muscleGroups?: string[]
  trainingDetails?: string
  averageCaloriesBurned?: number
  equipment_needed?: string[]
  location_details?: string
  [key: string]: any
  pictures?: string[]
}

export interface EventSociety {
  society_id: string
  name: string
}

export interface EventTrainer {
  user_id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
}

export interface Event {
  event_id: string
  society_id: string
  society: EventSociety
  trainer_id: string
  trainer: EventTrainer
  type: string
  date: string
  start_time: string
  end_time: string
  max_slots: number
  remaining_slots: number
  status: 'scheduled' | 'cancelled' | 'completed'
  meta_data?: EventMetaData
  created_at: string
  updated_at: string
}

export interface EventFilters {
  society_id?: string
  type?: string
  status?: string
  from_date?: string
  to_date?: string
}

export interface EventQueryParams {
  page?: number
  limit?: number
  society_id?: string
  type?: string
  status?: string
  from_date?: string
  to_date?: string
}

export interface PaginatedEventsResponse {
  data: Event[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}