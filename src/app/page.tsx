'use client';

import React from 'react';
import Dashboard from './dashboard/page'; // using your dashboard route page component

export default function HomePage() {
  return (
    <div className="p-6 md:p-8">
      <Dashboard />
    </div>
  );
}
