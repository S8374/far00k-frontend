"use client";

import PropertyCard from "../dashboard/property/PropertyCard";
import Navbar from "@/components/shared/Navbar";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyMap from "../../main/PropertyMap";
import { CategoryItem } from "@/components/shared/NavCategory";
import { HomeSearchFilters } from "@/components/shared/Navbar";
import { Property } from "@/types/property";
import { Loader2 } from "lucide-react";

interface BannerProps {
  properties: Property[];
  isLoading: boolean;
  isCategoriesLoading?: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
  filters: HomeSearchFilters;
  onFiltersChange: (filters: Partial<HomeSearchFilters>) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

const Banner = ({
  properties,
  isLoading,
  isCategoriesLoading = false,
  selectedCategory,
  setSelectedCategory,
  categories,
  filters,
  onFiltersChange,
  onSearchSubmit,
  onClearFilters,
}: BannerProps) => {
  const hasProperties = properties.length > 0;
  const [isMobile, setIsMobile] = useState(false);
  const [sheetState, setSheetState] = useState<"closed" | "half" | "full">("closed");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= MOBILE VIEW =================
  if (isMobile) {
    return (
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black">

        {/* Navbar */}
        <div className="z-50 shrink-0 bg-white">
          <Navbar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onSearchSubmit={onSearchSubmit}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Map — fills remaining space */}
        <div id="property-map-section" className="relative flex-1 w-full">
          <PropertyMap properties={properties} isMapActive={true} />
          {sheetState === "closed" && hasProperties && !isLoading && (
            <button
              onClick={() => setSheetState("half")}
              className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black shadow-xl"
            >
              View Properties
            </button>
          )}

          {isLoading && (
            <div className="absolute bottom-6 left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2">
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-700 bg-neutral-900/95 p-4 shadow-2xl">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <p className="text-sm font-medium text-neutral-200">Loading properties...</p>
              </div>
            </div>
          )}

          {!isLoading && !hasProperties && (
            <div className="absolute bottom-6 left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2">
              <div className="rounded-2xl border border-neutral-700 bg-neutral-900/95 p-4 shadow-2xl">
                <h3 className="text-base font-semibold text-white">No properties found</h3>
                <p className="mt-1 text-sm text-neutral-300">
                  Try changing your category or search filters to see more listings.
                </p>
                <button
                  onClick={onClearFilters}
                  className="mt-3 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sheet — fixed to viewport, can grow over the map */}
        <AnimatePresence>
          {sheetState !== "closed" && hasProperties && !isLoading && (
            <motion.div
              key="bottom-sheet"
              initial={{ y: "100%" }}
              animate={{ y: sheetState === "half" ? "52%" : "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.04, bottom: 0.25 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 140) setSheetState("closed");
                else if (info.offset.y < -80) setSheetState("full");
                else setSheetState("half");
              }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-neutral-900 shadow-2xl"
              style={{ height: "90dvh" }}
            >
              {/* Sticky header */}
              <div className="shrink-0 cursor-grab active:cursor-grabbing rounded-t-3xl bg-neutral-900 px-4 pt-3 pb-3 border-b border-neutral-800">
                <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-neutral-600" />
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">
                    Properties in this area
                    <span className="ml-2 text-sm font-normal text-neutral-400">
                      ({properties.length})
                    </span>
                  </h2>
                  <button
                    onClick={() => setSheetState("closed")}
                    className="text-xs text-neutral-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-neutral-800"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Scrollable cards */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {properties?.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showLocationButton
                    onViewLocation={() => setSheetState("closed")}
                  />
                ))}
                <div className="h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ================= DESKTOP VIEW =================
  return (
    <div className="relative w-full">

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white">
        <Navbar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onSearchSubmit={onSearchSubmit}
          onClearFilters={onClearFilters}
        />
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-5"
        style={{ height: "calc(100vh - var(--navbar-height, 72px))" }}
      >
        {/* Property List */}
        <div className="col-span-1 w-full px-4 border-r overflow-y-auto h-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between py-4 gap-3">
            <h1 className="text-2xl font-semibold">Listings in this area</h1>
            {/* {isLoading && (
              <div className="flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/70 px-3 py-1.5">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span className="text-xs text-stone-200">Loading</span>
              </div>
            )} */}
          </div>

          {isLoading ? (
            <div className="h-[85vh] w-full flex items-center justify-center">
              <div className="flex items-center gap-3 rounded-xl border border-stone-700 bg-stone-900/70 px-5 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <p className="text-sm text-gray-200">Loading properties...</p>
              </div>
            </div>
          ) : hasProperties ? (
            <div className="flex flex-col gap-4 pb-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showLocationButton
                />
              ))}
            </div>
          ) : (
            <div className="h-[85vh] w-full flex items-center justify-center">
              <div className="w-full max-w-sm rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white">No properties found</h3>
                <p className="text-sm text-gray-400 mt-2">
                  We could not find any listings for the current selection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div id="property-map-section" className="col-span-4 relative w-full h-full">
          <PropertyMap properties={properties} isMapActive={true} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
// changed