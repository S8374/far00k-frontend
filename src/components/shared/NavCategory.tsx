import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface CategoryItem {
  label: string;
  value: string;
  count?: number;
  icon?: string;
}

interface NavbarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
}

export const CategoryPills = ({
  selectedCategory,
  setSelectedCategory,
  categories,
}: NavbarProps) => (
  <div className="flex justify-center items-center gap-3 flex-wrap">
    {categories.map((cat) => (
      <Button
        key={cat.value}
        variant="secondary"
        className={cn(
          "px-4 py-2 rounded-3xl text-sm md:text-base flex cursor-pointer items-center gap-2 whitespace-nowrap",
          "text-white border border-[#8F9093] bg-zinc-700 transition-all",
          selectedCategory === cat.value &&
            "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800"
        )}
        onClick={() => setSelectedCategory(cat.value)}
      >
        {cat.label}
        {typeof cat.count === "number" ? `(${cat.count})` : ""}
      </Button>
    ))}
  </div>
);
