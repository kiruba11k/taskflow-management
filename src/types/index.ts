export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}
