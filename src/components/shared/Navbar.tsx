"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { MapPin, DollarSign, TrendingUp, Search } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import { useGetMeQuery } from "@/redux/api/authApi";

export interface HomeSearchFilters {
  location: string;
  search: string;
  minPrice: string;
  maxPrice: string;
  listingPurpose: "" | "SELL" | "RENT";
  timeFilter: "" | "today" | "this_week" | "this_month" | "this_year";
}

interface NavbarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
  isCategoriesLoading?: boolean;        // New prop
  filters: HomeSearchFilters;
  onFiltersChange: (filters: Partial<HomeSearchFilters>) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

export interface CategoryItem {
  label: string;
  value: string;
  count?: number;
  icon?: string;
}

/* ====================== SKELETON COMPONENTS ====================== */

// User Loading Skeleton
const NavbarUserLoadingSkeleton = () => (
  <div className="flex items-center gap-4 mx-2">
    <Skeleton className="h-10 w-20 rounded-md bg-stone-900" />
    <Skeleton className="h-10 w-20 rounded-md bg-stone-900" />
  </div>
);

// Category Pills Loading Skeleton
const CategoryPillsSkeleton = () => (
  <div className="flex justify-center items-center gap-3 flex-wrap w-full">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-10 rounded-3xl border border-zinc-600/60 bg-zinc-700/60",
          "w-[calc(50%-0.5rem)] sm:w-24 md:w-28"
        )}
      />
    ))}
  </div>
);

