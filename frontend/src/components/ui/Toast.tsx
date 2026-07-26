"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToast, ToastMessage } from "@/store/toast.store";

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    error: <AlertCircle className="h-5 w-5 text-rose-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-100/80 text-emerald-800",
    error: "bg-rose-50 border-rose-100/80 text-rose-800",
    info: "bg-blue-50 border-blue-100/80 text-blue-800",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast: ToastMessage) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${bgStyles[toast.type]}`}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 text-xs font-bold leading-relaxed">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="mt-0.5 rounded-lg p-0.5 hover:bg-black/5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
