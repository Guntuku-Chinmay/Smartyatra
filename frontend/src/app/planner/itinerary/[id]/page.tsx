"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Printer,
  Edit2,
  Save,
  Loader2,
  Coins,
  Milestone,
  Share2,
  Hotel,
  Copy,
  Check,
  Navigation,
  UtensilsCrossed,
  Sun,
  Sunset
} from "lucide-react";

import { getTrip, getItineraries, ItineraryEntry, Trip } from "@/services/planner.service";
import { getBudgets, updateBudget, Budget } from "@/services/budget.service";
import { getDestinations } from "@/services/destination.service";
import { Destination } from "@/types/destination";
import Dialog from "@/components/ui/Dialog";
import { useToast } from "@/store/toast.store";

const MapComponent = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-bold text-xs">
      Loading map engine...
    </div>
  ),
});

function getDestinationCoords(destId: number) {
  return {
    latitude: destId === 2 ? 32.2396 : destId === 3 ? 15.3350 : destId === 4 ? 10.0889 : destId === 5 ? 26.9124 : destId === 6 ? 11.7401 : 15.2993,
    longitude: destId === 2 ? 77.1887 : destId === 3 ? 76.4600 : destId === 4 ? 77.0595 : destId === 5 ? 75.7873 : destId === 6 ? 92.6586 : 74.1240,
  };
}



// Haversine distance solver (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Driving travel time calculation approximation
function calculateTravelTime(distance: number) {
  // Assume average speed 40km/h in traffic/hills
  return Math.round(distance * 1.5 + 5);
}

// Premium Destination Image Heuristic Resolver
function getDestinationImageUrl(name: string) {
  const query = name ? name.toLowerCase() : "";
  if (
    query.includes("beach") ||
    query.includes("rshikonda") ||
    query.includes("vizag") ||
    query.includes("visakhapatnam")
  ) {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
  }
  if (
    query.includes("valley") ||
    query.includes("araku") ||
    query.includes("hill") ||
    query.includes("kailasagiri")
  ) {
    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
  }
  if (
    query.includes("temple") ||
    query.includes("tirupati") ||
    query.includes("simhachalam") ||
    query.includes("church") ||
    query.includes("mosque")
  ) {
    return "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80";
  }
  if (query.includes("cave") || query.includes("borra")) {
    return "https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&w=600&q=80";
  }
  return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80";
}

// Weather Forecast Heuristic Resolver
function getDestinationWeather(name: string) {
  const query = name ? name.toLowerCase() : "";
  if (query.includes("beach") || query.includes("rshikonda")) {
    return { temp: "30°C", status: "Sunny", icon: "☀️" };
  }
  if (query.includes("valley") || query.includes("araku") || query.includes("hill")) {
    return { temp: "21°C", status: "Cool Mist", icon: "🌫️" };
  }
  if (query.includes("borra") || query.includes("cave")) {
    return { temp: "19°C", status: "Damp Cave", icon: "💧" };
  }
  return { temp: "26°C", status: "Partly Cloudy", icon: "⛅" };
}

