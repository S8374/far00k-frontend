"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-black px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-8xl font-extrabold text-emerald-400 drop-shadow-lg">
          404
        </h1>

        

        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-white">
          Page Not Found
        </h2>

        <p className="mt-4 text-emerald-200/80">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl 
                     bg-emerald-500 hover:bg-emerald-600 
                     text-black font-semibold transition-all duration-300
                     shadow-lg hover:shadow-emerald-500/40"
        >
          <ArrowLeft size={18} />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
