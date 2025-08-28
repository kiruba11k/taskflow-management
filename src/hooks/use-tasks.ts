'use client'

import { useState, useEffect } from 'react'
import { Task } from '../types'
import { getMockData, saveMockData } from '../lib/mock-data'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getMockData()
    setTasks(data.tasks)
    setLoading(false)
  }, [])

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveMockData({ projects: getMockData().projects, tasks: updatedTasks })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    )
    setTasks(updatedTasks)
    saveMockData({ projects: getMockData().projects, tasks: updatedTasks })
  }

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    saveMockData({ projects: getMockData().projects, tasks: updatedTasks })
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
  }
}
