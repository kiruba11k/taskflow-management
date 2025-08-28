'use client';

import React, { useState, useEffect } from 'react';
import { TeamMember } from '@/entities/TeamMember';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import MemberCard from '@/components/team/MemberCard';
import AddMemberForm from '@/components/team/AddMemberForm';
import EditTeamMemberForm from '@/components/team/EditTeamMemberForm';

export default function TeamPage(): JSX.Element {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const members = await TeamMember.list('-created_date');
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberAdded = (): void => {
    loadTeamMembers();
  };

  const handleMemberUpdated = (): void => {
    loadTeamMembers();
  };

  const handleEditMember = (member: any): void => {
    setEditingMember(member);
    setShowEditForm(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
            <p className="text-slate-400">Manage your marketing team and track skill maps</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 glow-effect"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Team Members Grid */}
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={() => handleEditMember(member)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Team Members Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Start building your marketing team by adding team members with their skill
              assessments.
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 glow-effect"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Member
            </Button>
          </div>
        )}

        {/* Add Member Form */}
        <AddMemberForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onMemberAdded={handleMemberAdded}
        />

        {/* Edit Member Form */}
        {editingMember && (
          <EditTeamMemberForm
            open={showEditForm}
            onOpenChange={setShowEditForm}
            member={editingMember}
            onMemberUpdated={handleMemberUpdated}
          />
        )}
      </div>
    </div>
  );
}
