import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardHomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 to-stone-900">
      <div className="max-w-full mx-auto space-y-8 p-4 md:p-6">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-emerald-900/20 to-transparent p-6 rounded-2xl border border-emerald-900/30">

          <div className="space-y-3">
            <Skeleton className="h-8 w-72" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>
          </div>

          <div className="flex gap-4 bg-black/30 p-4 rounded-xl">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>

            <div className="w-px h-10 bg-gray-700" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-stone-900/80 border-stone-800">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Property Performance Section */}
        <Card className="bg-stone-900/80 border-stone-800 overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">

            {/* Property Cards Skeleton */}
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="bg-stone-800/50 border-stone-700 overflow-hidden"
              >
                <CardContent className="p-0">

                  {/* Image */}
                  <Skeleton className="h-36 w-full" />

                  <div className="p-6 space-y-4">

                    {/* Title */}
                    <Skeleton className="h-6 w-64" />

                    {/* Location */}
                    <Skeleton className="h-4 w-40" />

                    {/* Feature grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-16 w-full rounded-md" />
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <Skeleton className="h-20 w-full rounded-lg" />
                      <Skeleton className="h-20 w-full rounded-lg" />
                      <Skeleton className="h-20 w-full rounded-lg" />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded-md" />
                      <Skeleton className="h-8 w-24 rounded-md" />
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between pt-4">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
