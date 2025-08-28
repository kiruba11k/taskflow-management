import React from 'react';

interface InputProps {
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}

export function Input({ type = 'text', value, placeholder, onChange }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-300 rounded-md p-2 w-full"
    />
  );
}
