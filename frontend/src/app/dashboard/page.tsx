"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Compass, Calendar, Wallet, MapPin, Award, ArrowRight, Loader2, Plus, Sparkles } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { getTrips, getAIRecommendations } from "@/services/planner.service";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch user's trips from backend
  const {
    data: trips = [],
    isLoading: isTripsLoading,
    isError: isTripsError,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
    enabled: isAuthenticated && !!token,
  });

  // Fetch AI Recommendations based on user preferences
  const {
    data: recommendations = [],
    isLoading: isRecsLoading,
    isError: isRecsError,
  } = useQuery({
    queryKey: ["ai-recommendations", user?.preferences],
    queryFn: () =>
      getAIRecommendations({
        budget: user?.preferences.budget || 20000,
        trip_days: 4,
        interests: user?.preferences.interests || ["Nature"],
        start_latitude: 17.6868, // default Visakhapatnam coords
        start_longitude: 83.2185,
        travel_mode: "DRIVING",
      }),
    enabled: isAuthenticated && !!user?.preferences,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalTripsCount = trips.length;
  const totalBudgetAllocated = trips.reduce((sum, t) => sum + t.total_budget, 0);
  const activeTripsCount = trips.filter((t) => t.status === "ONGOING").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header Greeting */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-900">
            Welcome Back, <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Explore your travel metrics, planned itineraries, and AI matches.
          </p>
        </div>
        <Link href="/planner">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer">
            <Plus className="h-5 w-5" />
            <span>Plan New Trip</span>
          </button>
        </Link>
      </div>

      {/* Metrics Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
      >
        <motion.div variants={itemVariants} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-blue-600">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trips Planned</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalTripsCount}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Budget</p>
            <p className="text-2xl font-black text-slate-800 mt-1">₹{totalBudgetAllocated.toLocaleString("en-IN")}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trips</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{activeTripsCount}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Style</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{user.preferences.travelStyle}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content: Trips List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-slate-900">Your Journeys</h2>
            {trips.length > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {trips.length} Total
              </span>
            )}
          </div>

          {isTripsLoading ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-16 text-center shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Loading your plans...</p>
            </div>
          ) : isTripsError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center text-red-700">
              <p className="font-bold text-sm">Failed to retrieve trip records.</p>
              <p className="mt-1 text-xs font-semibold text-red-600">Please verify backend service connections.</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
              <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-slate-800">No journeys created yet</h3>
              <p className="mt-2 text-slate-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                Plan your first adventure using our smart wizard to generate custom schedules, routes, and hotel expenses.
              </p>
              <Link href="/planner" className="inline-block mt-6">
                <button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 transition-colors cursor-pointer">
                  Plan a Trip Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {trips.map((trip) => {
                const statusStyles = {
                  PLANNED: "bg-blue-50 text-blue-700 border-blue-100",
                  ONGOING: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  COMPLETED: "bg-slate-50 text-slate-500 border-slate-200",
                };
                return (
                  <div
                    key={trip.id}
                    className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${statusStyles[trip.status]}`}>
                          {trip.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          📅 {trip.start_date}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        <Link href={`/planner/itinerary/${trip.id}`}>{trip.name}</Link>
                      </h3>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget</p>
                        <p className="text-base font-bold text-slate-800 mt-0.5">₹{trip.total_budget.toLocaleString("en-IN")}</p>
                      </div>
                      <Link href={`/planner/itinerary/${trip.id}`} className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700">
                        <span>View Plan</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: AI Picks */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
            <h2 className="font-display text-2xl font-black text-slate-900">AI Matches For You</h2>
          </div>

          {isRecsLoading ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
              <p className="mt-3 text-slate-400 text-xs font-semibold">Scoring destinations...</p>
            </div>
          ) : isRecsError ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-400 shadow-sm text-xs font-semibold">
              Failed to load recommendations. Please verify backend service connections.
            </div>
          ) : recommendations.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-400 shadow-sm text-xs font-semibold">
              No recommendations found matching your preferences.
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => {
                const matchPct = Math.round(rec.total_score * 100);
                return (
                  <div
                    key={rec.destination.id}
                    className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {rec.destination.name}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {rec.destination.categories.map((cat) => (
                            <span key={cat} className="rounded-full bg-blue-50/50 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {matchPct}% Match
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-400 mt-2">
                      Est. Cost: <span className="text-slate-700">₹{rec.destination.average_budget.toLocaleString("en-IN")}</span>
                    </p>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-500">
                        ⭐ {(rec.destination.popularity_score ? rec.destination.popularity_score * 5.0 : 4.5).toFixed(1)}
                      </span>
                      <Link href={`/explore/${rec.destination.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        Explore Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
