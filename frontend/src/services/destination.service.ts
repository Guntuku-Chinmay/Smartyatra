import api from "./api";
import { Destination } from "@/types/destination";

export interface BackendDestination {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  image_url: string | null;
  city_id: number;
  category_id: number;
}

const resolveState = (cityId: number): string => {
  const states: Record<number, string> = {
    1: "Goa",
    2: "Himachal Pradesh",
    3: "Karnataka",
    4: "Kerala",
    5: "Rajasthan",
    6: "Andaman & Nicobar",
  };
  return states[cityId] || "India";
};

const resolveCategory = (categoryId: number): string => {
  const categories: Record<number, string> = {
    1: "Beach",
    2: "Mountain",
    3: "Heritage",
  };
  return categories[categoryId] || "Scenic";
};

const resolveBestSeason = (name: string): string => {
  const seasons: Record<string, string> = {
    goa: "Nov - Feb",
    manali: "Oct - Mar",
    hampi: "Nov - Feb",
    munnar: "Sep - Mar",
    jaipur: "Oct - Feb",
    andaman: "Nov - Apr",
  };
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(seasons)) {
    if (key.includes(k)) return v;
  }
  return "Oct - Mar";
};

const resolveBudget = (name: string, cost: number): string => {
  if (cost > 0) return `₹${cost.toLocaleString("en-IN")}`;
  const budgets: Record<string, string> = {
    goa: "₹15,000",
    manali: "₹18,000",
    hampi: "₹10,000",
    munnar: "₹14,000",
    jaipur: "₹16,000",
    andaman: "₹28,000",
  };
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(budgets)) {
    if (key.includes(k)) return v;
  }
  return "₹15,000";
};

const mapDestination = (d: BackendDestination): Destination => ({
  id: d.id,
  name: d.name,
  state: resolveState(d.city_id),
  image: d.image_url || `https://picsum.photos/600/400?random=${d.id}`,
  rating: d.rating || 4.5,
  budget: resolveBudget(d.name, 0),
  category: resolveCategory(d.category_id),
  bestSeason: resolveBestSeason(d.name),
});

export async function getDestinations(): Promise<Destination[]> {
  const response = await api.get<BackendDestination[]>("/destinations/");
  return response.data.map(mapDestination);
}

export async function getDestination(id: number): Promise<Destination & { description: string; latitude: number; longitude: number }> {
  const response = await api.get<BackendDestination>(`/destinations/${id}`);
  const base = mapDestination(response.data);
  return {
    ...base,
    description: response.data.description || "",
    latitude: response.data.latitude,
    longitude: response.data.longitude,
  };
}