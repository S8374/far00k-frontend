import { Skeleton } from "@/components/ui/skeleton";
import { PropertySkeleton } from "./PropertySkeleton";

export default function DashboardLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-8 mt-12">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#1e1e1e] border-r border-zinc-800 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="fixed top-0 right-0 left-64 h-16 bg-[#1e1e1e] border-b border-zinc-800 flex items-center justify-end px-6">
          <Skeleton className="h-10 w-10 rounded-full" />
        </header>

        <PropertySkeleton/>
      </div>
    </div>
  );
}
