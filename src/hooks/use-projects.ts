'use client'

import { useState, useEffect } from 'react'
import { Project } from '../types'
import { getMockData, saveMockData } from '../lib/mock-data'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getMockData()
    setProjects(data.projects)
    setLoading(false)
  }, [])

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    saveMockData({ projects: updatedProjects, tasks: getMockData().tasks })
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    )
    setProjects(updatedProjects)
    saveMockData({ projects: updatedProjects, tasks: getMockData().tasks })
  }

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id)
    setProjects(updatedProjects)
    saveMockData({ projects: updatedProjects, tasks: getMockData().tasks })
  }

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
  }
}
