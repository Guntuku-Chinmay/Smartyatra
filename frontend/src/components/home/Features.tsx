"use client";

import { motion } from "framer-motion";
import { CalendarRange, Coins, Compass, Sparkles, Map, Shield } from "lucide-react";

const featureList = [
  {
    title: "AI Timeline Builder",
    description: "Generate highly personalized, hour-by-hour itineraries tailored to your unique interests and pace.",
    icon: Sparkles,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Exact Budget Forecast",
    description: "Compute realistic lodging, dining, and fuel mileage costs automatically using real preference styles.",
    icon: Coins,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Sights Navigator",
    description: "Explore coordinates, local descriptions, weather guidelines, and ratings for top attractions.",
    icon: Compass,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    title: "Route Sequencer",
    description: "Solve multi-stop TSP paths instantly. Get optimized directions using permutation or greedy engines.",
    icon: Map,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    title: "Flexible Calendar Scheduler",
    description: "Easily adjust travel dates, durations, and traveler groups in a responsive plan dashboard.",
    icon: CalendarRange,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Secure Local States",
    description: "Your settings and travels are kept private and accessible with persistent client-side Zustand storage.",
    icon: Shield,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Everything You Need to <span className="gradient-text">Travel Smarter</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 font-medium">
            Smartyatra combines optimization algorithms and Generative AI to simplify every stage of trip planning.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featureList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100/80 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center rounded-xl border p-3 ${feat.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-3 text-slate-600 font-medium leading-relaxed text-sm">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}