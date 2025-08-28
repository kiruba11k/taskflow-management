"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  ChevronsUpDown,
  Edit3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import EditTaskForm from "@/components/tasks/EditTaskForm";

// ✅ Define types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  current_workload?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Backlog" | "In Progress" | "Review" | "Completed";
  priority: "Low" | "Medium" | "High" | "Critical";
  created_date?: string;
  updated_date?: string;
}

const GRAPH_PALETTE = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#10b981",
  pink: "#ec4899",
  amber: "#f59e0b",
  slate: "#64748b",
  cyan: "#06b6d4",
  red: "#ef4444",
};

export default function DashboardPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // ✅ Replace with real API calls
      const mockTeam: TeamMember[] = [
        { id: "1", name: "Alice", role: "Developer", current_workload: 75 },
        { id: "2", name: "Bob", role: "Designer", current_workload: 50 },
      ];
      const mockTasks: Task[] = [
        {
          id: "t1",
          title: "Landing Page Design",
          description: "Create a modern responsive landing page",
          status: "In Progress",
          priority: "High",
          created_date: "2025-08-25",
        },
        {
          id: "t2",
          title: "SEO Optimization",
          description: "Optimize meta tags and schema",
          status: "Backlog",
          priority: "Medium",
          created_date: "2025-08-26",
        },
      ];
      setTeamMembers(mockTeam);
      setTasks(mockTasks);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdated = () => loadData();
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditTaskForm(true);
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getTasksByStatus = (status: Task["status"]) =>
    tasks.filter((task) => task.status === status).length;

  const getHighPriorityTasks = () =>
    tasks.filter((t) => t.priority === "High" || t.priority === "Critical").length;

  const getAverageWorkload = () => {
    if (teamMembers.length === 0) return 0;
    return Math.round(
      teamMembers.reduce((sum, m) => sum + (m.current_workload || 0), 0) /
        teamMembers.length
    );
  };

  const getRecentTasks = (count = 7) =>
    [...tasks]
      .sort(
        (a, b) =>
          new Date(b.updated_date || b.created_date || "").getTime() -
          new Date(a.updated_date || a.created_date || "").getTime()
      )
      .slice(0, count);

  // ✅ Chart Data
  const taskStatusData = [
    { name: "Backlog", value: getTasksByStatus("Backlog"), fill: GRAPH_PALETTE.slate },
    { name: "In Progress", value: getTasksByStatus("In Progress"), fill: GRAPH_PALETTE.blue },
    { name: "Review", value: getTasksByStatus("Review"), fill: GRAPH_PALETTE.purple },
    { name: "Completed", value: getTasksByStatus("Completed"), fill: GRAPH_PALETTE.green },
  ];

  const taskPriorityData = [
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length, fill: GRAPH_PALETTE.cyan },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length, fill: GRAPH_PALETTE.blue },
    { name: "High", value: tasks.filter((t) => t.priority === "High").length, fill: GRAPH_PALETTE.amber },
    { name: "Critical", value: tasks.filter((t) => t.priority === "Critical").length, fill: GRAPH_PALETTE.red },
  ];

  const priorityColors: Record<Task["priority"], string> = {
    Low: "bg-cyan-700/30 text-cyan-300 border-cyan-600/50",
    Medium: "bg-blue-700/30 text-blue-300 border-blue-600/50",
    High: "bg-amber-700/30 text-amber-300 border-amber-600/50",
    Critical: "bg-red-700/30 text-red-300 border-red-600/50",
  };

  const statusColors: Record<Task["status"], string> = {
    Backlog: "bg-slate-700/40 text-slate-300 border-slate-600/50",
    "In Progress": "bg-blue-700/30 text-blue-300 border-blue-600/50",
    Review: "bg-purple-700/30 text-purple-300 border-purple-600/50",
    Completed: "bg-green-700/30 text-green-300 border-green-600/50",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 text-white">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Marketing Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Welcome back! Here's your team's performance snapshot.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Team Members",
              value: teamMembers.length,
              icon: <Users className="h-5 w-5 text-blue-400" />,
            },
            {
              title: "Active Tasks",
              value: getTasksByStatus("In Progress"),
              icon: <Activity className="h-5 w-5 text-green-400" />,
            },
            {
              title: "Avg Workload",
              value: `${getAverageWorkload()}%`,
              icon: <TrendingUp className="h-5 w-5 text-yellow-400" />,
            },
            {
              title: "High Priority",
              value: getHighPriorityTasks(),
              icon: <AlertCircle className="h-5 w-5 text-red-400" />,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <Card className="glass-effect-enhanced hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-slate-300">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {editingTask && (
        <EditTaskForm
          open={showEditTaskForm}
          onOpenChange={setShowEditTaskForm}
          task={editingTask}
          onTaskUpdated={handleTaskUpdated}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
}
