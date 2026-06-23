import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwiper } from "swiper/react";

export function SwiperNavButtons() {
  const swiper = useSwiper();
  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </>
  );
}