import api from "./api";

export interface Trip {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  city_id: number;
  status: "PLANNED" | "ONGOING" | "COMPLETED";
}

export interface TripCreateInput {
  name: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  city_id: number;
  status?: "PLANNED" | "ONGOING" | "COMPLETED";
}

export interface ItineraryEntry {
  id: number;
  trip_id: number;
  destination_id: number;
  day_number: number;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
}

export interface ItineraryCreateInput {
  trip_id: number;
  destination_id: number;
  day_number: number;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

export interface AIRecommendationResult {
  destination: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    average_budget: number;
    recommended_days: number;
    categories: string[];
    popularity_score: number;
  };
  total_score: number;
  breakdown: {
    budget: number;
    interest: number;
    distance: number;
    popularity: number;
    duration: number;
  };
}

// Trips
export async function getTrips(): Promise<Trip[]> {
  const response = await api.get("/trips/");
  return response.data;
}

export async function getTrip(id: number): Promise<Trip> {
  const response = await api.get(`/trips/${id}`);
  return response.data;
}

export async function createTrip(data: TripCreateInput): Promise<Trip> {
  const response = await api.post("/trips/", data);
  return response.data;
}

export async function deleteTrip(id: number): Promise<void> {
  await api.delete(`/trips/${id}`);
}

// Itineraries
export async function getItineraries(): Promise<ItineraryEntry[]> {
  const response = await api.get("/itineraries/");
  return response.data;
}

export async function createItinerary(data: ItineraryCreateInput): Promise<ItineraryEntry> {
  const response = await api.post("/itineraries/", data);
  return response.data;
}

// AI Recommendations
export async function getAIRecommendations(preferences: {
  budget: number;
  trip_days: number;
  interests: string[];
  start_latitude?: number;
  start_longitude?: number;
  travel_mode?: string;
}): Promise<AIRecommendationResult[]> {
  const response = await api.post("/destinations/recommend", preferences);
  return response.data;
}