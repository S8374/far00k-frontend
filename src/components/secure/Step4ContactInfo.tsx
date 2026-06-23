"use client";

interface Step4Props {
  name: string;
  mobile: string;
  email: string;
  onChange: (field: "name" | "mobile" | "email", value: string) => void;
  onSecure: () => void;
}

export default function Step4ContactInfo({
  name,
  mobile,
  email,
  onChange,
  onSecure,
}: Step4Props) {
  return (
    <div className="flex flex-col items-center gap-7">
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        Define your investment Range
      </h2>

      {/* Input Fields */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 text-sm outline-none focus:border-green-500/60 focus:bg-green-500/5 transition-all"
        />
        <input
          type="tel"
          placeholder="Mobile Number (+966)"
          value={mobile}
          onChange={(e) => onChange("mobile", e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 text-sm outline-none focus:border-green-500/60 focus:bg-green-500/5 transition-all"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 text-sm outline-none focus:border-green-500/60 focus:bg-green-500/5 transition-all"
        />
      </div>

      {/* Consent Text */}
      <p className="text-white/50 text-xs text-center leading-relaxed max-w-sm">
        By clicking Secure, we will match you with the top 3 REGA-licensed agents
        holding these deeds
      </p>

      {/* Secure My Matches CTA */}
      <button
        onClick={onSecure}
        className="w-full py-3.5 rounded-xl border border-green-500/50 bg-transparent text-white font-bold tracking-widest text-sm uppercase hover:bg-green-500/10 hover:border-green-400 transition-all duration-200"
      >
        SECURE MY MATCHES
      </button>
    </div>
  );
}
