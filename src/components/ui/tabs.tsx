import React, { useState } from 'react';

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
}

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`p-2 ${active === index ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs[active].content}</div>
    </div>
  );
}
