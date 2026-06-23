"use client";

import { Building2, Building, MapPin, TrendingUp } from "lucide-react";

const propertyTypes = [
  { id: "residential", label: "Residential", icon: Building2 },
  { id: "commercial", label: "Commercial", icon: Building },
  { id: "land", label: "Land/Port", icon: MapPin },
  { id: "investment", label: "Investment Only", icon: TrendingUp },
];

interface Step1Props {
  selected: string;
  onSelect: (value: string) => void;
}

export default function Step1PropertyType({ selected, onSelect }: Step1Props) {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        What are we securing today ?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        {propertyTypes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`
              flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
              ${
                selected === id
                  ? "border-green-500 bg-green-500/10 shadow-[0_0_18px_rgba(34,197,94,0.3)]"
                  : "border-white/10 bg-white/5 hover:border-green-500/60 hover:bg-green-500/5"
              }
            `}
          >
            <Icon
              className={`w-10 h-10 ${selected === id ? "text-green-400" : "text-white/70"}`}
              strokeWidth={1.5}
            />
            <span
              className={`text-sm font-medium ${selected === id ? "text-white" : "text-white/70"}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
