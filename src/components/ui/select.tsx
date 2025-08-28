import * as React from "react";

export function Select({ options, value, onChange }: { options: string[]; value: string; onChange: (val: string) => void }) {
  return (
    <select
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
