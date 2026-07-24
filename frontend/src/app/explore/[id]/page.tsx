"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Calendar, Wallet, Compass, Landmark, Info, MapPin } from "lucide-react";

import { getDestination } from "@/services/destination.service";
import { formatRating } from "@/utils/formatRating";

const MapComponent = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] w-full items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
      <div className="text-slate-400 font-bold text-xs animate-pulse">Loading interactive map...</div>
    </div>
  ),
});

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params.id;
  const id = typeof idStr === "string" ? parseInt(idStr) : Array.isArray(idStr) ? parseInt(idStr[0]) : NaN;

  const {
    data: destination,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["destination", id],
    queryFn: () => getDestination(id),
    enabled: !isNaN(id),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse">
        <div className="mb-6 h-6 w-24 rounded bg-slate-200"></div>
        <div className="mb-8 h-96 w-full rounded-3xl bg-slate-200"></div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-1/3 rounded bg-slate-200"></div>
            <div className="h-24 w-full rounded bg-slate-200"></div>
            <div className="h-64 w-full rounded bg-slate-200"></div>
          </div>
          <div className="h-48 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  if (isError || !destination || isNaN(id)) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-center">
        <div className="max-w-md mx-auto py-12 border border-red-100 rounded-2xl bg-red-50/50">
          <h1 className="font-display text-2xl font-bold text-red-700">Error loading destination</h1>
          <p className="mt-2 text-slate-500 text-sm font-semibold">The requested destination could not be found.</p>
          <Link href="/explore" className="inline-block mt-6">
            <button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 transition-colors cursor-pointer">
              Back to Explore
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="group mb-6 flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Explore</span>
      </button>

      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-10 h-[400px] w-full overflow-hidden rounded-3xl shadow-lg border border-slate-100"
      >
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <span className="rounded-full bg-blue-600/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
            {destination.category}
          </span>
          <h1 className="font-display mt-4 text-4xl font-black md:text-5xl tracking-tight leading-tight">
            {destination.name}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-sm font-bold text-slate-200">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span>{destination.state}, India</span>
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rating</p>
              <p className="mt-1.5 text-lg font-black text-slate-800">
                {formatRating(destination.rating)} / 5.0
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Best Season</p>
              <p className="mt-1.5 text-base font-black text-slate-800">{destination.bestSeason}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <Wallet className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Avg Budget</p>
              <p className="mt-1.5 text-base font-black text-slate-800">{destination.budget}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <Compass className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</p>
              <p className="mt-1.5 text-base font-black text-slate-800">{destination.category}</p>
            </div>
          </div>

          {/* About description */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-black text-slate-900 mb-4">About {destination.name}</h2>
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              {destination.description ||
                `${destination.name} is a beautiful tourist destination located in ${destination.state}. Known for its picturesque landscapes, local culture, and delicious food specialties, it represents a perfect holiday getaway.`}
            </p>
          </div>

          {/* Interactive Map */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900">Interactive Map Pin</h2>
            <div className="h-[350px] overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <MapComponent
                latitude={destination.latitude}
                longitude={destination.longitude}
                name={destination.name}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Planner Widget & Tips */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-white p-6 shadow-md shadow-blue-500/5">
            <Landmark className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="font-display text-xl font-black text-slate-900">Plan a trip here?</h3>
            <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed">
              Let our AI planner create the optimal route, budget estimate, and hour-by-hour schedules for your visit to {destination.name}.
            </p>
            <Link href={`/planner?destination=${encodeURIComponent(destination.name)}`} className="block mt-6">
              <button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 shadow-lg shadow-blue-500/10 transition-colors cursor-pointer">
                Use AI Planner
              </button>
            </Link>
          </div>

          {/* Quick Facts Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <span>Quick Facts</span>
            </h3>
            <ul className="space-y-4 text-xs font-semibold text-slate-500">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</span>
                <span>Coordinates: {destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</span>
                <span>Language: Telugu, Hindi, English</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</span>
                <span>Best travel mode: DRIVING / TRANSIT</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
