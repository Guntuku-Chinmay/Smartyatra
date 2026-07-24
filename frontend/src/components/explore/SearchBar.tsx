"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
        <Search className="h-5 w-5" />
      </span>
      <input
        type="text"
        placeholder="Where would you like to go?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 shadow-sm"
      />
    </div>
  );
}