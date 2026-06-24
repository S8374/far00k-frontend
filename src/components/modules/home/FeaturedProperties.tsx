"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import PropertyCard from "../dashboard/property/PropertyCard";
import { useMemo } from "react";
import type { Swiper as SwiperType } from "swiper";
import type { Property } from "@/types/property";
import { useGetTrendingPropertiesQuery } from "@/redux/api/propertyApi";
import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type FeaturedPropertyCard = Property & {
  createdAt?: string;
};

function FeaturedProperties() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: trendingPropertiesData, isLoading } = useGetTrendingPropertiesQuery(undefined);

  // Transform API response to Property type
  const transformedProperties: FeaturedPropertyCard[] = useMemo(() => {
    if (!trendingPropertiesData || !Array.isArray(trendingPropertiesData)) {
      return [];
    }

    return trendingPropertiesData.map((property: any) => ({
      id: property.id,
      title: property.title || "Untitled Property",
      subtitle: property.agent?.user?.fullName || property.location || "",
      price: `${property.currency} ${property.price}`,
      roi: `${property.roiProjectionPercent}%` || "N/A",
      area: `${property.areaSqm} sqm`,
      images: property.images || [],
      badge: property.type || null,
      verified: property.isRegaVerified || false,
      trophy: property.status === "ACTIVE" || false,
      latitude: property.latitude,
      longitude: property.longitude,
      createdAt: property.createdAt,
      views: property.views || 0,
    }));
  }, [trendingPropertiesData]);

  const sortedProperties = useMemo(
    () =>
      [...transformedProperties].sort((a, b) => {
        // Sort by views (highest first)
        const aViews = a.views || 0;
        const bViews = b.views || 0;
        if (bViews !== aViews) {
          return bViews - aViews;
        }
        // If views are equal, sort by creation date (newest first)
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }),
    [transformedProperties],
  );

  if (isLoading) {
    return (
      <div className="my-4 p-4 rounded-lg">
        <h1 className="text-xl my-6 px-4 font-semibold">Trending Properties</h1>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 p-4 rounded-lg">
      <h1 className="text-xl my-6 px-4 font-semibold">Trending Properties</h1>

      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView={1.2}
          loop={sortedProperties.length >= 5}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
          }}
        >
          {sortedProperties.map((property, index) => (
            <SwiperSlide key={property.id ?? index}>
              <div
                onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay.start()}
              >
                <PropertyCard property={property} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default FeaturedProperties;