"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-indexed
  className?: string;
}

export default function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-1 items-center last:flex-initial">
              {/* Step circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? "#2563eb" : "#f1f5f9",
                    borderColor: isCompleted || isActive ? "#2563eb" : "#cbd5e1",
                    color: isCompleted || isActive ? "#ffffff" : "#64748b",
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm`}
                >
                  {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : <span>{stepNum}</span>}
                </motion.div>
                <span
                  className={`absolute top-11 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? "text-blue-600 font-extrabold" : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div className="mx-4 h-[2px] flex-1 bg-slate-100 relative top-0 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="absolute inset-y-0 left-0 bg-blue-600"
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
