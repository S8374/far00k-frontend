"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ShieldCheck, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import GrowthChart from "@/components/shared/GrowthChart";
import { useRef, useEffect } from "react";
import { Swiper as SwiperInstance } from "swiper";

export interface PropertyCardProps {
  property: any;
  onCardClick?: () => void;
}

export default function PropertyCardMap({ property, onCardClick }: PropertyCardProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
      swiperRef.current.update();
    }
  }, []);

  const Content = (
    <>
      <div className="flex items-start gap-3">
        <div>
          <h3 className="text-xl font-bold leading-tight text-white">SAR {property.price}</h3>
          <p className="text-base font-semibold text-white mt-0.5">{property.title}</p>
          {property.subtitle && <p className="text-xs text-gray-300 mt-1">{property.subtitle}</p>}
        </div>
        <div className="mt-8 relative scale-90 origin-top-right">
          <GrowthChart />
        </div>
      </div>
      <div className="flex items-center gap-x-1.5 mt-3">
        {property.roi && <FaArrowTrendUp className="text-green-400 font-semibold text-base" />}
        {property.roi && <span className="text-gray-400 font-semibold text-base">{property.roi}</span>}
        {property.area && <span className="text-gray-400 text-xs ml-3">{property.area}</span>}
      </div>
    </>
  );

  return (
    <Card className="relative z-30 w-70 max-w-70 bg-neutral-800 opacity-100 backdrop-blur-sm rounded-xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500 shadow-2xl p-0 h-full">
      <div className="relative h-44 w-full">
        {property.images && property.images.length > 0 && (
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
            loop={(property?.images?.length || 0) > 1}
            className="h-full"
          >
            {property.images.map((img: string, i: number) => (
              <SwiperSlide key={i}>
                <Image src={img} alt={`${property.title}-${i}`} fill className="object-cover" unoptimized />
              </SwiperSlide>
            ))}
            <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1">
              <ChevronLeft className="w-5 h-5 text-white cursor-pointer" />
            </button>
            <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1">
              <ChevronRight className="w-5 h-5 text-white cursor-pointer" />
            </button>
          </Swiper>
        )}
        {property.badge && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {property.badge}
            </span>
          </div>
        )}
        {property.verified && (
          <div className="absolute top-3 left-3 z-10">
            <Image src="/verified-badge.svg" alt="verified" height={46} width={46} />
          </div>
        )}
        {property.trophy && (
          <div className="absolute bottom-2 right-4 z-10">
            <div className="bg-yellow-500 rounded-full p-2 shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {onCardClick ? (
        <div onClick={onCardClick} className="px-3 py-3 block cursor-pointer">
          {Content}
        </div>
      ) : (
        <Link href={`/property/${property.id}`} className="px-3 py-3 block">
          {Content}
        </Link>
      )}
    </Card>
  );
}