const Navbar = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  isCategoriesLoading = false,
  filters,
  onFiltersChange,
  onSearchSubmit,
  onClearFilters,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: userData, isLoading, isFetching, isError } = useGetMeQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const isUserLoading = isLoading || isFetching;
  const user = isError ? null : (userData?.data?.data || userData?.data);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLocationChange = (value: string) => onFiltersChange({ location: value });
  const handleSearchChange = (value: string) => onFiltersChange({ search: value });
  const handleMinPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    onFiltersChange({ minPrice: numericValue });
  };
  const handleMaxPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    onFiltersChange({ maxPrice: numericValue });
  };
  const handleListingPurposeChange = (value: "" | "SELL" | "RENT") =>
    onFiltersChange({ listingPurpose: value });
  const handleTimeFilterChange = (value: "" | "today" | "this_week" | "this_month" | "this_year") =>
    onFiltersChange({ timeFilter: value });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearchSubmit();
  };

  const renderSearchBar = (isMobile = false) => (
    <div
      className={cn(
        "bg-[#0b0d12]/95 backdrop-blur-xl border border-zinc-700/70 transition-all",
        isMobile
          ? "w-full rounded-3xl grid grid-cols-2 gap-2.5 p-3 border-zinc-600/70 shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
          : "w-full max-w-280 rounded-[20px] h-14 flex items-center px-2",
        !isMobile && "shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
      )}
    >
      {/* Location */}
      <div className={cn(
        "flex items-center gap-2 min-w-0",
        isMobile
          ? "w-full h-11 rounded-xl border border-zinc-700/70 bg-zinc-900/70 px-3"
          : "flex-1 h-10 border-r border-zinc-700/70 px-3"
      )}>
        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.2} />
        <Input
          type="text"
          placeholder="City, District, or Mega Project"
          value={filters.location}
          onChange={(e) => handleLocationChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-9 border-0 bg-transparent text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:outline-none w-full",
            isMobile ? "text-sm" : "text-[15px]"
          )}
        />
      </div>

      {/* Search */}
      <div className={cn(
        "flex items-center gap-2 min-w-0",
        isMobile
          ? "w-full h-11 rounded-xl border border-zinc-700/70 bg-zinc-900/70 px-3"
          : "flex-1 h-10 border-r border-zinc-700/70 px-3"
      )}>
        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.2} />
        <Input
          type="text"
          placeholder="Search yout dream property"
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9 border-0 bg-transparent text-[15px] text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:outline-none w-full"
        />
      </div>

      {/* Price Range */}
      <div className={cn(
        "flex items-center gap-2",
        isMobile
          ? "w-full h-11 rounded-xl border border-zinc-700/70 bg-zinc-900/70 px-3 col-span-2"
          : "shrink-0 h-10 px-3 border-r border-zinc-700/70"
      )}>
        {!isMobile ? (
          <>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 border-0 bg-transparent text-[15px] text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:outline-none w-full sm:w-16"
            />
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 opacity-80" strokeWidth={2.2} />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 border-0 bg-transparent text-[15px] text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:outline-none w-full sm:w-16"
            />
          </>
        ) : (
          <div className="grid grid-cols-4 gap-2 w-full">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 border border-zinc-700/70 rounded-md bg-zinc-950/60 px-2 text-xs text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:outline-none"
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 border border-zinc-700/70 rounded-md bg-zinc-950/60 px-2 text-xs text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:outline-none"
            />
            <select
              value={filters.listingPurpose}
              onChange={(e) => handleListingPurposeChange(e.target.value as any)}
              className="h-8 bg-zinc-950/60 text-xs text-zinc-200 px-2 rounded-md border border-zinc-700/80 focus:outline-none cursor-pointer"
            >
              <option value="">Purpose</option>
              <option value="SELL">Sell</option>
              <option value="RENT">Rent</option>
            </select>
            <select
              value={filters.timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value as any)}
              className="h-8 bg-zinc-950/60 text-xs text-zinc-200 px-2 rounded-md border border-zinc-700/80 focus:outline-none cursor-pointer"
            >
              <option value="">Any time</option>
              <option value="today">Today</option>
              <option value="this_week">This week</option>
              <option value="this_month">This month</option>
              <option value="this_year">This year</option>
            </select>
          </div>
        )}
      </div>

      {/* Filters */}
      {!isMobile ? (
        <>
          <select
            value={filters.listingPurpose}
            onChange={(e) => handleListingPurposeChange(e.target.value as any)}
            className="bg-transparent h-10 text-[15px] text-zinc-100 px-3 border-r border-zinc-700/70 focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-zinc-900 text-white">Purpose</option>
            <option value="SELL" className="bg-zinc-900 text-white">Sell</option>
            <option value="RENT" className="bg-zinc-900 text-white">Rent</option>
          </select>

          <select
            value={filters.timeFilter}
            onChange={(e) => handleTimeFilterChange(e.target.value as any)}
            className="bg-transparent h-10 text-[15px] text-zinc-100 px-3 focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-zinc-900 text-white">Any time</option>
            <option value="today" className="bg-zinc-900 text-white">Today</option>
            <option value="this_week" className="bg-zinc-900 text-white">This week</option>
            <option value="this_month" className="bg-zinc-900 text-white">This month</option>
            <option value="this_year" className="bg-zinc-900 text-white">This year</option>
          </select>
        </>
      ) : (
        <></>
      )}

      {/* Search & Clear Buttons */}
      <Button
        type="button"
        onClick={onSearchSubmit}
        className={cn(
          "bg-linear-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 transition-all",
          isMobile
            ? "w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            : "w-11 h-11 rounded-full shrink-0 ml-2"
        )}
      >
        <Search className="w-4 h-4 text-white stroke-2" />
        {isMobile && (
          <>
            <span className="sm:hidden">Search</span>
            <span className="hidden sm:inline">Search Properties</span>
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={onClearFilters}
        variant="outline"
        className={cn(
          "border-zinc-600/80 bg-zinc-950 text-zinc-200 hover:bg-zinc-800 hover:text-white",
          isMobile
            ? "w-full h-10 rounded-xl border-dashed text-sm"
            : "h-10 px-2 rounded-xl ml-2"
        )}
      >
        Clear
      </Button>
    </div>
  );

  return (
    <>
      <nav
        className={cn(
          "relative z-50 bg-neutral-800 border-b border-zinc-500 flex flex-col items-center py-4 md:py-6 transition-all",
          { "backdrop-blur-md shadow-md": isScrolled }
        )}
      >
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-20 flex flex-col gap-4 items-center">
          <div className="flex w-full items-center justify-between gap-3 xl:grid xl:grid-cols-[180px_minmax(0,1fr)_auto] xl:items-center xl:gap-3">
            {/* Logo */}
            <div className="flex items-center xl:justify-start">
              <Link href="/" className="shrink-0">
                <Image
                  alt="sakk"
                  src="/sakk.png"
                  width={80}
                  height={80}
                  className="h-12 md:h-20 xl:h-24 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden xl:flex min-w-0 justify-center">
              {renderSearchBar()}
            </div>

            {/* Right Actions */}
            <div className="flex shrink-0 items-center justify-end">
              {isUserLoading ? (
                <NavbarUserLoadingSkeleton />
              ) : !user ? (
                <div className="flex items-center gap-2 sm:gap-4 mx-1 sm:mx-2">
                  <Link
                    href="/login"
                    className="text-red-400 border border-red-500 py-2 px-3 sm:px-4 rounded text-sm sm:text-base font-normal hover:text-red-300 transition whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="py-2 px-3 sm:px-4 text-center rounded bg-emerald-600 hover:bg-emerald-500 transition text-sm sm:text-base whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <UserProfileDropdown user={user} />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="xl:hidden w-full px-2">
            {renderSearchBar(true)}
          </div>
        </div>
        {/* Category Pills with Loading Skeleton */}
        <div className="w-full max-w-280 px-4 mt-4 md:px-0">
          {isCategoriesLoading ? (
            <CategoryPillsSkeleton />
          ) : (
            <CategoryPills
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          )}
        </div>
      </nav>
    </>
  );
};

/* ====================== CategoryPills Component ====================== */
export const CategoryPills = ({
  selectedCategory,
  setSelectedCategory,
  categories,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
}) => (
  <div className="flex justify-center items-center gap-3 flex-wrap">
    {categories.map((cat) => (
      <Button
        key={cat.value}
        variant="secondary"
        className={cn(
          "px-4 py-2 rounded-3xl text-sm md:text-base flex cursor-pointer items-center gap-2 whitespace-nowrap",
          "text-white border border-[#8F9093] bg-zinc-700 transition-all",
          selectedCategory === cat.value &&
            "bg-linear-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800"
        )}
        onClick={() => setSelectedCategory(cat.value)}
      >
        {cat.label}
        {/* {typeof cat.count === "number" && `(${cat.count})`} */}
      </Button>
    ))}
  </div>
);

export default Navbar;