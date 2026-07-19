"use client";

import { useMemo, useState } from "react";

import {
  SearchBar,
  FilterBar,
  DestinationGrid,
} from "@/components/explore";

import { Destination } from "@/types/destination";

const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Goa",
    state: "Goa",
    image: "https://picsum.photos/400/300?random=1",
    rating: 4.8,
    budget: "₹15,000",
    category: "Beach",
    bestSeason: "Nov - Feb",
  },
  {
    id: 2,
    name: "Manali",
    state: "Himachal Pradesh",
    image: "https://picsum.photos/400/300?random=2",
    rating: 4.7,
    budget: "₹18,000",
    category: "Mountain",
    bestSeason: "Oct - Mar",
  },
  {
    id: 3,
    name: "Hampi",
    state: "Karnataka",
    image: "https://picsum.photos/400/300?random=3",
    rating: 4.6,
    budget: "₹10,000",
    category: "Heritage",
    bestSeason: "Nov - Feb",
  },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredDestinations = useMemo(() => {
    return mockDestinations.filter((destination) => {
      const matchesSearch =
        destination.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        destination.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

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