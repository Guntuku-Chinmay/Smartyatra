"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Compass, Calendar, Wallet, MapPin, Award, ArrowRight } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { getTrips, getAIRecommendations } from "@/services/planner.service";
import Button from "@/components/ui/Button";

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
        start_latitude: 19.076, // default Mumbai coords
        start_longitude: 72.8777,
        travel_mode: "car",
      }),
    enabled: isAuthenticated && !!user?.preferences,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalTripsCount = trips.length;
  const totalBudgetAllocated = trips.reduce((sum, t) => sum + t.total_budget, 0);
  const activeTripsCount = trips.filter((t) => t.status === "ONGOING").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 text-slate-800">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="text-blue-600">{user.name}</span>!
          </h1>
          <p className="mt-2 text-slate-600 font-medium">
            Explore your travel plans, metrics, and personalized recommendations.
          </p>
        </div>
        <Link href="/planner">
          <Button className="bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20">
            Plan a New Journey
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-4 mb-12">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Trips Planned</p>
            <p className="text-2xl font-bold">{totalTripsCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Budget</p>
            <p className="text-2xl font-bold">₹{totalBudgetAllocated.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Active Journeys</p>
            <p className="text-2xl font-bold">{activeTripsCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Travel Style</p>
            <p className="text-2xl font-bold">{user.preferences.travelStyle}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content: Trips list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight">Your Journeys</h2>
            {trips.length > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {trips.length} Total
              </span>
            )}
          </div>

          {isTripsLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading your trips...</p>
            </div>
          ) : isTripsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-red-700">
              <p className="font-semibold">Failed to fetch trips.</p>
              <p className="mt-1 text-sm text-red-600">Please make sure the backend server is running.</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No trips planned yet</h3>
              <p className="mt-2 text-slate-500 max-w-sm mx-auto text-sm">
                Plan your first journey using our AI assistant to get custom schedules and budget optimization.
              </p>
              <Link href="/planner" className="inline-block mt-6">
                <Button className="bg-blue-600 text-white font-bold hover:bg-blue-700">
                  Plan a Trip Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {trips.map((trip) => {
                const statusStyles = {
                  PLANNED: "bg-blue-50 text-blue-700 border-blue-100",
                  ONGOING: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  COMPLETED: "bg-slate-50 text-slate-600 border-slate-200",
                };
                return (
                  <div
                    key={trip.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            statusStyles[trip.status]
                          }`}
                        >
                          {trip.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          📅 {trip.start_date}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold hover:text-blue-600 transition">
                        <Link href={`/planner/itinerary/${trip.id}`}>{trip.name}</Link>
                      </h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          Budget
                        </p>
                        <p className="text-base font-bold text-slate-800">
                          ₹{trip.total_budget.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Link href={`/planner/itinerary/${trip.id}`} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
                        <span>View Plan</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight">AI Picks For You</h2>

          {isRecsLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="mt-3 text-slate-500 text-sm font-medium">Scoring destinations...</p>
            </div>
          ) : isRecsError ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm text-sm">
              Failed to load recommendations. Make sure backend is running.
            </div>
          ) : recommendations.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm text-sm">
              No recommendations found matching your profile.
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => {
                const matchPct = Math.round(rec.total_score * 100);
                return (
                  <div
                    key={rec.destination.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-800">
                          {rec.destination.name}
                        </h4>
                        <div className="flex gap-1.5 mt-1">
                          {rec.destination.categories.map((cat) => (
                            <span
                              key={cat}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">
                        {matchPct}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Estimated Cost: ₹{rec.destination.average_budget.toLocaleString("en-IN")}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-amber-600 font-bold">
                        ⭐ {rec.destination.popularity_score ? (rec.destination.popularity_score * 5.0).toFixed(1) : "4.5"}
                      </span>
                      <Link
                        href={`/explore`}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Explore More
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