export default function ItineraryPage() {
  const params = useParams();
  const tripId = params.id as string;
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [activeDay, setActiveDay] = useState(1);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [actualCostInput, setActualCostInput] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch Trip Details
  const { data: trip, isLoading: isTripLoading } = useQuery<Trip>({
    queryKey: ["trip", tripId],
    queryFn: () => getTrip(parseInt(tripId)),
    enabled: !!tripId,
  });

  // Fetch Itineraries
  const { data: allItineraries = [], isLoading: isItinerariesLoading } = useQuery<ItineraryEntry[]>({
    queryKey: ["itineraries"],
    queryFn: getItineraries,
  });

  const tripItineraries = allItineraries.filter((i) => i.trip_id === parseInt(tripId));

  // Fetch Budgets
  const { data: allBudgets = [], isLoading: isBudgetsLoading } = useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  const budgets = allBudgets.filter((b) => b.trip_id === parseInt(tripId));
  const tripBudget = budgets.length > 0 ? budgets[0] : null;

  // Fetch all destinations
  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  const budgetMutation = useMutation({
    mutationFn: (actualCost: number) => {
      if (!tripBudget) throw new Error("No budget found");
      return updateBudget(tripBudget.id, { actual_cost: actualCost });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", tripId] });
      setIsEditingBudget(false);
      setActualCostInput(null);
      showToast("Budget updated successfully!", "success");
    },
    onError: () => {
      showToast("Failed to update budget details.", "error");
    },
  });

  if (isTripLoading || isItinerariesLoading || isBudgetsLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold">Generating your timeline layout...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center bg-slate-50 dark:bg-slate-950 min-h-[80vh] flex flex-col justify-center items-center">
        <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">Trip record not found</h2>
        <p className="mt-2 text-slate-400 dark:text-slate-550 font-semibold">Please check the ID or return to Dashboard.</p>
        <Link href="/dashboard" className="inline-block mt-6">
          <button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 transition cursor-pointer">
            Go to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  // Get list of unique days
  const days = Array.from(new Set(tripItineraries.map((i) => i.day_number))).sort((a, b) => a - b);
  const activeItinerary = tripItineraries.filter((i) => i.day_number === activeDay);

  // Map active itinerary items to destinations
  const dayStops = activeItinerary
    .map((item) => {
      const dest = destinations.find((d) => d.id === item.destination_id);
      return dest ? { ...item, destDetails: dest } : null;
    })
    .filter(Boolean) as (ItineraryEntry & { destDetails: Destination })[];

  // Define geolocated waypoints to compute Haversine routes
  const hasStops = dayStops.length > 0;
  const stop1 = hasStops ? dayStops[0].destDetails : null;
  const stop2 = dayStops.length > 1 ? dayStops[1].destDetails : stop1;

  // Mock hotel near Stop 1
  const stop1Coords = stop1 ? getDestinationCoords(stop1.id) : { latitude: 15.2993, longitude: 74.1240 };
  const stop2Coords = stop2 ? getDestinationCoords(stop2.id) : stop1Coords;

  const hotelLat = stop1Coords.latitude + 0.025;
  const hotelLng = stop1Coords.longitude - 0.025;

  // Mock sunset scenic point near Stop 2
  const sunsetLat = stop2Coords.latitude - 0.015;
  const sunsetLng = stop2Coords.longitude + 0.015;

  // Distance calculations
  const distHotelToStop1 = stop1 ? calculateDistance(hotelLat, hotelLng, stop1Coords.latitude, stop1Coords.longitude) : 5.0;
  const distStop1ToLunch = stop1 ? 3.5 : 3.0; // short lunch drive
  const distLunchToStop2 = stop2 && stop1 ? calculateDistance(stop1Coords.latitude, stop1Coords.longitude, stop2Coords.latitude, stop2Coords.longitude) * 0.6 : 4.0;
  const distStop2ToSunset = stop2 ? calculateDistance(stop2Coords.latitude, stop2Coords.longitude, sunsetLat, sunsetLng) : 4.5;
  const distSunsetToHotel = stop2 ? calculateDistance(sunsetLat, sunsetLng, hotelLat, hotelLng) : 8.0;

  // Total daily route summary
  const totalDailyDistance = parseFloat(
    (distHotelToStop1 + distStop1ToLunch + distLunchToStop2 + distStop2ToSunset + distSunsetToHotel).toFixed(1)
  );
  const totalDailyTravelTime =
    calculateTravelTime(distHotelToStop1) +
    calculateTravelTime(distStop1ToLunch) +
    calculateTravelTime(distLunchToStop2) +
    calculateTravelTime(distStop2ToSunset) +
    calculateTravelTime(distSunsetToHotel);

  const totalEstimatedTripCost = (tripBudget?.estimated_cost || 0) + (days.length * 800);

  const activeMarkers = dayStops.map((item) => ({
    latitude: getDestinationCoords(item.destDetails.id).latitude,
    longitude: getDestinationCoords(item.destDetails.id).longitude,
    name: item.destDetails.name,
  }));

  const handleUpdateExpenses = () => {
    const cost = parseFloat(actualCostInput ?? tripBudget?.actual_cost.toString() ?? "0");
    if (!isNaN(cost) && cost >= 0) {
      budgetMutation.mutate(cost);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Trip share link copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mock Hotel Recommendations based on current destination region
  const hotelRecommendations = [
    {
      name: stop1 ? `${stop1.name} View Resort` : "Valley Vista Hotel",
      rating: "⭐ 4.6",
      price: "₹5,200/night",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Grand AP Residency",
      rating: "⭐ 4.2",
      price: "₹3,100/night",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 print:py-0 print:px-0 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      {/* Back & Share/Print Row */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-2.5">
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2.5 text-xs font-bold text-slate-650 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-450" />
            <span>Share Plan</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2.5 text-xs font-bold text-slate-655 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="mb-8 rounded-3xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-3 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            {trip.status}
          </span>
          <h1 className="font-display mt-3 text-3xl font-black text-slate-900 dark:text-white tracking-tight">{trip.name}</h1>
          <p className="mt-1.5 text-slate-550 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-450" />
            <span>
              {trip.start_date} to {trip.end_date} ({days.length} Days)
            </span>
          </p>
        </div>

        {/* Cost stats */}
        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-slate-150 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Daily Route</p>
            <p className="text-lg font-black mt-1 text-slate-900 dark:text-white">
              {totalDailyDistance} km <span className="text-xs font-bold text-slate-500">({totalDailyTravelTime}m drive)</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wide">Est. Total Cost</p>
            <p className="text-lg font-black mt-1 text-emerald-600 dark:text-emerald-450">
              ₹{totalEstimatedTripCost.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3 print:grid-cols-1">
        {/* Left columns: Itinerary Timeline */}
        <div className="lg:col-span-2 space-y-6 print:w-full">
          {/* Day selection tabs */}
          {days.length > 0 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-900 print:hidden">
              {days.map((day) => {
                const isActive = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className="relative px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className={`relative z-10 ${isActive ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"}`}>
                      Day {day}
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="activeDayTab"
                        className="absolute inset-0 z-0 rounded-xl bg-blue-600 dark:bg-blue-500 shadow-md shadow-blue-500/10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute inset-0 z-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-center rounded-3xl font-bold text-slate-400">
              No itinerary stops generated.
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Day {activeDay} Schedule</h2>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold print:hidden">
              {dayStops.length} Destinations Planned
            </span>
          </div>

          {/* Timeline Node List */}
          <div className="relative border-l-2 border-slate-150 dark:border-slate-800 ml-4 pl-8 space-y-8">
            
            {/* 1. BREAKFAST */}
            <div className="relative group">
              <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white border-4 border-slate-50 dark:border-slate-950 ring-4 ring-amber-100 dark:ring-amber-950/20" >
                <UtensilsCrossed className="h-3 w-3" />
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">08:00 AM • Breakfast</p>
                <h3 className="font-display text-base font-black text-slate-950 dark:text-white">Traditional South Indian Dining</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Start your day with steaming Idli, crispy Dosa, and authentic filter coffee at your hotel or local kitchen.
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Est. Cost: ~₹150</span>
                  <span className="flex items-center gap-1"><Sun className="h-3 w-3 text-amber-500" /> Morning Sunny</span>
                </div>
              </div>
            </div>

            {/* ROUTE SEGMENT 1 */}
            {stop1 && (
              <div className="py-1 flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 pl-4 border-l border-dashed border-slate-200 dark:border-slate-800 -my-4 ml-[-32px]">
                <Milestone className="h-4 w-4 text-blue-500" />
                <span>Drive {distHotelToStop1} km • ~{calculateTravelTime(distHotelToStop1)} mins drive</span>
              </div>
            )}

            {/* 2. STOP 1 (MORNING DESTINATION) */}
            {stop1 ? (
              <div className="relative group">
                <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white border-4 border-slate-50 dark:border-slate-950 ring-4 ring-blue-100 dark:ring-blue-950/20">
                  <span className="text-[10px] font-black">1</span>
                </div>
                <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Destination Image */}
                    <div className="relative h-28 w-full md:w-40 overflow-hidden rounded-xl shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getDestinationImageUrl(stop1.name)} alt={stop1.name} className="object-cover h-full w-full" />
                      <div className="absolute top-2 left-2 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide">
                        {stop1.category}
                      </div>
                    </div>
                    {/* Destination content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-450 uppercase tracking-wide">09:00 AM • Morning Stop</p>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          {getDestinationWeather(stop1.name).icon} {getDestinationWeather(stop1.name).temp}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-black text-slate-950 dark:text-white truncate">{stop1.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        Explore scenic viewpoints, heritage centers, and photography checkpoints.
                      </p>
                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap gap-2.5 items-center justify-between">
                        <div className="text-[10px] font-bold text-slate-400">
                          Est. Cost: <span className="text-slate-800 dark:text-slate-200">₹{stop1.budget}</span>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${stop1Coords.latitude},${stop1Coords.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250/20 px-3.5 py-1.5 text-[10px] font-black text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        >
                          <Navigation className="h-3 w-3 text-blue-600" />
                          <span>Navigate</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs font-semibold">No morning destination stop scheduled.</div>
            )}

            {/* ROUTE SEGMENT 2 */}
            {stop1 && (
              <div className="py-1 flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 pl-4 border-l border-dashed border-slate-200 dark:border-slate-800 -my-4 ml-[-32px]">
                <Milestone className="h-4 w-4 text-blue-500" />
                <span>Drive {distStop1ToLunch} km • ~{calculateTravelTime(distStop1ToLunch)} mins drive</span>
              </div>
            )}

            {/* 3. LUNCH */}
            <div className="relative group">
              <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white border-4 border-slate-50 dark:border-slate-950 ring-4 ring-amber-100 dark:ring-amber-950/20">
                <UtensilsCrossed className="h-3 w-3" />
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">01:00 PM • Lunch Break</p>
                <h3 className="font-display text-base font-black text-slate-950 dark:text-white">Authentic Andhra Thali Meals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Indulge in hot rice served with aromatic ghee, spicy Pappu (lentils), Avakaya (mango pickle), and Gongura pachadi.
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Est. Cost: ~₹250</span>
                  <span className="flex items-center gap-1">⛅ Humid 28°C</span>
                </div>
              </div>
            </div>

            {/* ROUTE SEGMENT 3 */}
            {stop2 && stop1 && (
              <div className="py-1 flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 pl-4 border-l border-dashed border-slate-200 dark:border-slate-800 -my-4 ml-[-32px]">
                <Milestone className="h-4 w-4 text-blue-500" />
                <span>Drive {distLunchToStop2.toFixed(1)} km • ~{calculateTravelTime(distLunchToStop2)} mins drive</span>
              </div>
            )}

            {/* 4. STOP 2 (AFTERNOON DESTINATION) */}
            {stop2 ? (
              <div className="relative group">
                <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white border-4 border-slate-50 dark:border-slate-950 ring-4 ring-blue-100 dark:ring-blue-950/20">
                  <span className="text-[10px] font-black">2</span>
                </div>
                <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Destination Image */}
                    <div className="relative h-28 w-full md:w-40 overflow-hidden rounded-xl shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getDestinationImageUrl(stop2.name)} alt={stop2.name} className="object-cover h-full w-full" />
                      <div className="absolute top-2 left-2 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide">
                        {stop2.category}
                      </div>
                    </div>
                    {/* Destination content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-455 uppercase tracking-wide">02:00 PM • Afternoon Stop</p>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          {getDestinationWeather(stop2.name).icon} {getDestinationWeather(stop2.name).temp}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-black text-slate-955 dark:text-white truncate">{stop2.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        Explore local history, archeological museums, and take in the panoramic natural vistas of the area.
                      </p>
                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap gap-2.5 items-center justify-between">
                        <div className="text-[10px] font-bold text-slate-400">
                          Est. Cost: <span className="text-slate-800 dark:text-slate-200">₹{stop2.budget}</span>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${stop2Coords.latitude},${stop2Coords.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250/20 px-3.5 py-1.5 text-[10px] font-black text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        >
                          <Navigation className="h-3 w-3 text-blue-600" />
                          <span>Navigate</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs font-semibold">No afternoon destination stop scheduled.</div>
            )}

            {/* ROUTE SEGMENT 4 */}
            {stop2 && (
              <div className="py-1 flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 pl-4 border-l border-dashed border-slate-200 dark:border-slate-800 -my-4 ml-[-32px]">
                <Milestone className="h-4 w-4 text-blue-500" />
                <span>Drive {distStop2ToSunset} km • ~{calculateTravelTime(distStop2ToSunset)} mins drive</span>
              </div>
            )}

            {/* 5. SUNSET POINT */}
            <div className="relative group">
              <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-650 dark:bg-indigo-600 text-white border-4 border-slate-50 dark:border-slate-950 ring-4 ring-indigo-100 dark:ring-indigo-950/20">
                <Sunset className="h-3 w-3" />
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">05:30 PM • Sunset Point</p>
                <h3 className="font-display text-base font-black text-slate-950 dark:text-white">Scenic Horizon Viewpoint</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Enjoy peaceful sunset views over the coastal lines or rolling valley hills with hot ginger tea snacks.
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Est. Cost: ~₹50</span>
                  <span className="flex items-center gap-1">🌫️ Cool 23°C</span>
                </div>
              </div>
            </div>

            {/* ROUTE SEGMENT 5 */}
            {stop2 && (
              <div className="py-1 flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 pl-4 border-l border-dashed border-slate-200 dark:border-slate-800 -my-4 ml-[-32px]">
                <Milestone className="h-4 w-4 text-blue-500" />
                <span>Drive {distSunsetToHotel} km • ~{calculateTravelTime(distSunsetToHotel)} mins drive</span>
              </div>
            )}

            {/* 6. HOTEL RETURN / DINNER */}
            <div className="relative group">
              <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-650 text-white border-4 border-slate-50 dark:border-slate-950 ring-4 ring-blue-10 ring-blue-100 dark:ring-blue-950/20">
                <Hotel className="h-3 w-3" />
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-450 uppercase tracking-wide">07:30 PM • Dinner & Lodging</p>
                <h3 className="font-display text-base font-black text-slate-950 dark:text-white">Hotel Night Stay</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Return to your comfortable resort stay for dinner and overnight sleep to recharge for the next day.
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Est. Cost: ~₹350 (Dinner)</span>
                  <span className="flex items-center gap-1">🌙 Clear 21°C</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right columns: Maps, Budget, & Hotels Widgets */}
        <div className="space-y-6 print:hidden">
          {/* Map Widget */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <h3 className="font-display text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Milestone className="h-5 w-5 text-blue-500" />
              <span>Daily Path Route</span>
            </h3>
            <div className="h-[250px] overflow-hidden rounded-2xl border border-slate-50 dark:border-slate-800 shadow-inner">
              {activeMarkers.length > 0 ? (
                <MapComponent markers={activeMarkers} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold text-xs">
                  No stops to plot.
                </div>
              )}
            </div>
          </div>

          {/* Budget Widget */}
          {tripBudget && (
            <div className="rounded-3xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Coins className="h-5 w-5 text-blue-500" />
                  <span>Expenses Tracker</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {isEditingBudget ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>

              {/* Progress bar visual */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                  <span>Spent: ₹{tripBudget.actual_cost.toLocaleString("en-IN")}</span>
                  <span>Limit: ₹{tripBudget.estimated_cost.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      tripBudget.actual_cost > tripBudget.estimated_cost ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (tripBudget.actual_cost / tripBudget.estimated_cost) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Form editing inputs */}
              {isEditingBudget ? (
                <div className="flex gap-2 pt-2 border-t border-slate-55 dark:border-slate-800">
                  <input
                    type="number"
                    value={actualCostInput ?? tripBudget?.actual_cost.toString() ?? ""}
                    onChange={(e) => setActualCostInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs outline-none focus:border-blue-500 bg-slate-50/20 text-slate-800 dark:text-slate-150"
                    placeholder="Enter expenses"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateExpenses}
                    disabled={budgetMutation.isPending}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-pulse-once"
                  >
                    {budgetMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-55 dark:border-slate-800 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Remaining</p>
                    <p className={`text-base font-black mt-1 ${tripBudget.remaining_budget >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      ₹{tripBudget.remaining_budget.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</p>
                    <p className={`text-xs font-black mt-1.5 uppercase ${tripBudget.remaining_budget >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {tripBudget.remaining_budget >= 0 ? "On Track" : "Over Budget"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hotels recommendations widget */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="font-display text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Hotel className="h-5 w-5 text-blue-500" />
              <span>Lodging recommendations</span>
            </h3>
            <div className="space-y-3">
              {hotelRecommendations.map((hotel, idx) => (
                <div key={idx} className="flex gap-3 rounded-2xl border border-slate-50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/40 p-2.5 hover:bg-white dark:hover:bg-slate-850 hover:shadow-md transition duration-200">
                  <div className="relative h-14 w-20 overflow-hidden rounded-xl shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hotel.image} alt={hotel.name} className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{hotel.name}</p>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-[10px] font-bold text-slate-500">{hotel.rating}</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-350">{hotel.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Trip Dialog Modal */}
      <Dialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Share Itinerary">
        <div className="space-y-6 pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            Invite travel companions or share your optimized schedule with friends using this URL:
          </p>
          <div className="flex gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 items-center">
            <span className="text-xs font-bold text-slate-400 pl-2 truncate flex-1 select-all">
              {typeof window !== "undefined" ? window.location.href : ""}
            </span>
            <button
              onClick={handleCopyLink}
              className="rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-750 h-9 w-9 flex items-center justify-center text-slate-500 dark:text-slate-300 cursor-pointer shadow-sm transition"
            >
              {copied ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Copy className="h-4.5 w-4.5" />}
            </button>
          </div>
          <div className="flex justify-end border-t border-slate-50 dark:border-slate-850 pt-4">
            <button
              onClick={() => setIsShareOpen(false)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 text-xs transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
