import Skeleton from "@/components/ui/Skeleton";

export default function DestinationSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 space-y-4">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="space-y-3 px-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <hr className="border-slate-50 dark:border-slate-800" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}