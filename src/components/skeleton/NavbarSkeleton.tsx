"use client";

import { Skeleton } from "../ui/skeleton";

const NavbarSkeleton = () => {
  return (
    <nav className="relative z-50 bg-neutral-800 border-b border-zinc-500 flex flex-col items-center py-4 md:py-6">
      <div className="w-full max-w-full px-4 md:px-20 flex flex-col gap-4 items-center">
        {/* Top Row: Logo + Search + Actions */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Skeleton className="h-14 md:h-24 w-24 rounded-md" />

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <Skeleton className="h-12 w-full max-w-4xl rounded-full" />
          </div>

          {/* Actions (Sign in / Sign up buttons) */}
          <div className="lg:flex items-center gap-4">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex justify-center items-center gap-3 flex-wrap px-2 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-3xl" />
          ))}
        </div>

        {/* Mobile Search */}
        <div className="md:hidden w-full px-2">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </nav>
  );
};

export default NavbarSkeleton;