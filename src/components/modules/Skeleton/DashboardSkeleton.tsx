import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto space-y-10">
        {/* Welcome Section Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-96 bg-gray-800" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-32 bg-gray-800" />
              <Skeleton className="h-8 w-28 bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-stone-900/70 border-stone-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                  <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
                </div>
                <Skeleton className="h-8 w-16 mt-2 bg-gray-800" />
                <Skeleton className="h-4 w-32 mt-2 bg-gray-800" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Property Performance Section Skeleton */}
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-gray-800" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 bg-stone-950/50 border border-stone-800 rounded-xl p-4">
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}