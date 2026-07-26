"use client";

import { motion } from "framer-motion";

interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface BudgetChartProps {
  categories: BudgetCategory[];
}

export default function BudgetChart({ categories }: BudgetChartProps) {


  return (
    <div className="space-y-6">
      {/* Visual Segment Bar */}
      <div className="h-4.5 w-full flex rounded-full overflow-hidden bg-slate-100/80 p-0.5 border border-slate-200/20">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ width: 0 }}
            animate={{ width: `${cat.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ backgroundColor: cat.color }}
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      {/* Categories Breakdown List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <div>
                <p className="text-xs font-bold text-slate-800">{cat.name}</p>
                <p className="text-[10px] font-semibold text-slate-400">{cat.percentage}% of total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-800">₹{cat.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
