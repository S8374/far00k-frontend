"use client";

import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/modules/dashboard/property/PropertyCard";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetSavedPropertiesByUserQuery } from "@/redux/api/propertyApi";
import { HeartOff, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";

function Save() {
    const { data: meData } = useGetMeQuery({});
    const currentUser = meData?.data?.data || meData?.data || meData;
    const userId = currentUser?.id || currentUser?._id || currentUser?.uid || currentUser?.userId;

    const {
        data: savedPropertiesData = [],
        isLoading,
        isFetching,
    } = useGetSavedPropertiesByUserQuery(userId, {
        skip: !userId,
    });

    if (isLoading || isFetching) {
        return (
            <div className="flex items-center justify-center py-10 text-gray-300">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading saved properties...
            </div>
        );
    }

    if (savedPropertiesData.length === 0) {
        return (
            <div className="min-h-[70vh] p-6">
                <div className="relative mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center overflow-hidden rounded-3xl border border-emerald-900/40 bg-[#1f1e1e] px-6 py-14">
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
                            Start exploring and save the properties you like. Your shortlisted
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
        );
    }

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {savedPropertiesData.map((property: any, index: number) => (
                <div key={property?.id || property?._id || index}>
                    <PropertyCard property={property} />
                </div>
            ))}
        </div>
    );
}

export default Save;