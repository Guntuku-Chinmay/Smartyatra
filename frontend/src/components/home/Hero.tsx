"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Compass } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-20 md:py-32">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-2 text-sm font-semibold text-blue-700 backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Smartyatra v1.0 is Live</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mt-8 max-w-4xl font-display text-5xl font-black tracking-tight text-slate-900 md:text-7xl"
        >
          Plan Your Next Journey with the Power of{" "}
          <span className="gradient-text">Generative AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-600 font-medium leading-relaxed"
        >
          Discover popular sights, calculate travel budgets exactly, and generate optimized multi-day schedules in seconds. Seamless, smart, and fully personalized.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/planner">
            <button className="group flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer">
              <span>Start Planning</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>

          <Link href="/explore">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer">
              <Compass className="h-5 w-5 text-blue-600" />
              <span>Explore Destinations</span>
            </button>
          </Link>
        </motion.div>

        {/* Mini stats showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mx-auto mt-16 max-w-4xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/50 md:p-8"
        >
          <div className="grid grid-cols-3 gap-4 divide-x divide-slate-100">
            <div>
              <p className="font-display text-2xl font-black text-blue-600 md:text-3xl">10k+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Trips Planned</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-blue-600 md:text-3xl">99.8%</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Accuracy Rating</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-blue-600 md:text-3xl">50+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">AP Sights Mapped</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}