"use client";

import { ReactNode } from "react";

interface StatBoxProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  icon?: ReactNode; // add this
}

export default function StatBox({ label, value, highlight = false, icon }: StatBoxProps) {
  return (
    <div className="bg-[#0D0D0D] border border-white/40 rounded-lg p-3 flex flex-col gap-1 min-w-25">
      {/* Icon */}
      {icon && <div className="mb-1">{icon}</div>}

      <div className="flex justify-between">
        {/* Label */}
        <p className="text-xs font-normal text-gray-400 leading-4">{label}</p>

        {/* Value */}
        <p className={`font-medium leading-7 ${highlight ? "text-emerald-400" : "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}