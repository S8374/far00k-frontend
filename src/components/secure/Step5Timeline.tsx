"use client";

const timelineOptions = [
  { id: "asap", label: "ASAP (Priority Lead)" },
  { id: "1-3months", label: "1-3 Months" },
  { id: "monitoring", label: "Just Monitoring" },
];

interface Step5Props {
  selected: string;
  onSelect: (value: string) => void;
}

export default function Step5Timeline({ selected, onSelect }: Step5Props) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-white text-2xl font-semibold tracking-wide text-center">
        When should the Digital Seal be Finalized ?
      </h2>

      <div className="flex flex-wrap gap-3 justify-center">
        {timelineOptions.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              selected === id
                ? "bg-green-500 border-green-500 text-white shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                : "border-white/20 bg-white/5 text-white/70 hover:border-green-500/50 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
