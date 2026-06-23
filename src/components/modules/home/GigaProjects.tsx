"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Container from "@/components/shared/Container";
import { useGetAllPropertiesQuery } from "@/redux/api/propertyApi";
import type { Swiper as SwiperType } from "swiper";
import { useRef, useMemo } from "react";
import PropertyCard from "../dashboard/property/PropertyCard";
import type { Property } from "@/types/property";

interface ApiProperty {
  id: string;
  title: string;
  price: number;
  createdAt?: string;
  currency?: string;
  location?: string;
  addressLine?: string;
  listingPurpose?: "SELL" | "RENT";
  areaSqm?: number;
  roiProjectionPercent?: number;
  isRegaVerified?: boolean;
  images?: string[];
  media?: Array<{ url?: string }>;
  latitude?: number;
  longitude?: number;
}

type GigaProjectCard = Property & {
  createdAt?: string;
};

const extractApiProperties = (response: any): ApiProperty[] => {
  const rawPropertyPayload = response?.data?.data;

  if (Array.isArray(rawPropertyPayload)) {
    return rawPropertyPayload;
  }

  if (Array.isArray(rawPropertyPayload?.data)) {
    return rawPropertyPayload.data;
  }

  return [];
};

const mapPropertyToCard = (property: ApiProperty): GigaProjectCard => {
  const images: string[] = property.images?.length
    ? property.images
    : (property.media
        ?.map((item) => item.url)
        .filter((url): url is string => typeof url === "string" && url.length > 0) ?? []);

  return {
    id: property.id,
    createdAt: property.createdAt,
    title: property.title,
    price: `${property.currency || "SAR"} ${Number(property.price || 0).toLocaleString()}`,
    subtitle: [property.location || property.addressLine, property.listingPurpose]
      .filter(Boolean)
      .join(" • "),
    roi: property.roiProjectionPercent ? `${property.roiProjectionPercent}% ROI` : "",
    area: property.areaSqm ? `${property.areaSqm} m2` : "",
    badge: property.isRegaVerified ? "REGA VERIFIED" : undefined,
    verified: Boolean(property.isRegaVerified),
    trophy: false,
    images,
    latitude: property.latitude,
    longitude: property.longitude,
  };
};

export default function GigaProjects() {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data: gigaProjectsResponse, isLoading } = useGetAllPropertiesQuery({
    type: "GIGA_PROJECT",
  });

  const apiProperties = useMemo<ApiProperty[]>(
    () => extractApiProperties(gigaProjectsResponse),
    [gigaProjectsResponse],
  );

  const gigaProjects = useMemo<GigaProjectCard[]>(
    () =>
      apiProperties
        .slice()
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        })
        .map(mapPropertyToCard),
    [apiProperties],
  );

  if (isLoading) {
    return (
      <section className="p-4 lg:p-8 overflow-hidden max-w-full mx-auto">
        <Container>
          <div className="text-left mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Giga Projects
            </h2>
            <p className="text-zinc-400 text-sm">
              Kingdom Vision 2030 Mega Projects
            </p>
          </div>
          <div className="h-80 bg-zinc-800 rounded-lg animate-pulse" />
        </Container>
      </section>
    );
  }

  if (gigaProjects.length === 0) {
    return null;
  }

  return (
    <section className="p-4 lg:p-8 overflow-hidden">

        {/* Section Title */}
        <div className="text-left mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Giga Projects
          </h2>
          <p className="text-zinc-400 text-sm">
            Kingdom Vision 2030 Mega Projects
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 5.5 },
            }}
          >
            {gigaProjects.map((property, index) => (
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
    </section>
  );
}
