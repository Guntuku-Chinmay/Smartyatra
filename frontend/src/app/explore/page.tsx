"use client";

import { useMemo, useState } from "react";
import { Compass, AlertTriangle } from "lucide-react";
import { SearchBar, FilterBar, DestinationGrid, LoadingGrid } from "@/components/explore";
import { useDestinations } from "@/hooks/useDestinations";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const {
    data: destinations = [],
    isLoading,
    isError,
  } = useDestinations();

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
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-display text-4xl font-black text-slate-900 mb-8">
          Explore Destinations
        </h1>
        <LoadingGrid />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-center">
        <div className="max-w-md mx-auto py-12 border border-red-100 rounded-2xl bg-red-50/50">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h2 className="font-display text-lg font-bold text-red-700">Failed to load destinations</h2>
          <p className="mt-1 text-slate-500 text-xs font-semibold">Please check if the backend API service is active.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-display text-4xl font-black text-slate-900">
          Explore Destinations
        </h1>
        <p className="text-slate-500 text-sm font-semibold">
          Discover incredible tourist attractions across Andhra Pradesh.
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar selected={category} onSelect={setCategory} />
        </div>

        <DestinationGrid destinations={filteredDestinations} />
      </div>
    </main>
  );
}