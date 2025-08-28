'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Download, Plus, FileSpreadsheet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

import DailyTaskForm from '@/app/Components/tasks/DailyTaskForm';
import DailyTaskCard from '@/app/Components/tasks/DailyTaskCard';
import FileUploadDialog from '@/app/Components/upload/FileUploadDialog';

import { DailyTask } from '@/entities/DailyTask';

interface ProjectDashboardProps {
  project: any;
  onBack: () => void;
  teams?: any[];
  tasks?: DailyTask[];
  currentUser: any;
  onTasksUpdated?: () => void;
}

export default function ProjectDashboard({ 
  project, 
  onBack, 
  teams = [], 
  tasks = [], 
  currentUser, 
  onTasksUpdated 
}: ProjectDashboardProps) {
  
  const [projectTasks, setProjectTasks] = useState<DailyTask[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);

  useEffect(() => {
    if (Array.isArray(tasks) && project?.id) {
      setProjectTasks(tasks.filter(task => task.project_id === project.id));
    } else {
      setProjectTasks([]);
    }
  }, [tasks, project]);

  const team = Array.isArray(teams) ? teams.find(t => t.id === project?.team_id) : null;

  const handleTaskSaved = () => {
    onTasksUpdated?.();
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: DailyTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleFileUploaded = () => {
    onTasksUpdated?.();
    setShowUploadDialog(false);
  };

  const getTaskStatusData = () => {
    const statusCounts = {
      'Pending': 0,
      'In Progress': 0,
      'Completed': 0,
      'Blocked': 0
    };

    projectTasks.forEach(task => {
      if (task.task_status && statusCounts.hasOwnProperty(task.task_status)) {
        statusCounts[task.task_status] += 1;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: getStatusColor(status)
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': '#64748b',
      'In Progress': '#3b82f6',
      'Completed': '#10b981',
      'Blocked': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getDailyProgressData = () => {
    const dailyData: Record<string, { date: string; completed: number; total: number }> = {};

    projectTasks.forEach(task => {
      const date = task.date;
      if (!date) return;

      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(date).toLocaleDateString(),
          completed: 0,
          total: 0
        };
      }
      dailyData[date].total += 1;
      if (task.task_status === 'Completed') {
        dailyData[date].completed += 1;
      }
    });

    return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const exportTasks = () => {
    const csvContent = [
      ['Date', 'Project Name', 'Task', 'Expected Outcome', 'Expected Time', 'Tasks Done', 'Actual Time Taken', 'Task Status'],
      ...projectTasks.map(task => [
        task.date || '',
        task.project_name || project?.name || '',
        task.task || '',
        task.expected_outcome || '',
        task.expected_time || 0,
        task.tasks_done || '',
        task.actual_time_taken || 0,
        task.task_status || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${project?.name || 'project'}_tasks.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const canEditTasks = () => {
    return currentUser?.role === 'admin' || 
           currentUser?.role === 'team_leader' || 
           project?.project_manager_id === currentUser?.id;
  };

  if (!project) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto text-center py-16">
          <h2 className="text-xl text-slate-400">Project not found</h2>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onBack}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-slate-400">{project.description}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={exportTasks} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>

            {canEditTasks() && (
              <>
                <Button variant="outline" onClick={() => setShowUploadDialog(true)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Upload className="w-4 h-4 mr-2" /> Import Tasks
                </Button>
                <Button onClick={() => setShowTaskForm(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Task
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect-enhanced"><CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{projectTasks.length}</div>
            <p className="text-sm text-slate-400">Total Tasks</p>
          </CardContent></Card>

          <Card className="glass-effect-enhanced"><CardContent className="p-4">
            <div className="text-2xl font-bold text-green-300">
              {projectTasks.filter(t => t.task_status === 'Completed').length}
            </div>
            <p className="text-sm text-slate-400">Completed</p>
          </CardContent></Card>

          <Card className="glass-effect-enhanced"><CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-300">
              {projectTasks.filter(t => t.task_status === 'In Progress').length}
            </div>
            <p className="text-sm text-slate-400">In Progress</p>
          </CardContent></Card>

          <Card className="glass-effect-enhanced"><CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-300">{team?.team_members?.length || 0}</div>
            <p className="text-sm text-slate-400">Team Members</p>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700/40 p-1 rounded-xl mb-6">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-slate-300">
              Tasks ({projectTasks.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-slate-300">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {projectTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectTasks.map(task => (
                  <DailyTaskCard key={task.id} task={task} onEdit={handleEditTask} canEdit={canEditTasks() || task.user_id === currentUser?.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-effect-enhanced rounded-lg">
                <FileSpreadsheet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Tasks Yet</h3>
                <p className="text-slate-400 mb-6">Start by adding tasks to this project.</p>
                {canEditTasks() && (
                  <div className="flex justify-center gap-3">
                    <Button onClick={() => setShowTaskForm(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" /> Add Task
                    </Button>
                    <Button onClick={() => setShowUploadDialog(true)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Upload className="w-4 h-4 mr-2" /> Import Tasks
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card className="glass-effect-enhanced">
                <CardHeader><CardTitle className="text-white">Task Status Distribution</CardTitle></CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={getTaskStatusData()} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                        {getTaskStatusData().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card className="glass-effect-enhanced">
                <CardHeader><CardTitle className="text-white">Daily Progress</CardTitle></CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getDailyProgressData()}>
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" />
                      <Bar dataKey="total" fill="#3b82f6" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Forms and Dialogs */}
        <DailyTaskForm open={showTaskForm} onOpenChange={setShowTaskForm} task={editingTask} onTaskSaved={handleTaskSaved} mode={editingTask ? "edit" : "create"} project={project} team={team} />
        <FileUploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} project={project} team={team} onFileUploaded={handleFileUploaded} />
      </div>
    </div>
  );
}
