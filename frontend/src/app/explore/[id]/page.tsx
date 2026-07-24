"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, Wallet, Compass, Landmark } from "lucide-react";

import { getDestination } from "@/services/destination.service";
import Button from "@/components/ui/Button";
import { formatRating } from "@/utils/formatRating";

// Dynamically import Leaflet Map to avoid Next.js SSR window errors
const MapComponent = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] w-full items-center justify-center bg-slate-100 rounded-xl border border-slate-200">
      <div className="text-slate-400 font-semibold animate-pulse">Loading interactive map...</div>
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
        <div className="mb-8 h-96 w-full rounded-2xl bg-slate-200"></div>
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
        <h1 className="text-3xl font-bold text-red-600">Error loading destination</h1>
        <p className="mt-4 text-slate-600 font-medium">
          The requested destination could not be found.
        </p>
        <Link href="/explore" className="inline-block mt-6">
          <Button>Back to Explore</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-slate-800">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 font-bold text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Explore</span>
      </button>

      {/* Hero Image Section */}
      <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-2xl shadow-lg border border-slate-200">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <span className="rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
            {destination.category}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl tracking-tight">
            {destination.name}
          </h1>
          <p className="mt-2 text-base md:text-lg text-slate-200 font-medium">
            📍 {destination.state}, India
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Star className="h-5 w-5 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rating</p>
              <p className="mt-1 text-lg font-extrabold text-slate-800">
                {formatRating(destination.rating)} / 5.0
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Best Season</p>
              <p className="mt-1 text-lg font-extrabold text-slate-800">{destination.bestSeason}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Wallet className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Avg Budget</p>
              <p className="mt-1 text-lg font-extrabold text-slate-800">{destination.budget}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Compass className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</p>
              <p className="mt-1 text-lg font-extrabold text-slate-800">{destination.category}</p>
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {destination.description ||
                `${destination.name} is a beautiful destination in ${destination.state}. Famous for its stunning sights, rich culture, and incredible local food, it attracts travelers from all over the world.`}
            </p>
          </div>

          {/* Interactive Map */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Interactive Location</h2>
            <div className="h-[350px]">
              <MapComponent
                latitude={destination.latitude}
                longitude={destination.longitude}
                name={destination.name}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Planner Widget */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-md flex flex-col justify-between h-fit">
            <div className="mb-6">
              <Landmark className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold text-slate-800">Plan a journey here?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                Let our AI travel planner map out the optimal daily routes, estimate transport, and suggest activities in {destination.name}.
              </p>
            </div>

            <Link href={`/planner?destination=${encodeURIComponent(destination.name)}`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
                Use AI Planner
              </Button>
            </Link>
          </div>

          {/* Travel Tips Widget */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-3">Quick Facts</h3>
            <ul className="space-y-3.5 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-blue-500">✔</span>
                <span>Coordinates: {destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-500">✔</span>
                <span>Starting Point Options: Accessible via airport/railway stations in {destination.state}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-500">✔</span>
                <span>Language spoken: Hindi, English and local regional languages</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
