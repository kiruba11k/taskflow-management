import * as React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-700 bg-gray-800 p-4 shadow ${className}`}>
      {children}
    </div>
  );
}
