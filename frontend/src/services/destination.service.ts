import { mockDestinations } from "@/data/destinations";
import { Destination } from "@/types/destination";

export async function getDestinations(): Promise<Destination[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockDestinations;
}