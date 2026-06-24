"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Container from "@/components/shared/Container";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import Image from "next/image";

export default function DeveloperProjects() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: developerResponse } = useGetDeveloperQuery({});

  const developersRaw =
    developerResponse?.data?.data?.data ||
    developerResponse?.data?.data ||
    developerResponse?.data ||
    [];

  const developerProjects = (Array.isArray(developersRaw) ? developersRaw : []).map((developer: any) => ({
    id: developer?.id,
    image: developer?.logoUrl || "/placeholder-image.png",
    title: developer?.name || "Unknown Developer",
    description: developer?.description || "",
  }));

  return (
    <section className="p-4 lg:p-8 overflow-hidden">
        {/* Section Title */}
        <div className="text-left mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Projects by developers in KSA
          </h2>
          <p className="text-zinc-400 text-sm">
            Leading Developments Across Saudi Arabia
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={12}
            slidesPerView={1.2}
            loop={developerProjects.length >= 5}
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
            {developerProjects.map((project, index) => (
              <SwiperSlide key={project.id || index}>
                <div
                  onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                  onMouseLeave={() => swiperRef.current?.autoplay.start()}
                  className="group cursor-pointer rounded-xl bg-white"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    {/* Image */}
                    <div className="relative h-52 sm:h-56 lg:h-72 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 24vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/5 via-black/10 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-4 text-white bg-black opacity-80">
                      <h3 className="text-xl md:text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm md:text-base text-zinc-200">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation Buttons */}
          {/* <SwiperNavButtons /> */}
        </div>
    </section>
  );
}
