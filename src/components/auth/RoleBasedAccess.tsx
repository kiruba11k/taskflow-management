'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { User } from '@/entities/User';

interface RoleBasedAccessProps {
  children: ReactNode | ((user: User) => ReactNode);
  allowedRoles?: string[];
  fallback?: ReactNode;
}

export default function RoleBasedAccess({
  children,
  allowedRoles = [],
  fallback = null,
}: RoleBasedAccessProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="text-center py-16 glass-effect-enhanced rounded-lg">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
            <span className="text-2xl">🚫</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Access Restricted</h3>
          <p className="text-slate-400">You don't have permission to access this feature.</p>
        </div>
      )
    );
  }

  return typeof children === 'function' ? children(user) : children;
}
