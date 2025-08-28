"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Clock,
  Download,
  BarChart3,
} from "lucide-react";
import {
  format,
  subDays,
  startOfWeek,
  startOfMonth,
} from "date-fns";

// ✅ Types
interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  project_id: string;
  user_id: string;
  task: string;
  task_status: "Pending" | "In Progress" | "Completed" | "Blocked";
  expected_time?: number;
  actual_time_taken?: number;
  date: string;
}

interface User {
  id: string;
  full_name: string;
  designation?: string;
}

// ✅ Mock fallback
const mockProjects: Project[] = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
];

const mockTasks: Task[] = [
  {
    id: "t1",
    project_id: "1",
    user_id: "u1",
    task: "Setup environment",
    task_status: "Completed",
    expected_time: 4,
    actual_time_taken: 5,
    date: "2025-08-20",
  },
  {
    id: "t2",
    project_id: "2",
    user_id: "u2",
    task: "Design UI",
    task_status: "In Progress",
    expected_time: 6,
    actual_time_taken: 3,
    date: "2025-08-25",
  },
];

const mockUsers: User[] = [
  { id: "u1", full_name: "Alice Johnson", designation: "Developer" },
  { id: "u2", full_name: "Bob Smith", designation: "Designer" },
];

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
};

export default function AnalyticsPage({
  projects = mockProjects,
  tasks = mockTasks,
  users = mockUsers,
}: {
  projects?: Project[];
  tasks?: Task[];
  users?: User[];
}) {
  const [selectedProject, setSelectedProject] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [viewType, setViewType] = useState("overview");

  // ✅ Filter tasks based on selected project and time range
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedProject !== "all") {
      filtered = filtered.filter((task) => task.project_id === selectedProject);
    }
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      case "quarter":
        startDate = startOfMonth(subDays(now, 90));
        break;
      default:
        startDate = null;
    }
    if (startDate) {
      filtered = filtered.filter((task) => new Date(task.date) >= startDate);
    }
    return filtered;
  }, [tasks, selectedProject, timeRange]);

  // ✅ Metrics
  const metrics = useMemo(() => {
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(
      (t) => t.task_status === "Completed"
    ).length;
    const inProgressTasks = filteredTasks.filter(
      (t) => t.task_status === "In Progress"
    ).length;
    const blockedTasks = filteredTasks.filter(
      (t) => t.task_status === "Blocked"
    ).length;

    const totalExpectedTime = filteredTasks.reduce(
      (sum, task) => sum + (task.expected_time || 0),
      0
    );
    const totalActualTime = filteredTasks.reduce(
      (sum, task) => sum + (task.actual_time_taken || 0),
      0
    );
    const timeVariance = totalActualTime - totalExpectedTime;
    const efficiencyRate =
      totalActualTime > 0
        ? Math.round((totalExpectedTime / totalActualTime) * 100)
        : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      completionRate:
        totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0,
      totalExpectedTime,
      totalActualTime,
      timeVariance,
      efficiencyRate,
    };
  }, [filteredTasks]);

  // ✅ Task status distribution
  const taskStatusData = useMemo(
    () => [
      { name: "Completed", value: metrics.completedTasks, fill: COLORS.green },
      { name: "In Progress", value: metrics.inProgressTasks, fill: COLORS.blue },
      {
        name: "Pending",
        value: filteredTasks.filter((t) => t.task_status === "Pending").length,
        fill: COLORS.yellow,
      },
      { name: "Blocked", value: metrics.blockedTasks, fill: COLORS.red },
    ],
    [filteredTasks, metrics]
  );

  const exportData = () => {
    const csvContent = [
      [
        "Date",
        "Project",
        "Member",
        "Task",
        "Status",
        "Expected Time",
        "Actual Time",
        "Efficiency",
      ],
      ...filteredTasks.map((task) => [
        task.date,
        projects.find((p) => p.id === task.project_id)?.name || "Unknown",
        users.find((u) => u.id === task.user_id)?.full_name || "Unknown",
        task.task,
        task.task_status,
        task.expected_time || 0,
        task.actual_time_taken || 0,
        task.expected_time && task.actual_time_taken
          ? Math.round(
              (task.expected_time / task.actual_time_taken) * 100
            )
          : 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `analytics_${timeRange}_${Date.now()}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="View Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="members">Members</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={exportData}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect-enhanced border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.completionRate}%
            </div>
            <p className="text-xs text-slate-400">
              {metrics.completedTasks} of {metrics.totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect-enhanced border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Efficiency Rate
            </CardTitle>
            <Clock className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.efficiencyRate}%
            </div>
            <p className="text-xs text-slate-400">Expected vs Actual time</p>
          </CardContent>
        </Card>

        <Card className="glass-effect-enhanced border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Time Variance
            </CardTitle>
            <Calendar className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics.timeVariance >= 0
                  ? "text-red-300"
                  : "text-green-300"
              }`}
            >
              {metrics.timeVariance >= 0 ? "+" : ""}
              {metrics.timeVariance.toFixed(1)}h
            </div>
            <p className="text-xs text-slate-400">Over/Under estimated</p>
          </CardContent>
        </Card>

        <Card className="glass-effect-enhanced border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Blocked Tasks
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.blockedTasks}
            </div>
            <p className="text-xs text-slate-400">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts based on view type */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Status Distribution */}
          <Card className="glass-effect-enhanced">
            <CardHeader>
              <CardTitle className="text-white">Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Task Trend */}
          <Card className="glass-effect-enhanced">
            <CardHeader>
              <CardTitle className="text-white">Daily Task Completion Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData}>
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke={COLORS.green} strokeWidth={2} name="Completed" />
                  <Line type="monotone" dataKey="total" stroke={COLORS.blue} strokeWidth={2} name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Efficiency Trend */}
          <Card className="glass-effect-enhanced lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Time Efficiency & Variance Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeVarianceData}>
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Area type="monotone" dataKey="expectedTime" stackId="1" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.6} name="Expected Time" />
                  <Area type="monotone" dataKey="actualTime" stackId="2" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.6} name="Actual Time" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {viewType === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Completion Rates */}
          <Card className="glass-effect-enhanced">
            <CardHeader>
              <CardTitle className="text-white">Project Completion Rates</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectPerformanceData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Bar dataKey="completionRate" fill={COLORS.green} name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Task Distribution */}
          <Card className="glass-effect-enhanced">
            <CardHeader>
              <CardTitle className="text-white">Project Task Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectPerformanceData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Bar dataKey="completed" fill={COLORS.green} name="Completed" />
                  <Bar dataKey="total" fill={COLORS.blue} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {viewType === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Performance */}
          <Card className="glass-effect-enhanced">
            <CardHeader>
              <CardTitle className="text-white">Member Task Completion</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberPerformanceData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Bar dataKey="completionRate" fill={COLORS.purple} name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Member Efficiency */}
          <Card className="glass-effect-enhanced">
            <CardHeader>
              <CardTitle className="text-white">Member Time Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberPerformanceData} layout="vertical">
                  <XAxis type="number" domain={[0, 150]} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Bar dataKey="efficiency" fill={COLORS.cyan} name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
