"use client";

import React, { useState } from "react";
import { User } from "@/entities/User";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User as UserIcon,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  designation: string;
  status: string;
  contact: string;
  project_ids: string[];
  skills: string;
  hire_date: string;
}

interface Project {
  id: string;
  name: string;
}

interface CurrentUser {
  role: string;
}

interface TeamMembersCRUDProps {
  users: TeamMember[];
  projects: Project[];
  currentUser: CurrentUser;
  onDataChange: () => void;
  onLogActivity: (
    action: string,
    entity: string,
    id: string,
    name: string,
    details?: Record<string, unknown>
  ) => Promise<void>;
}

const marketingDesignations: string[] = [
  "ABM Specialist",
  "Data Scientist",
  "Marketing Analyst",
  "Marketing Intern",
  "Content Creator",
  "Social Media Manager",
  "SEO Specialist",
  "PPC Specialist",
  "Email Marketing Specialist",
  "Growth Hacker",
  "Product Marketing Manager",
  "Brand Manager"
];

export default function TeamMembersCRUD({
  users = [],
  projects = [],
  currentUser,
  onDataChange,
  onLogActivity
}: TeamMembersCRUDProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<TeamMember>({
    id: "",
    full_name: "",
    email: "",
    role: "team_member",
    designation: "",
    status: "Active",
    contact: "",
    project_ids: [],
    skills: "",
    hire_date: ""
  });

  const filteredUsers = users.filter((user) => {
    const nameMatch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const statusMatch = statusFilter === "all" || user.status === statusFilter;
    const roleMatch = roleFilter === "all" || user.role === roleFilter;
    return nameMatch && statusMatch && roleMatch;
  });

  const handleCreateEdit = (user: TeamMember | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
    } else {
      setEditingUser(null);
      setFormData({
        id: "",
        full_name: "",
        email: "",
        role: "team_member",
        designation: "",
        status: "Active",
        contact: "",
        project_ids: [],
        skills: "",
        hire_date: ""
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (editingUser) {
        result = await User.update(editingUser.id, formData);
        await onLogActivity(
          "Update",
          "Team Member",
          editingUser.id,
          formData.full_name,
          {
            before: editingUser,
            after: formData
          }
        );
      } else {
        result = await User.create(formData);
        await onLogActivity("Create", "Team Member", result.id, formData.full_name);
      }

      setShowForm(false);
      onDataChange();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: TeamMember) => {
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      try {
        await User.delete(user.id);
        await onLogActivity("Delete", "Team Member", user.id, user.full_name);
        onDataChange();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const getProjectNames = (projectIds: string[]): string[] => {
    return (
      projectIds?.map((id) => {
        const project = projects.find((p) => p.id === id);
        return project?.name || "Unknown Project";
      }) || []
    );
  };

  const canManage =
    currentUser?.role === "admin" || currentUser?.role === "team_leader";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Members</h2>
          <p className="text-slate-400">
            Manage team members and their assignments
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => handleCreateEdit()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="glass-effect-enhanced">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="team_leader">Team Leader</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setRoleFilter("all");
              }}
              className="border-slate-600 hover:bg-slate-700"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="glass-effect-enhanced group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm">
                      {user.full_name}
                    </CardTitle>
                    <p className="text-slate-400 text-xs">
                      {user.designation}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge
                    className={`${
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-300 border-green-500/40"
                        : "bg-red-500/20 text-red-300 border-red-500/40"
                    } border text-xs`}
                  >
                    {user.status}
                  </Badge>
                  <Badge
                    className={`${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : user.role === "team_leader"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/40"
                    } border text-xs`}
                  >
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.contact && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4" />
                  {user.contact}
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              )}
              {user.hire_date && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Joined {format(new Date(user.hire_date), "MMM yyyy")}
                </div>
              )}

              {/* Projects */}
              {user.project_ids?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Assigned Projects:</p>
                  <div className="flex flex-wrap gap-1">
                    {getProjectNames(user.project_ids).map((name, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {user.skills && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Skills:</p>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {user.skills}
                  </p>
                </div>
              )}

              {canManage && (
                <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCreateEdit(user)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                  className="bg-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white">
                    <SelectItem value="team_member">Team Member</SelectItem>
                    <SelectItem value="team_leader">Team Leader</SelectItem>
                    {currentUser?.role === "admin" && (
                      <SelectItem value="admin">Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                list="designations"
                className="bg-slate-700"
              />
              <datalist id="designations">
                {marketingDesignations.map((designation) => (
                  <option key={designation} value={designation} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  placeholder="Phone or email"
                  className="bg-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) =>
                    setFormData({ ...formData, hire_date: e.target.value })
                  }
                  className="bg-slate-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                placeholder="e.g., Social Media, Content Creation, Analytics"
                className="bg-slate-700"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingUser
                  ? "Update"
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
