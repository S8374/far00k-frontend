"use client";

import { useState } from "react";
import { Activity } from "lucide-react";

const districts = [
  "Al-Malqa",
  "Al-Olaya",
  "Al-Sulaymaniyah",
  "Al-Nakheel",
  "Al-Yasmin",
  "Al-Raid",
  "Hittin",
  "Al-Hamra",
];

interface Step2Props {
  district: string;
  onDistrictChange: (value: string) => void;
  nearbyToggle: boolean;
  onNearbyToggle: (value: boolean) => void;
}

export default function Step2TargetDistrict({
  district,
  onDistrictChange,
  nearbyToggle,
  onNearbyToggle,
}: Step2Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        Target District
      </h2>

      <div className="flex gap-4 w-full items-start">
        {/* District Selector */}
        <div className="flex-1 relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/60 bg-green-500/5 text-white text-sm focus:outline-none"
          >
            <Activity className="w-4 h-4 text-green-400 shrink-0" />
            <span className="flex-1 text-left">{district || "Select District"}</span>
            <svg
              className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <ul className="absolute z-10 mt-1 w-full bg-[#1a2a1a] border border-green-500/30 rounded-xl overflow-hidden shadow-xl">
              {districts.map((d) => (
                <li
                  key={d}
                  onClick={() => {
                    onDistrictChange(d);
                    setOpen(false);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    district === d
                      ? "bg-green-500/20 text-green-300"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  {d}
                </li>
              ))}
            </ul>
          )}

          {/* Nearby toggle */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => onNearbyToggle(!nearbyToggle)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
                nearbyToggle ? "bg-green-500" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  nearbyToggle ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-white/70 text-sm">
              Within 5km of my current location
            </span>
          </div>
        </div>

        {/* Map thumbnail */}
        <div className="w-32 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center relative">
            {/* Simulated city grid */}
            <svg viewBox="0 0 128 96" className="w-full h-full opacity-80">
              <rect width="128" height="96" fill="#1e293b" />
              {/* Roads */}
              {[16, 32, 48, 64, 80, 96, 112].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="96" stroke="#f59e0b" strokeWidth="0.5" opacity="0.4" />
              ))}
              {[12, 24, 36, 48, 60, 72, 84].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="128" y2={y} stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />
              ))}
              {/* Blocks */}
              {[20, 52, 84].map((x) =>
                [15, 39, 63].map((y) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="20" height="12" fill="#334155" rx="1" />
                ))
              )}
              {/* Highlight */}
              <circle cx="64" cy="48" r="8" fill="#22c55e" opacity="0.4" />
              <circle cx="64" cy="48" r="3" fill="#22c55e" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
