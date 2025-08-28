"use client";

import React, { useState } from "react";
import { Project } from "@/entities/Project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Target,
} from "lucide-react";
import { format } from "date-fns";

// ✅ Define types
interface ProjectType {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  priority: string;
  project_manager_id: string;
  assigned_members: string[];
  budget: number;
}

interface UserType {
  id: string;
  full_name: string;
  role: string;
}

interface TaskType {
  id: string;
  project_id: string;
  status: string;
}

interface FormDataType {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  project_manager_id: string;
  assigned_members: string[];
  budget: number;
}

interface ProjectsCRUDProps {
  projects: ProjectType[];
  users: UserType[];
  tasks: TaskType[];
  currentUser: UserType | null;
  onDataChange: () => void;
  onLogActivity: (
    action: string,
    entityType: string,
    entityId: string,
    entityName: string,
    changes?: { before: ProjectType; after: FormDataType }
  ) => Promise<void>;
}

export default function ProjectsCRUD({
  projects = [],
  users = [],
  tasks = [],
  currentUser,
  onDataChange,
  onLogActivity,
}: ProjectsCRUDProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [leaderFilter, setLeaderFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Planning",
    priority: "Medium",
    project_manager_id: "",
    assigned_members: [],
    budget: 0,
  });

  // ✅ Filter Projects
  const filteredProjects = projects.filter((project) => {
    const nameMatch =
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const statusMatch = statusFilter === "all" || project.status === statusFilter;
    const leaderMatch =
      leaderFilter === "all" || project.project_manager_id === leaderFilter;
    return nameMatch && statusMatch && leaderMatch;
  });

  const handleCreateEdit = (project: ProjectType | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name || "",
        description: project.description || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        status: project.status || "Planning",
        priority: project.priority || "Medium",
        project_manager_id: project.project_manager_id || "",
        assigned_members: project.assigned_members || [],
        budget: project.budget || 0,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Planning",
        priority: "Medium",
        project_manager_id: "",
        assigned_members: [],
        budget: 0,
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProject) {
        const result = await Project.update(editingProject.id, formData);
        await onLogActivity("Update", "Project", editingProject.id, formData.name, {
          before: editingProject,
          after: formData,
        });
      } else {
        const result = await Project.create(formData);
        await onLogActivity("Create", "Project", result.id, formData.name);
      }

      setShowForm(false);
      onDataChange();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (project: ProjectType) => {
    if (window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      try {
        await Project.delete(project.id);
        await onLogActivity("Delete", "Project", project.id, project.name);
        onDataChange();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const getProjectManager = (projectManagerId: string) => {
    return users.find((u) => u.id === projectManagerId)?.full_name || "Unassigned";
  };

  const getAssignedMemberNames = (memberIds: string[]) => {
    return (
      memberIds?.map((id) => {
        const user = users.find((u) => u.id === id);
        return user?.full_name || "Unknown User";
      }) || []
    );
  };

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter((task) => task.project_id === projectId);
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter((task) => task.status === "Completed")
      .length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const canManage =
    currentUser?.role === "admin" || currentUser?.role === "team_leader";
  const teamLeaders = users.filter(
    (u) => u.role === "team_leader" || u.role === "admin"
  );

  return (
          <Card key={project.id} className="glass-effect-enhanced group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-base mb-2">{project.name}</CardTitle>
                    <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${
                      project.status === 'Active' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                      project.status === 'Planning' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                      project.status === 'Completed' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                      project.status === 'On Hold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-red-500/20 text-red-300 border-red-500/40'
                    } border text-xs`}>
                      {project.status}
                    </Badge>
                    <Badge className={`${
                      project.priority === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                      project.priority === 'High' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
                      project.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    } border text-xs`}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Target className="w-4 h-4" />
                    <span>Manager: {getProjectManager(project.project_manager_id)}</span>
                  </div>
                  
                  {project.start_date && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(project.start_date), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Assigned Members */}
                {project.assigned_members && project.assigned_members.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Team Members:</p>
                    <div className="flex flex-wrap gap-1">
                      {getAssignedMemberNames(project.assigned_members).map((memberName, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {memberName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {canManage && (
                  <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                    <Button variant="ghost" size="sm" onClick={() => handleCreateEdit(project)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(project)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-slate-700"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="bg-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="bg-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white">
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="bg-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="project_manager_id">Project Manager</Label>
              <Select value={formData.project_manager_id} onValueChange={(value) => setFormData({...formData, project_manager_id: value})}>
                <SelectTrigger className="bg-slate-700">
                  <SelectValue placeholder="Select project manager" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white">
                  {teamLeaders.map(leader => (
                    <SelectItem key={leader.id} value={leader.id}>{leader.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
                className="bg-slate-700"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
