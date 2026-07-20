"use client";

import { useMemo, useState } from "react";

import {
  SearchBar,
  FilterBar,
  DestinationGrid,
  LoadingGrid,
} from "@/components/explore";

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

  // ✅ Loading State
  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">
          Explore Destinations
        </h1>

        <LoadingGrid />
      </main>
    );
  }

  // ✅ Error State
  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">
          Explore Destinations
        </h1>

        <p className="text-red-600">
          Failed to load destinations.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold">
        Explore Destinations
      </h1>

      <div className="space-y-6">
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <FilterBar
          selected={category}
          onSelect={setCategory}
        />

        <DestinationGrid
          destinations={filteredDestinations}
        />
      </div>
    </main>
  );
}