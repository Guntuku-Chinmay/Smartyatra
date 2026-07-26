"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Calendar, Wallet, MapPin, ArrowRight, Heart, CloudSun } from "lucide-react";

import { Destination } from "@/types/destination";
import { formatRating } from "@/utils/formatRating";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Determine mock weather based on category/season
  const getWeather = () => {
    if (destination.category === "Beach") return "☀️ 29°C";
    if (destination.category === "Hills" || destination.category === "Nature") return "☁️ 22°C";
    if (destination.category === "Temple" || destination.category === "Heritage") return "🌤️ 26°C";
    return "☀️ 27°C";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-xl hover:-translate-y-1 h-full"
    >
      <div>
        {/* Cover Image with Zoom Effect */}
        <div className="relative h-60 w-full overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          
          {/* Category Badge */}
          <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-bold text-slate-800 uppercase tracking-wider backdrop-blur-sm shadow-sm select-none">
            {destination.category}
          </span>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 right-4 rounded-full h-8 w-8 flex items-center justify-center bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 hover:scale-105 active:scale-95 transition shadow-sm cursor-pointer"
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isFavorite ? "text-rose-500 fill-rose-500" : ""}`} />
          </button>

          {/* Weather Preview Overlay */}
          <span className="absolute bottom-4 left-4 rounded-full bg-slate-900/60 text-white px-2.5 py-1 text-[9px] font-bold flex items-center gap-1 backdrop-blur-sm select-none">
            <CloudSun className="h-3.5 w-3.5 text-blue-300" />
            <span>{getWeather()}</span>
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                {destination.name}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                <span>{destination.state}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 border-t border-slate-50 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Rating</span>
              </span>
              <span className="text-slate-800 font-bold">{formatRating(destination.rating)} / 5.0</span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Best Season</span>
              </span>
              <span className="text-slate-800 font-bold">{destination.bestSeason}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-emerald-500" />
                <span>Avg Budget</span>
              </span>
              <span className="text-slate-800 font-bold">{destination.budget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="px-6 pb-6 pt-2">
        <Link href={`/explore/${destination.id}`} className="block">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-bold py-3 transition-all cursor-pointer">
            <span>Explore Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}