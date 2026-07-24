"use client";

import { motion } from "framer-motion";
import DestinationCard from "./DestinationCard";
import { Destination } from "@/types/destination";
import { Compass } from "lucide-react";

interface DestinationGridProps {
  destinations: Destination[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function DestinationGrid({ destinations }: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <div className="py-20 text-center rounded-2xl border border-slate-100 bg-white shadow-sm max-w-xl mx-auto">
        <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <h3 className="font-display text-lg font-bold text-slate-700">No destinations found</h3>
        <p className="mt-1 text-slate-400 text-xs font-semibold">Try refining your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </motion.div>
  );
}