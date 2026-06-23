"use client";

import { Bot } from "lucide-react";

const fundingOptions = ["Cash", "Bank Finance", "Needs Financing"];

interface Step3Props {
  rangeValue: number;
  onRangeChange: (value: number) => void;
  funding: string;
  onFundingChange: (value: string) => void;
}

function formatValue(val: number): string {
  if (val >= 20000000) return "20M+";
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  return `${(val / 1000).toFixed(0)}K`;
}

function getInsightCount(val: number): number {
  // Simulate dynamic count based on range
  return Math.max(5, Math.floor(40 - (val / 20000000) * 30));
}

export default function Step3InvestmentRange({
  rangeValue,
  onRangeChange,
  funding,
  onFundingChange,
}: Step3Props) {
  const MIN = 500000;
  const MAX = 20000000;
  const percent = ((rangeValue - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="flex flex-col items-center gap-7">
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        Define your investment Range
      </h2>

      {/* Slider */}
      <div className="w-full flex flex-col gap-2">
        <div className="relative w-full">
          <div className="relative h-2 rounded-full bg-white/10">
            <div
              className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-green-600 to-green-400"
              style={{ width: `${percent}%` }}
            />
          </div>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={100000}
            value={rangeValue}
            onChange={(e) => onRangeChange(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-400 border-2 border-white shadow-lg shadow-green-500/40 pointer-events-none"
            style={{ left: `calc(${percent}% - 10px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>500K</span>
          <span className="text-green-400 font-semibold text-sm">{formatValue(rangeValue)}</span>
          <span>20M+</span>
        </div>
      </div>

      {/* AI Insights badge */}
      <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/40 bg-green-500/5">
        <Bot className="w-4 h-4 text-green-400 shrink-0" />
        <p className="text-sm text-white/80">
          <span className="text-green-400 font-semibold">AI Insights: </span>
          There are currently{" "}
          <span className="text-white font-bold">{getInsightCount(rangeValue)}</span>{" "}
          verified properties in this range.
        </p>
      </div>

      {/* Funding Status */}
      <div className="flex flex-col items-center gap-3 w-full">
        <span className="text-white/70 text-sm">Funding Status ?</span>
        <div className="flex gap-3 flex-wrap justify-center">
          {fundingOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onFundingChange(opt)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                funding === opt
                  ? "bg-green-500 border-green-500 text-white shadow-[0_0_14px_rgba(34,197,94,0.4)]"
                  : "border-white/20 bg-white/5 text-white/70 hover:border-green-500/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
