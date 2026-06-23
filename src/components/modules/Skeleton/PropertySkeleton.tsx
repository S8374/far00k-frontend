import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function PropertySkeleton() {
  return (
    <div className="max-w-full mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-stone-900/70 border-stone-800 backdrop-blur-sm"
          >
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property List */}
      <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm">
        <CardContent className="p-6">

          {/* List Header */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Property Items */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-4 p-4 border border-gray-700 rounded-lg"
              >
                {/* Image */}
                <Skeleton className="h-32 w-full md:w-40 rounded-md" />

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />

                  <div className="flex gap-3 pt-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}