/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ShieldCheck, Trophy, Heart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import GrowthChart from "@/components/shared/GrowthChart";
import { PropertyCardProps } from "@/types/property";
import { useCheckPropertySavedQuery, useSavePropertyMutation, useTrackPropertyViewMutation, useUnsavePropertyMutation } from "@/redux/api/propertyApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PropertyCard({
  property,
  showLocationButton = false,
  onViewLocation,
}: PropertyCardProps) {
  const hasCoordinates =
    typeof property.latitude === "number" &&
    !Number.isNaN(property.latitude) &&
    typeof property.longitude === "number" &&
    !Number.isNaN(property.longitude);

  const [saveProperty, { isLoading: isSavingProperty }] = useSavePropertyMutation();
  const [unsaveProperty, { isLoading: isUnsavingProperty }] = useUnsavePropertyMutation();
  const [trackPropertyView] = useTrackPropertyViewMutation();

  const [isSaved, setIsSaved] = useState(false);
  const propertyId = property?.id || (property as any)?._id || (property as any)?.propertyId;

  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data || userData;
  const userId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.uid ||
    currentUser?.userId ||
    currentUser?.data?.id ||
    currentUser?.data?._id;
  const isTogglingSave = isSavingProperty || isUnsavingProperty;

  const { data: savedStatusData } = useCheckPropertySavedQuery(
    { userId, propertyId },
    { skip: !userId || !propertyId },
  );

  const router = useRouter();
  const handleTrackPropertyView = async (id: any) => {
    if (propertyId || userId) {
      try {
        const payload = {
          propertyId: id,
          userId,
          source: "WEBSITE",
        };
        await trackPropertyView(payload).unwrap();
        router.push(`/property/${id}`);
      } catch (error) {
        console.error("Error tracking property view:", error);
      }
    }
  };


  useEffect(() => {
    let canceled = false;

    const syncSavedState = (nextSavedState: boolean) => {
      if (canceled) return;

      setIsSaved(nextSavedState);
    };

    const reconcileSavedState = async () => {
      await Promise.resolve();

      if (canceled) return;

      if (!propertyId || !userId) {
        syncSavedState(false);
        return;
      }

      if (typeof savedStatusData?.isSaved === "boolean") {
        syncSavedState(savedStatusData.isSaved);
        return;
      }

      const runtimeProperty = property as any;
      const directFlag =
        runtimeProperty?.isSaved ??
        runtimeProperty?.isSavedByCurrentUser ??
        runtimeProperty?.saved ??
        runtimeProperty?.favourite ??
        runtimeProperty?.favorite;

      if (typeof directFlag === "boolean") {
        syncSavedState(directFlag);
        return;
      }

      const savedBy = runtimeProperty?.savedBy;
      if (Array.isArray(savedBy)) {
        const hasCurrentUser = savedBy.some((entry: any) => {
          if (typeof entry === "string" || typeof entry === "number") {
            return String(entry) === String(userId);
          }

          return (
            String(entry?.id) === String(userId) ||
            String(entry?.userId) === String(userId) ||
            String(entry?.user?.id) === String(userId)
          );
        });

        syncSavedState(hasCurrentUser);
      }
    };

    void reconcileSavedState();

    return () => {
      canceled = true;
    };
  }, [property, userId, propertyId, savedStatusData?.isSaved]);

  const handleToggleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (!propertyId) {
      toast.error("Invalid property");
      return;
    }

    if (isTogglingSave) return;

    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      if (nextSavedState) {
        await saveProperty({ userId, propertyId, property }).unwrap();
      } else {
        await unsaveProperty({ userId, propertyId, property }).unwrap();
      }
    } catch (error: any) {
      const status = error?.status;
      const message = String(error?.data?.message || error?.data?.error || "").toLowerCase();

      if (status === 409 || message.includes("already")) {
        setIsSaved(true);
        return;
      }

      if (status === 404 || message.includes("not saved") || message.includes("not found")) {
        setIsSaved(false);
        return;
      }

      setIsSaved(!nextSavedState);
      toast.error("Something went wrong!");
    }
  };
  const handleViewLocation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasCoordinates || typeof window === "undefined") return;

    window.dispatchEvent(
      new CustomEvent("focus-property-location", {
        detail: {
          id: property.id,
          latitude: property.latitude,
          longitude: property.longitude,
        },
      }),
    );

    const mapSection = document.getElementById("property-map-section");
    mapSection?.scrollIntoView({ behavior: "smooth", block: "center" });

    onViewLocation?.();
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 hover:scale-[1.01] transition-transform duration-200">

      {/* ── Image Slider ── */}
      <div className="relative h-52">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          loop={(property?.images?.length || 0) > 1}
          className="h-full"
        >
          {property?.images?.map((img, imgIndex) => (
            <SwiperSlide key={imgIndex}>
              <Image
                src={img}
                alt={`${property.title} - ${imgIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </SwiperSlide>
          ))}

          {/* Prev / Next arrows */}
          <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-1 transition">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-1 transition">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </Swiper>

        {/* ── Top-left: REGA Verified badge ── */}
        {property.verified && (
          <div className="absolute top-3 left-3 z-20">
            <Image
              src={"/verified-badge.svg"}
              alt="verified-badge"
              height={56}
              width={56}
            />
          </div>
        )}

        {/* ── Top-right: Shield badge ── */}
        {property.badge && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-emerald-500 rounded-full p-2 shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* ── Bottom-left: Heart / Favourite ── */}
        <div className="absolute bottom-3 left-3 z-20">
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isTogglingSave}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 shadow-md"
          >
            <Heart
              className={`cursor-pointer w-4 h-4 transition ${isSaved ? "text-red-500 fill-red-500" : "text-white"
                }`}
            />
          </button>
        </div>

        {/* ── Bottom-right: Trophy ── */}
        {property.trophy && (
          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-yellow-400 rounded-full p-2 shadow-lg">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* ── Gradient fade into content area ── */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />
      </div>

      {/* ── Content ── */}
      <div
        onClick={() => handleTrackPropertyView(property?.id)}
        className="block px-4 pt-2 pb-3 cursor-pointer"
      >
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white leading-tight">
              {property.price}
            </h3>
            <p className="text-sm font-semibold text-white mt-0.5 truncate">
              {property.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {property.subtitle}
            </p>
          </div>
          <div className="shrink-0 mb-1">
            <GrowthChart />
          </div>
        </div>

        {/* ── Views Display ── */}
        {property.views !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-300">
            <Eye className="w-3.5 h-3.5" />
            <span>{property.views} views</span>
          </div>
        )}
      </div>

      {/* ── View Location button ── */}
      {showLocationButton && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleViewLocation}
            disabled={!hasCoordinates}
            className="cursor-pointer w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
          >
            View Location
          </button>
        </div>
      )}
    </div>
  );
}