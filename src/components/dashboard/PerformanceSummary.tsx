import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Clock, CheckSquare, AlertTriangle, Users } from 'lucide-react';

type Task = {
  date: string;
  task_status: string;
  expected_time?: number;
  actual_time_taken?: number;
  user_id?: string;
};

type TeamMember = {
  id: string;
  full_name: string;
};

interface PerformanceSummaryProps {
  dailyTasks?: Task[];
  teamMembers?: TeamMember[];
}

export default function PerformanceSummary({
  dailyTasks = [],
  teamMembers = []
}: PerformanceSummaryProps) {
  const metrics = useMemo(() => {
    const totalTasks = dailyTasks.length;
    const completedTasks = dailyTasks.filter(t => t.task_status === 'Completed').length;
    const inProgressTasks = dailyTasks.filter(t => t.task_status === 'In Progress').length;
    const blockedTasks = dailyTasks.filter(t => t.task_status === 'Blocked').length;

    const totalExpectedTime = dailyTasks.reduce((sum, t) => sum + (t.expected_time || 0), 0);
    const totalActualTime = dailyTasks.reduce((sum, t) => sum + (t.actual_time_taken || 0), 0);
    const timeVariance = totalActualTime - totalExpectedTime;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      timeVariance,
      completionRate:
        totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0'
    };
  }, [dailyTasks]);

  const dailyData = useMemo(() => {
    const dailyDataMap: Record<string, any> = {};
    dailyTasks.forEach(task => {
      const date = task.date;
      if (!dailyDataMap[date]) {
        dailyDataMap[date] = {
          date,
          totalTasks: 0,
          completedTasks: 0
        };
      }
      dailyDataMap[date].totalTasks += 1;
      if (task.task_status === 'Completed') {
        dailyDataMap[date].completedTasks += 1;
      }
    });
    return Object.values(dailyDataMap).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [dailyTasks]);

  const teamPerformance = useMemo(() => {
    const memberMap: Record<string, any> = {};
    teamMembers.forEach(m => {
      memberMap[m.id] = { name: m.full_name, totalTasks: 0, completedTasks: 0, completionRate: 0 };
    });
    dailyTasks.forEach(task => {
      if (task.user_id && memberMap[task.user_id]) {
        memberMap[task.user_id].totalTasks += 1;
        if (task.task_status === 'Completed') {
          memberMap[task.user_id].completedTasks += 1;
        }
      }
    });
    Object.values(memberMap).forEach((m: any) => {
      m.completionRate = m.totalTasks > 0 ? ((m.completedTasks / m.totalTasks) * 100).toFixed(1) : 0;
    });
    return Object.values(memberMap).filter((m: any) => m.totalTasks > 0);
  }, [dailyTasks, teamMembers]);

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect-enhanced border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-slate-300">Completion Rate</CardTitle>
            <CheckSquare className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.completionRate}%</div>
            <p className="text-xs text-slate-400">
              {metrics.completedTasks} of {metrics.totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect-enhanced border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-slate-300">Active Tasks</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.inProgressTasks}</div>
            <p className="text-xs text-slate-400">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="glass-effect-enhanced border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-slate-300">Time Variance</CardTitle>
            <Clock className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics.timeVariance >= 0 ? 'text-red-300' : 'text-green-300'
              }`}
            >
              {metrics.timeVariance >= 0 ? '+' : ''}
              {metrics.timeVariance.toFixed(1)}h
            </div>
            <p className="text-xs text-slate-400">vs expected time</p>
          </CardContent>
        </Card>

        <Card className="glass-effect-enhanced border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-slate-300">Blocked Tasks</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.blockedTasks}</div>
            <p className="text-xs text-slate-400">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance */}
        <Card className="glass-effect-enhanced">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Daily Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={val =>
                    new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30,41,59,0.9)',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#f8fafc'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="totalTasks" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="completedTasks" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="glass-effect-enhanced">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformance}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30,41,59,0.9)',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="completionRate" fill="#8b5cf6" name="Completion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
