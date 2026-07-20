import Image from "next/image";

import Button from "@/components/ui/Button";
import { Destination } from "@/types/destination";
import { formatRating } from "@/utils/formatRating";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({
  destination,
}: DestinationCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw,
                 (max-width:1200px) 50vw,
                 33vw"
        />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-xl font-bold">
            {destination.name}
          </h3>

          <p className="text-sm text-slate-500">
            📍 {destination.state}
          </p>
        </div>

        <div className="space-y-1 text-sm text-slate-600">
          <p>⭐ {formatRating(destination.rating)}</p>
          <p>💰 {destination.budget}</p>
          <p>🌤 {destination.bestSeason}</p>
        </div>

        <Button className="mt-4 w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}