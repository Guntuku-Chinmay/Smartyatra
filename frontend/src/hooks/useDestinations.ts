import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "@/services/destination.service";

export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });
}