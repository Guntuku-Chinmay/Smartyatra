"use client";

import { motion } from "framer-motion";

interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex rounded-xl bg-slate-100 p-1 relative ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 py-2 text-center text-xs font-bold transition duration-200 cursor-pointer select-none z-10 ${
              isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-lg bg-white shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
