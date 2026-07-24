"use client";

import { motion } from "framer-motion";

const filters = [
  "All",
  "Beach",
  "Mountain",
  "Temple",
  "Heritage",
  "Adventure",
];

interface FilterBarProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function FilterBar({ selected, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {filters.map((filter) => {
        const isSelected = selected === filter;
        return (
          <button
            key={filter}
            onClick={() => onSelect(filter)}
            className="relative px-5 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <span className={`relative z-10 ${isSelected ? "text-white" : "text-slate-600 hover:text-slate-900"}`}>
              {filter}
            </span>
            {isSelected ? (
              <motion.span
                layoutId="activeFilter"
                className="absolute inset-0 z-0 rounded-full bg-blue-600 shadow-sm"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            ) : (
              <span className="absolute inset-0 z-0 rounded-full border border-slate-200 bg-white hover:bg-slate-50" />
            )}
          </button>
        );
      })}
    </div>
  );
}