import { Task, Project } from '../types'

// Mock data for demonstration
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    color: '#3B82F6',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Native iOS and Android app development',
    color: '#10B981',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 2024 marketing initiatives',
    color: '#F59E0B',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
  },
]

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage mockup',
    description: 'Create initial design concepts for the new homepage',
    status: 'in_progress',
    priority: 'high',
    projectId: '1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    dueDate: '2024-01-20T23:59:59Z',
  },
  {
    id: '2',
    title: 'Set up development environment',
    description: 'Configure local development environment with all dependencies',
    status: 'done',
    priority: 'medium',
    projectId: '1',
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
  },
  {
    id: '3',
    title: 'User authentication flow',
    description: 'Implement login and registration screens',
    status: 'todo',
    priority: 'high',
    projectId: '2',
    createdAt: '2024-01-12T09:30:00Z',
    updatedAt: '2024-01-12T09:30:00Z',
  },
  {
    id: '4',
    title: 'API integration',
    description: 'Connect mobile app to backend services',
    status: 'in_progress',
    priority: 'medium',
    projectId: '2',
    createdAt: '2024-01-11T14:00:00Z',
    updatedAt: '2024-01-11T14:00:00Z',
  },
  {
    id: '5',
    title: 'Social media content',
    description: 'Create content calendar for Instagram and Twitter',
    status: 'todo',
    priority: 'low',
    projectId: '3',
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-08T16:00:00Z',
  },
]

// Local storage key
const STORAGE_KEY = 'task-management-data'

// Initialize mock data in localStorage if not exists
if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    projects: mockProjects,
    tasks: mockTasks,
  }))
}

export const getMockData = () => {
  if (typeof window === 'undefined') {
    return { projects: mockProjects, tasks: mockTasks }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { projects: mockProjects, tasks: mockTasks }
}

export const saveMockData = (data: { projects: Project[], tasks: Task[] }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}
