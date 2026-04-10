"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="w-full text-stone-900">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all relative min-w-max ${
                isActive 
                  ? "text-forest" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-forest" : "text-gray-300"}`} />}
              {tab.label}
              
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-forest rounded-full" 
                  style={{ transform: "translateY(5px)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="py-8 animate-in fade-in duration-500">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
