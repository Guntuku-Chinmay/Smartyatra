import DestinationSkeleton from "./DestinationSkeleton";

export default function LoadingGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <DestinationSkeleton key={index} />
      ))}
    </div>
  );
}