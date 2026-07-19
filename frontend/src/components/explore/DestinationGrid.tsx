import DestinationCard from "./DestinationCard";
import { Destination } from "@/types/destination";

interface DestinationGridProps {
  destinations: Destination[];
}

export default function DestinationGrid({
  destinations,
}: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500">
        No destinations found.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </div>
  );
}