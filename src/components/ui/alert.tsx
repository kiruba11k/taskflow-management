import * as React from "react";

export function Alert({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-red-500 bg-red-900/20 p-4 text-red-300 ${className}`}>
      {children}
    </div>
  );
}
