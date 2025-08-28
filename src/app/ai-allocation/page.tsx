"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Users, CheckSquare, Loader2, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

// ✅ Types
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  required_skills?: string[];
  estimated_hours?: number;
  due_date?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  current_workload?: number;
  availability?: number;
  skills?: Record<string, number>;
}

interface AIAllocationResult {
  task_id: string;
  member_id: string;
  confidence_score: number;
  reasoning: string;
  estimated_completion_time_in_days: number;
}

export default function AIAllocationPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allocations, setAllocations] = useState<AIAllocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Mock: Replace with real API calls or DB fetch
  const loadData = async () => {
    try {
      // For now, use mock data
      const taskList: Task[] = [
        {
          id: "task_1",
          title: "Write SEO Blog",
          description: "Create a blog optimized for SEO on marketing trends.",
          priority: "High",
          required_skills: ["SEO", "Content Writing"],
          estimated_hours: 6,
          due_date: "2025-09-05",
        },
      ];
      const members: TeamMember[] = [
        {
          id: "member_1",
          name: "Alice Johnson",
          role: "Content Strategist",
          current_workload: 40,
          availability: 80,
          skills: { SEO: 9, Writing: 8 },
        },
      ];
      setTasks(taskList);
      setTeamMembers(members);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Mock AI function (replace with InvokeLLM later)
  const generateAIAllocations = async () => {
    if (tasks.length === 0 || teamMembers.length === 0) {
      setError("Need both unassigned tasks and team members to generate allocations.");
      return;
    }
    setIsAllocating(true);
    setError(null);

    try {
      const mockAllocations: AIAllocationResult[] = [
        {
          task_id: tasks[0].id,
          member_id: teamMembers[0].id,
          confidence_score: 0.92,
          reasoning: "Strong skill match in SEO and writing.",
          estimated_completion_time_in_days: 3,
        },
      ];
      setAllocations(mockAllocations);
    } catch (error) {
      console.error("Error generating AI allocations:", error);
      setError("Failed to generate AI allocations. Please try again.");
    } finally {
      setIsAllocating(false);
    }
  };

  const getTaskById = (id: string) => tasks.find((task) => task.id === id);
  const getMemberById = (id: string) => teamMembers.find((member) => member.id === id);

  const priorityColors: Record<string, string> = {
    Low: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    High: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    Critical: "bg-red-500/20 text-red-300 border-red-500/40",
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3 tracking-tight">
              <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
              AI Task Allocation Engine
            </h1>
            <p className="text-slate-400">Intelligently assign tasks based on skills, workload, and priority.</p>
          </div>
          <Button
            onClick={generateAIAllocations}
            disabled={isAllocating || tasks.length === 0 || teamMembers.length === 0}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            {isAllocating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Smart Allocations
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert className="bg-red-900/70 border-red-700 text-red-200">
            <AlertDescription className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" /> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* AI Allocations Results */}
        {allocations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Brain className="w-6 h-6 text-blue-300" />
                AI Allocation Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allocations.map((allocation, index) => {
                const task = getTaskById(allocation.task_id);
                const member = getMemberById(allocation.member_id);
                if (!task || !member) return null;
                return (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg mb-4">
                    <div className="flex justify-between">
                      <h4 className="text-white">{task.title}</h4>
                      <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{allocation.reasoning}</p>
                    <p className="text-slate-500 text-xs">
                      Assigned to: {member.name} | Confidence: {Math.round(allocation.confidence_score * 100)}%
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
