"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Users, Search, Coins, Compass } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  
  // Search Form State
  const [startLoc, setStartLoc] = useState("");
  const [destLoc, setDestLoc] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("Standard");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      start: startLoc,
      destination: destLoc,
      travelers,
      budget
    });
    router.push(`/planner?${query.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[65vh] lg:min-h-[70vh] flex flex-col overflow-hidden bg-slate-950 text-white">
      {/* Background Image: Immersive Andhra Pradesh Gandikota/Visakhapatnam backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      
      {/* Deep Navy Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071A2E]/90 via-[#071A2E]/65 to-[#F8FAFC]" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-8 xl:px-10 flex-1 flex flex-col justify-between pt-28 pb-10">
        
        {/* Headline & Subtitle Centered Vertically */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-4xl mx-auto my-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 backdrop-blur-md"
          >
            <Sparkles className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
            <span>Smartyatra AI Travel Engine v2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] md:mt-2"
          >
            Plan Your Next <span className="text-blue-400">Journey</span> with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 font-semibold text-sm sm:text-base max-w-2xl leading-relaxed"
          >
            Calculate dynamic travel budgets, solve geodetic route optimization, map weather forecasts, and generate custom day-wise itineraries instantly.
          </motion.p>
        </div>

        {/* Embedded Premium Search Planner Card (Taller inputs, aligned bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl mt-8"
        >
          <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-12 items-end">
            
            {/* Start Location */}
            <div className="md:col-span-3 text-left">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-blue-400" />
                <span>Start Location</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Visakhapatnam"
                value={startLoc}
                onChange={(e) => setStartLoc(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/10 border border-white/10 focus:border-blue-400 px-4 text-xs font-bold text-white placeholder-slate-400 outline-none transition"
                required
              />
            </div>

            {/* Destination Location */}
            <div className="md:col-span-3 text-left">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Goa, Munnar"
                value={destLoc}
                onChange={(e) => setDestLoc(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/10 border border-white/10 focus:border-blue-400 px-4 text-xs font-bold text-white placeholder-slate-400 outline-none transition"
                required
              />
            </div>

            {/* Budget style */}
            <div className="md:col-span-2 text-left">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-blue-400" />
                <span>Budget Style</span>
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 focus:border-blue-400 px-4 text-xs font-bold text-white outline-none transition cursor-pointer"
              >
                <option value="Budget" className="bg-slate-900">Budget</option>
                <option value="Standard" className="bg-slate-900">Standard</option>
                <option value="Luxury" className="bg-slate-900">Luxury</option>
              </select>
            </div>

            {/* Travelers */}
            <div className="md:col-span-2 text-left">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-blue-400" />
                <span>Travelers</span>
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 focus:border-blue-400 px-4 text-xs font-bold text-white outline-none transition cursor-pointer"
              >
                <option value="1" className="bg-slate-900">1 Traveler</option>
                <option value="2" className="bg-slate-900">2 Travelers</option>
                <option value="4" className="bg-slate-900">4 Travelers</option>
                <option value="6" className="bg-slate-900">Family (6+)</option>
              </select>
            </div>

            {/* CTA Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs px-4 shadow-lg shadow-blue-500/10 cursor-pointer transition transform hover:-translate-y-0.5"
              >
                <Search className="h-4 w-4" />
                <span>Plan My Trip</span>
              </button>
            </div>

          </form>
        </motion.div>
        
      </div>
    </section>
  );
}