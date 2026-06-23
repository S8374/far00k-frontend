// components/modules/dashboard/StateBox.tsx
import { ReactNode } from "react";

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
}

export default function StatBox({ label, value, icon, highlight }: StatBoxProps) {
  return (
    <div className={`bg-gray-800/50 p-3 rounded-lg border ${highlight ? 'border-yellow-500/50' : 'border-gray-700'}`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className={`text-lg font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}