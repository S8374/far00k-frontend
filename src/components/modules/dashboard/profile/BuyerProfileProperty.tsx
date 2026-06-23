"use client";

import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetSavedPropertiesByUserQuery } from "@/redux/api/propertyApi";
import { HeartOff, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import PropertyCard from "../property/PropertyCard";

export default function BuyerProfileProperty() {
  const { data: meData } = useGetMeQuery({});
  const userId = meData?.data?.data?.id || meData?.data?.data?._id;

  const {
    data: savedProperties = [],
    isLoading,
    isFetching,
  } = useGetSavedPropertiesByUserQuery(userId, {
    skip: !userId,
  });

  return (
    <div className="bg-[#2c2a2a] p-4 rounded-lg">
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-10 text-gray-300">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading saved properties...
        </div>
      ) : savedProperties.length === 0 ? (
        <div className="min-h-[60vh]">
          <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-3xl border border-emerald-900/40 bg-[#1f1e1e] px-6 py-14">
            <div className="pointer-events-none absolute -left-20 top-8 h-48 w-48 rounded-full bg-emerald-600/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                <HeartOff className="h-8 w-8 text-emerald-300" />
              </div>

              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                No Saved Properties Yet
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300 md:text-base">
                Start exploring and save properties you like. Your shortlisted
                homes and investments will appear here.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild className="bg-emerald-700 px-6 hover:bg-emerald-600">
                  <Link href="/">Browse Properties</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="border-gray-600 bg-transparent text-gray-200 hover:bg-[#2c2a2a]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property: any, index: number) => (
            <div key={property?.id || property?._id || index}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}