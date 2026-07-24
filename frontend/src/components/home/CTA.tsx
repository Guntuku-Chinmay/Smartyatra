"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/50">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-16 text-center text-white shadow-2xl shadow-blue-900/10 md:px-12 md:py-20"
        >
          {/* Ambient Background Light circles */}
          <div className="absolute -top-24 -left-24 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 h-60 w-60 rounded-full bg-blue-500/20 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Inline Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-8">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>

            <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl">
              Ready to Design Your Perfect Travel Plan?
            </h2>

            <p className="mt-4 text-base md:text-lg text-blue-100 font-medium leading-relaxed">
              Plan your next trip to Andhra Pradesh. Get customized budget estimation, optimized route mapping, and personalized itinerary generation with AI.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/planner">
                <button className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold px-7 py-3.5 shadow-lg shadow-black/10 hover:shadow-black/15 transition-all hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span>Start Planner Wizard</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}