import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full h-3 bg-slate-700 rounded overflow-hidden ${className || ''}`}>
      <div className="h-full bg-blue-600 transition-all" style={{ width: `${percentage}%` }} />
    </div>
  );
};
