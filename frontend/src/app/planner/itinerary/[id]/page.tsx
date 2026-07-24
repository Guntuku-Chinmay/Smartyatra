"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Printer, Edit2, Save } from "lucide-react";
import { getTrip, getItineraries, ItineraryEntry, Trip } from "@/services/planner.service";
import { getBudgets, updateBudget, Budget } from "@/services/budget.service";
import { getDestinations } from "@/services/destination.service";
import Button from "@/components/ui/Button";

// Dynamically import Leaflet Map to avoid Next.js SSR window errors
const MapComponent = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] w-full items-center justify-center bg-slate-100 rounded-xl border border-slate-200">
      <div className="text-slate-400 font-semibold animate-pulse">Loading route map...</div>
    </div>
  ),
});

export default function ItineraryPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const idStr = params.id;
  const tripId = typeof idStr === "string" ? parseInt(idStr) : Array.isArray(idStr) ? parseInt(idStr[0]) : NaN;

  const [activeDay, setActiveDay] = useState<number>(1);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [actualCostInput, setActualCostInput] = useState<string | null>(null);

  // Fetch Trip Details
  const { data: trip, isLoading: isTripLoading, isError: isTripError } = useQuery<Trip>({
    queryKey: ["trip", tripId],
    queryFn: () => getTrip(tripId),
    enabled: !isNaN(tripId),
  });

  // Fetch All Itinerary Entries
  const { data: allItineraries = [], isLoading: isItinLoading } = useQuery<ItineraryEntry[]>({
    queryKey: ["itineraries"],
    queryFn: getItineraries,
  });

  // Fetch All Budgets
  const { data: allBudgets = [], isLoading: isBudgetLoading } = useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  // Fetch All Destinations for details lookup
  const { data: destinations = [] } = useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  // Filter trip-specific records
  const tripItineraries = allItineraries
    .filter((itin) => itin.trip_id === tripId)
    .sort((a, b) => {
      if (a.day_number !== b.day_number) return a.day_number - b.day_number;
      return (a.start_time || "").localeCompare(b.start_time || "");
    });

  const tripBudget = allBudgets.find((b) => b.trip_id === tripId);

  // Sync edit input when budget data loads is handled directly via defaultValue/fallback
  // to avoid setState in effect warning.

  // Update budget mutation
  const budgetMutation = useMutation({
    mutationFn: (actualCost: number) => {
      if (!tripBudget) throw new Error("No budget record found");
      const estimated = tripBudget.estimated_cost;
      return updateBudget(tripBudget.id, {
        actual_cost: actualCost,
        remaining_budget: estimated - actualCost,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setIsEditingBudget(false);
      setActualCostInput(null);
    },
  });

  if (isTripLoading || isItinLoading || isBudgetLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse">
        <div className="h-6 w-24 rounded bg-slate-200 mb-6"></div>
        <div className="h-10 w-1/3 rounded bg-slate-200 mb-8"></div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 w-full rounded bg-slate-200"></div>
            <div className="h-64 w-full rounded bg-slate-200"></div>
          </div>
          <div className="h-96 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  if (isTripError || !trip || isNaN(tripId)) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600">Error loading plan</h1>
        <p className="mt-4 text-slate-600 font-medium">The travel plan could not be found.</p>
        <Link href="/dashboard" className="inline-block mt-6">
          <Button>Back to Dashboard</Button>
        </Link>
      </main>
    );
  }

  // Get total unique days
  const days = Array.from(new Set(tripItineraries.map((i) => i.day_number))).sort((a, b) => a - b);
  const activeItinerary = tripItineraries.filter((i) => i.day_number === activeDay);



  // Calculate actual coordinates if the destination list has coordinates (since getDestinations resolves them)
  // Let's resolve coordinates dynamically using destinations list
  const activeMarkers = activeItinerary.map((item) => {
    // If we look at the raw destination in destinations array
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

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-slate-800 print:py-0 print:px-0">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          <Printer className="h-4 w-4" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
            {trip.status}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{trip.name}</h1>
          <p className="mt-1.5 text-slate-500 text-sm font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              {trip.start_date} to {trip.end_date}
            </span>
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day selection tabs */}
          {days.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 print:hidden">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeDay === day
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-slate-200 bg-white text-center rounded-xl font-semibold text-slate-400">
              No itinerary stops generated yet.
            </div>
          )}

          {/* Grouped Day Title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold tracking-tight">Day {activeDay} Schedule</h2>
            <span className="text-slate-400 text-xs font-bold print:hidden">
              {activeItinerary.length} Activities Planned
            </span>
          </div>

          {/* Timeline list */}
          <div className="relative border-l border-slate-200 pl-6 space-y-8">
            {activeItinerary.map((item) => {
              const dest = destinations.find((d) => d.id === item.destination_id);
              // Format time to 12 hour AM/PM
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
                  <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50 group-hover:scale-110 transition"></div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formattedTime}</span>
                      </p>
                      <h3 className="text-lg font-bold text-slate-800">
                        {item.notes ? item.notes.split(":")[0] : "Explore Activity"}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {item.notes ? item.notes.split(":").slice(1).join(":") : "Discover nearby sights and enjoy."}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 md:self-center h-fit">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      <span>{dest ? dest.name : "Location stop"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Map & Budget widgets */}
        <div className="space-y-6 print:hidden">
          {/* Map Widget */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-3">Daily Travel Route</h3>
            <div className="h-[250px]">
              {activeMarkers.length > 0 ? (
                <MapComponent markers={activeMarkers} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-xl text-slate-400 font-bold text-xs">
                  No stops to display on map.
                </div>
              )}
            </div>
          </div>

          {/* Budget Widget */}
          {tripBudget && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Budget Tracker</h3>
                <button
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                  className="text-slate-400 hover:text-blue-600 transition"
                >
                  {isEditingBudget ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>EXPENSES: ₹{tripBudget.actual_cost.toLocaleString("en-IN")}</span>
                  <span>LIMIT: ₹{tripBudget.estimated_cost.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      tripBudget.actual_cost > tripBudget.estimated_cost
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (tripBudget.actual_cost / tripBudget.estimated_cost) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Editing Form */}
              {isEditingBudget ? (
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="number"
                    value={actualCostInput ?? tripBudget?.actual_cost.toString() ?? ""}
                    onChange={(e) => setActualCostInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                    placeholder="Enter expenses"
                  />
                  <Button
                    onClick={handleUpdateExpenses}
                    disabled={budgetMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 text-sm flex items-center gap-1.5"
                  >
                    <span>Update</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Remaining
                    </p>
                    <p
                      className={`text-base font-extrabold ${
                        tripBudget.remaining_budget >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      ₹{tripBudget.remaining_budget.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Status
                    </p>
                    <p
                      className={`text-sm font-extrabold uppercase ${
                        tripBudget.remaining_budget >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {tripBudget.remaining_budget >= 0 ? "On Track" : "Over Budget"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
