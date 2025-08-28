"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FolderKanban, CheckSquare, FileText, Activity } from "lucide-react";

// CRUD Components
import TeamMembersCRUD from "@/components/management/TeamMembersCRUD";
import ProjectsCRUD from "@/components/management/ProjectsCRUD";
import TasksCRUD from "@/components/management/TasksCRUD";
import ResourcesCRUD from "@/components/management/ResourcesCRUD";
import ActivityHistory from "@/components/management/ActivityHistory";

// ✅ Types for entities
interface User {
  id: string;
  full_name: string;
  role: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ProjectResource {
  id: string;
  name: string;
}

interface ActivityLog {
  id: string;
  action_type: string;
  entity_type: string;
  entity_name: string;
  timestamp: string;
}

// ✅ Mock fetch functions (replace with real API later)
async function fetchUsers(): Promise<User[]> {
  return [
    { id: "1", full_name: "Alice Smith", role: "admin", status: "Active" },
    { id: "2", full_name: "Bob Johnson", role: "member", status: "Active" },
  ];
}

async function fetchProjects(): Promise<Project[]> {
  return [
    { id: "p1", name: "Website Redesign", status: "Active" },
    { id: "p2", name: "SEO Campaign", status: "Active" },
  ];
}

async function fetchTasks(): Promise<Task[]> {
  return [
    { id: "t1", title: "Design Homepage", status: "In Progress" },
    { id: "t2", title: "Keyword Research", status: "Completed" },
  ];
}

async function fetchResources(): Promise<ProjectResource[]> {
  return [
    { id: "r1", name: "Wireframes" },
    { id: "r2", name: "Project Brief" },
  ];
}

async function fetchActivities(): Promise<ActivityLog[]> {
  return [
    {
      id: "a1",
      action_type: "Update",
      entity_type: "Task",
      entity_name: "Design Homepage",
      timestamp: new Date().toISOString(),
    },
  ];
}

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState("team-members");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // ✅ Replace with real API later
      const [usersData, projectsData, tasksData, resourcesData, activitiesData] =
        await Promise.all([
          fetchUsers(),
          fetchProjects(),
          fetchTasks(),
          fetchResources(),
          fetchActivities(),
        ]);

      setCurrentUser(usersData[0]); // Mock: first user as current user
      setUsers(usersData);
      setProjects(projectsData);
      setTasks(tasksData);
      setResources(resourcesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error loading management data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (
    actionType: string,
    entityType: string,
    entityId: string,
    entityName: string,
    changes = {}
  ) => {
    try {
      // Mock log
      const newLog: ActivityLog = {
        id: `a${Date.now()}`,
        action_type: actionType,
        entity_type: entityType,
        entity_name: entityName,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [newLog, ...prev]);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleDataChange = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-slate-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Management Dashboard</h1>
          <p className="text-slate-400">Comprehensive project and team management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect-enhanced border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Team Members
              </CardTitle>
              <Users className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <p className="text-xs text-slate-400">
                {users.filter((u) => u.status === "Active").length} active
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect-enhanced border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Projects
              </CardTitle>
              <FolderKanban className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <p className="text-xs text-slate-400">
                {projects.filter((p) => p.status === "Active").length} active
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect-enhanced border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Tasks
              </CardTitle>
              <CheckSquare className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{tasks.length}</div>
              <p className="text-xs text-slate-400">
                {tasks.filter((t) => t.status === "Completed").length} completed
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect-enhanced border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Resources
              </CardTitle>
              <FileText className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{resources.length}</div>
              <p className="text-xs text-slate-400">Across all projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700/40 p-1 rounded-xl mb-6">
            <TabsTrigger value="team-members">
              <Users className="w-4 h-4 mr-2" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderKanban className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <CheckSquare className="w-4 h-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            {currentUser?.role === "admin" && (
              <TabsTrigger value="activity">
                <Activity className="w-4 h-4 mr-2" />
                Activity History
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="team-members" className="space-y-6">
            <TeamMembersCRUD
              users={users}
              projects={projects}
              currentUser={currentUser}
              onDataChange={handleDataChange}
              onLogActivity={logActivity}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectsCRUD
              projects={projects}
              users={users}
              tasks={tasks}
              currentUser={currentUser}
              onDataChange={handleDataChange}
              onLogActivity={logActivity}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TasksCRUD
              tasks={tasks}
              projects={projects}
              users={users}
              currentUser={currentUser}
              onDataChange={handleDataChange}
              onLogActivity={logActivity}
            />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourcesCRUD
              resources={resources}
              projects={projects}
              currentUser={currentUser}
              onDataChange={handleDataChange}
              onLogActivity={logActivity}
            />
          </TabsContent>

          {currentUser?.role === "admin" && (
            <TabsContent value="activity" className="space-y-6">
              <ActivityHistory activities={activities} currentUser={currentUser} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
