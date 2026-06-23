import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="px-2 sm:px-4">
      {/* Title */}
      <div className="mb-6">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-6 gap-6">
        
        {/* Sidebar Skeleton */}
        <div className="bg-[#2c2a2a] p-4 rounded-xl w-full lg:w-56 space-y-3">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Profile Header */}
          <div className="bg-[#2c2a2a] p-6 rounded-lg">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                
                {/* Avatar */}
                <Skeleton className="h-16 w-16 rounded-full" />

                {/* Name & badges */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Edit button */}
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>

            {/* License & experience */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="space-y-2 text-right">
                <Skeleton className="h-3 w-32 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="bg-[#2c2a2a] p-4 rounded-lg">
            <Skeleton className="h-5 w-48 mb-4" />

            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-[#2c2a2a] p-4 rounded-lg space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>

        </div>
      </div>
    </div>
  );
}