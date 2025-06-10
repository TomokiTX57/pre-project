export type TaskStatus = 'planning' | 'in_progress' | 'completed'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  estimated_hours: number
  actual_hours: number
  due_date: string
  created_at: string
  updated_at: string
} 