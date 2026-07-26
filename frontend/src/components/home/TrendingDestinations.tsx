"use client";

import { useTravelStore } from "@/store/travel.store";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Eye, Compass, Heart, ArrowRight } from "lucide-react";

interface DestinationItem {
  id: number;
  name: string;
  category: string;
  rating: number;
  image: string;
  desc: string;
  budget: string;
}

const mockDestinations: DestinationItem[] = [
  {
    id: 1,
    name: "Goa Beaches",
    category: "Beach",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    desc: "Scenic sandy beaches, active water sports, and sunset shacks.",
    budget: "₹2,500"
  },
  {
    id: 2,
    name: "Manali Valleys",
    category: "Mountain",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    desc: "Snow-capped valleys, river rafting, and mountain paragliding.",
    budget: "₹4,000"
  },
  {
    id: 3,
    name: "Hampi Ruins",
    category: "Heritage",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    desc: "Ancient monument towers, stone ruins, and coracle rides.",
    budget: "₹1,800"
  },
  {
    id: 4,
    name: "Munnar Hills",
    category: "Mountain",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    desc: "Lush green tea gardens, driving mist, and spice fields.",
    budget: "₹3,200"
  },
  {
    id: 5,
    name: "Jaipur Palace",
    category: "Heritage",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1477584305590-3a55010cbc39?auto=format&fit=crop&w=600&q=80",
    desc: "Royal palaces, historical forts, and vibrant local bazaars.",
    budget: "₹3,500"
  },
  {
    id: 6,
    name: "Andaman Oceans",
    category: "Beach",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1608958416738-98e3bcfb7fc2?auto=format&fit=crop&w=600&q=80",
    desc: "Exotic islands, blue waters, and active coral reef diving.",
    budget: "₹6,000"
  }
];

export default function TrendingDestinations() {
  const { recentlyViewed, bookmarks, toggleBookmark } = useTravelStore();

  // Get recently viewed objects
  const viewedItems = mockDestinations.filter((d) => recentlyViewed.includes(d.id));

  return (
    <section className="py-20 bg-white space-y-20">
      {/* Trending Destinations */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Trending <span className="gradient-text">Destinations</span>
            </h2>
            <p className="mt-4 text-base text-slate-500 font-semibold max-w-2xl">
              Explore the highest rated spots and AI-recommended weekend getaways.
            </p>
          </div>
          <Link href="/explore">
            <button className="mt-6 md:mt-0 flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 cursor-pointer group">
              <span>View All Places</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mockDestinations.slice(0, 3).map((item, idx) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/30 p-3 transition shadow-sm hover:shadow-md hover:border-slate-200"
              >
                <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition cursor-pointer shadow-sm ${
                        isBookmarked
                          ? "bg-rose-500 text-white"
                          : "bg-white/80 text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-4.5 w-4.5 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black text-slate-800 uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-400 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Budget</p>
                      <p className="text-xs font-black text-emerald-600">{item.budget}</p>
                    </div>
                    <Link href={`/explore`}>
                      <button className="flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">
                        <span>Details</span>
                        <Compass className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recently Viewed Carousel */}
      {viewedItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 border-t border-slate-100 pt-16">
          <div className="mb-10">
            <h3 className="font-display text-2xl font-black text-slate-800 flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-500" />
              <span>Recently Viewed Trips</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Pick up right where you left off.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {viewedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 transition shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-16/11 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </p>
                  <h4 className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-black text-emerald-600">{item.budget}</span>
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                      ★ {item.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
