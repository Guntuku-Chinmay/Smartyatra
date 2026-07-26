"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, MapPin, Calendar, Users, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-slate-50 py-20 lg:py-32">
      {/* Ambient Blurred Orbs */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-80 w-80 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-2 text-xs font-bold text-blue-700 backdrop-blur-md"
            >
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              <span>Smartyatra v2.0 is Live</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl leading-[1.1]"
            >
              Plan Your Next Journey with the Power of <span className="gradient-text">Generative AI</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm font-semibold text-slate-500 max-w-xl leading-relaxed"
            >
              Discover popular sights, calculate travel budgets exactly, and generate optimized schedules in seconds. Seamless, smart, and fully personalized for your vacation.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/planner">
                <button className="group flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer">
                  <span>Start Planning</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>

              <Link href="/explore">
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer">
                  <Compass className="h-5 w-5 text-blue-600" />
                  <span>Explore Sights</span>
                </button>
              </Link>
            </motion.div>

            {/* Simulated Travel Search Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-100/80 max-w-2xl hidden sm:grid grid-cols-12 gap-3 items-center divide-x divide-slate-100"
            >
              <div className="col-span-4 flex items-center gap-2 px-1">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Destination</p>
                  <p className="text-xs font-bold text-slate-800">Visakhapatnam, AP</p>
                </div>
              </div>
              <div className="col-span-4 flex items-center gap-2 pl-3">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Travel Dates</p>
                  <p className="text-xs font-bold text-slate-800">Jul 28 - Aug 01</p>
                </div>
              </div>
              <div className="col-span-4 flex items-center justify-between pl-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Guests</p>
                    <p className="text-xs font-bold text-slate-800">2 Travelers</p>
                  </div>
                </div>
                <Link href="/planner?destination=Visakhapatnam">
                  <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition">
                    <Search className="h-4.5 w-4.5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Globe/Map Illustration Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[400px] h-[400px] rounded-full bg-blue-50/50 border border-blue-100 flex items-center justify-center p-6"
            >
              {/* Spinning background outline */}
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-200/60 animate-spin" style={{ animationDuration: "60s" }} />

              {/* Central Map Graphic */}
              <div className="relative w-full h-full rounded-full bg-cover bg-center border border-white/60 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')] shadow-inner overflow-hidden">
                {/* Floating markers */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute top-1/4 left-1/3 flex items-center gap-2 rounded-xl bg-white p-2 shadow-lg border border-slate-100 cursor-pointer"
                >
                  <MapPin className="h-4 w-4 text-rose-500 fill-current" />
                  <span className="text-[10px] font-black text-slate-800">Goa</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.5, ease: "easeInOut" }}
                  className="absolute bottom-1/3 right-1/4 flex items-center gap-2 rounded-xl bg-white p-2 shadow-lg border border-slate-100 cursor-pointer"
                >
                  <MapPin className="h-4 w-4 text-emerald-500 fill-current" />
                  <span className="text-[10px] font-black text-slate-800">Tirupati</span>
                </motion.div>
              </div>

              {/* Small floating affinity percentage */}
              <motion.div
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                className="absolute -right-4 top-1/3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg border border-slate-100"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-600 font-extrabold">98%</div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Match</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}