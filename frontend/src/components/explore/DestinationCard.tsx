import { Destination } from "@/types/destination";
import Button from "@/components/ui/Button";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({
  destination,
}: DestinationCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <img
        src={destination.image}
        alt={destination.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">{destination.name}</h3>

        <p className="mt-1 text-sm text-slate-500">
          📍 {destination.state}
        </p>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>⭐ Rating: {destination.rating}</p>
          <p>💰 Budget: {destination.budget}</p>
          <p>🌤 Best Season: {destination.bestSeason}</p>
        </div>

        <Button className="mt-6 w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}