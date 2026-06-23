"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const data = [
  { value: 20 },
  { value: 35 },
  { value: 28 },
  { value: 45 },
  { value: 40 },
  { value: 55 },
  { value: 50 },
  { value: 70 },
];

export default function GrowthChart() {
  return (
    <div style={{ width: 80, height: 60 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke="#16a34a"
            strokeWidth={3}
            fill="url(#colorGreen)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
