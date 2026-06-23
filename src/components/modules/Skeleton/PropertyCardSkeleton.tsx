import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-stone-950/50 border border-stone-800 rounded-xl p-4">
      <Skeleton className="w-full sm:w-48 h-36 sm:h-32 rounded-lg bg-gray-800" />
      <div className="flex-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64 bg-gray-800" />
            <Skeleton className="h-5 w-32 bg-gray-800" />
          </div>
          <Skeleton className="h-6 w-20 bg-gray-800" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-4 w-20 bg-gray-800" />
          <Skeleton className="h-4 w-24 bg-gray-800" />
          <Skeleton className="h-4 w-16 bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
