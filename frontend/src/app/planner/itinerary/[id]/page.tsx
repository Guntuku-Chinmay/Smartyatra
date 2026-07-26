"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Printer, Edit2, Save, Loader2, Coins, Milestone, Share2, Hotel, Copy, Check } from "lucide-react";

import { getTrip, getItineraries, ItineraryEntry, Trip } from "@/services/planner.service";
import { getBudgets, updateBudget, Budget } from "@/services/budget.service";
import { getDestinations } from "@/services/destination.service";
import Dialog from "@/components/ui/Dialog";
import { useToast } from "@/store/toast.store";

const MapComponent = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 font-bold text-xs">
      Loading map engine...
    </div>
  ),
});

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

  // Fetch all destinations
  const { data: destinations = [] } = useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  const tripBudget = budgets.length > 0 ? budgets[0] : null;

  // Budget Mutation
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
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold">Generating your timeline layout...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-black text-slate-800">Trip record not found</h2>
        <p className="mt-2 text-slate-400 font-semibold">Please check the ID or return to Dashboard.</p>
        <Link href="/dashboard" className="inline-block mt-6">
          <button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 transition">
            Go to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  // Get list of unique days
  const days = Array.from(new Set(tripItineraries.map((i) => i.day_number))).sort((a, b) => a - b);
  const activeItinerary = tripItineraries.filter((i) => i.day_number === activeDay);

  const activeMarkers = activeItinerary.map((item) => {
    const dest = destinations.find((d) => d.id === item.destination_id);
    return {
      latitude: dest?.id === 2 ? 32.2396 : dest?.id === 3 ? 15.3350 : dest?.id === 4 ? 10.0889 : dest?.id === 5 ? 26.9124 : dest?.id === 6 ? 11.7401 : 15.2993,
      longitude: dest?.id === 2 ? 77.1887 : dest?.id === 3 ? 76.4600 : dest?.id === 4 ? 77.0595 : dest?.id === 5 ? 75.7873 : dest?.id === 6 ? 92.6586 : 74.1240,
      name: dest ? dest.name : "Activity Stop",
    };
  });

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

  // Mock Hotel Recommendations based on Destination
  const hotelRecommendations = [
    {
      name: "The Gateway Hotel Beach Road",
      rating: "⭐ 4.6",
      price: "₹6,800/night",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Araku Hill Valley Resort",
      rating: "⭐ 4.2",
      price: "₹3,900/night",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 print:py-0 print:px-0">
      {/* Back & Share/Print Row */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-2.5">
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="h-4 w-4 text-blue-600" />
            <span>Share Trip</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
            {trip.status}
          </span>
          <h1 className="font-display mt-3 text-3xl font-black text-slate-900 tracking-tight">{trip.name}</h1>
          <p className="mt-1.5 text-slate-500 text-xs font-bold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              {trip.start_date} to {trip.end_date}
            </span>
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left columns: Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day selection tabs */}
          {days.length > 0 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-2 border-b border-slate-100 print:hidden">
              {days.map((day) => {
                const isActive = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className="relative px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className={`relative z-10 ${isActive ? "text-white" : "text-slate-600 hover:text-slate-900"}`}>
                      Day {day}
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="activeDayTab"
                        className="absolute inset-0 z-0 rounded-xl bg-blue-600 shadow-md shadow-blue-500/10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute inset-0 z-0 rounded-xl border border-slate-200 bg-white hover:bg-slate-50" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 border-2 border-dashed border-slate-200 bg-white text-center rounded-2xl font-bold text-slate-400">
              No itinerary stops generated.
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl font-black text-slate-900">Day {activeDay} Timeline</h2>
            <span className="text-slate-400 text-xs font-bold print:hidden">
              {activeItinerary.length} Stops Scheduled
            </span>
          </div>

          {/* Timeline Node List */}
          <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
            {activeItinerary.map((item) => {
              const dest = destinations.find((d) => d.id === item.destination_id);
              let formattedTime = item.start_time || "09:00 AM";
              if (item.start_time && item.start_time.includes(":")) {
                const parts = item.start_time.split(":");
                const hours = parseInt(parts[0]);
                const minutes = parts[1];
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                formattedTime = `${displayHours}:${minutes} ${ampm}`;
              }

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[32px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50 group-hover:scale-110 transition-transform duration-200" />

                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-xs font-bold text-blue-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formattedTime}</span>
                      </p>
                      <h3 className="font-display text-lg font-black text-slate-950">
                        {item.notes ? item.notes.split(":")[0] : "Explore Sight"}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {item.notes ? item.notes.split(":").slice(1).join(":") : "Discover historical structures and photo spots."}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-bold text-slate-700 h-fit md:self-center">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      <span>{dest ? dest.name : "Location Stop"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right columns: Maps, Budget, & Hotels Widgets */}
        <div className="space-y-6 print:hidden">
          {/* Map Widget */}
          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 className="font-display text-base font-black text-slate-900 mb-3 flex items-center gap-1.5">
              <Milestone className="h-5 w-5 text-blue-500" />
              <span>Daily Path Route</span>
            </h3>
            <div className="h-[250px] overflow-hidden rounded-2xl border border-slate-50 shadow-inner">
              {activeMarkers.length > 0 ? (
                <MapComponent markers={activeMarkers} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 font-bold text-xs">
                  No stops to plot.
                </div>
              )}
            </div>
          </div>

          {/* Budget Widget */}
          {tripBudget && (
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Coins className="h-5 w-5 text-blue-500" />
                  <span>Expenses Tracker</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
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
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
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
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <input
                    type="number"
                    value={actualCostInput ?? tripBudget?.actual_cost.toString() ?? ""}
                    onChange={(e) => setActualCostInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-blue-500 bg-slate-50/20 text-slate-800"
                    placeholder="Enter expenses"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateExpenses}
                    disabled={budgetMutation.isPending}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {budgetMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 text-center">
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
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-1.5">
              <Hotel className="h-5 w-5 text-blue-500" />
              <span>Lodging & Hotels</span>
            </h3>
            <div className="space-y-3">
              {hotelRecommendations.map((hotel, idx) => (
                <div key={idx} className="flex gap-3 rounded-2xl border border-slate-50 bg-slate-50/20 p-2.5 hover:bg-white hover:shadow-md transition duration-200">
                  <div className="relative h-14 w-20 overflow-hidden rounded-xl shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hotel.image} alt={hotel.name} className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{hotel.name}</p>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-[10px] font-bold text-slate-500">{hotel.rating}</span>
                      <span className="text-[10px] font-black text-slate-700">{hotel.price}</span>
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
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Invite travel companions or share your optimized schedule with friends using this URL:
          </p>
          <div className="flex gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2 items-center">
            <span className="text-xs font-bold text-slate-400 pl-2 truncate flex-1">
              {typeof window !== "undefined" ? window.location.href : ""}
            </span>
            <button
              onClick={handleCopyLink}
              className="rounded-xl bg-white hover:bg-slate-100 border border-slate-200 h-9 w-9 flex items-center justify-center text-slate-500 cursor-pointer shadow-sm transition"
            >
              {copied ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Copy className="h-4.5 w-4.5" />}
            </button>
          </div>
          <div className="flex justify-end border-t border-slate-50 pt-4">
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
