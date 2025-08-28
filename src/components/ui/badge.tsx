import * as React from "react";

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white ${className}`}>
      {children}
    </span>
  );
}
