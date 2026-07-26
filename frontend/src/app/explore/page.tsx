"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Sparkles } from "lucide-react";
import { SearchBar, FilterBar, DestinationGrid, LoadingGrid } from "@/components/explore";
import { useDestinations } from "@/hooks/useDestinations";
import { useToast } from "@/store/toast.store";

function ExploreContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const { showToast } = useToast();

  const {
    data: destinations = [],
    isLoading,
    isError,
    refetch,
  } = useDestinations();

  // Send toast notification on error
  useEffect(() => {
    if (isError) {
      showToast("Could not connect to destinations server.", "error");
    }
  }, [isError, showToast]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesSearch = destination.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        destination.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [destinations, search, category]);

  if (isLoading) {
    return <LoadingGrid />;
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 border border-rose-100 dark:border-rose-950/20 rounded-3xl bg-rose-50/50 dark:bg-rose-950/10 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="font-display text-lg font-black text-rose-700 dark:text-rose-400">Failed to load destinations</h2>
        <p className="text-slate-500 dark:text-slate-450 text-xs font-bold leading-relaxed">
          Please check if the backend API service is active or retry the connection below.
        </p>
        <button
          onClick={() => {
            showToast("Retrying connection...", "info");
            refetch();
          }}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 text-xs transition cursor-pointer shadow-md shadow-blue-500/10"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar selected={category} onSelect={setCategory} />
      </div>

      {filteredDestinations.length === 0 ? (
        <div className="py-20 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-center rounded-3xl p-8 space-y-4">
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">
            No destinations found matching your current filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <DestinationGrid destinations={filteredDestinations} />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 min-h-[80vh]">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="font-display text-4xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-500" />
          <span>Explore Destinations</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold">
          Discover incredible tourist attractions across Andhra Pradesh.
        </p>
      </div>

      <Suspense fallback={<LoadingGrid />}>
        <ExploreContent />
      </Suspense>
    </main>
  );
}