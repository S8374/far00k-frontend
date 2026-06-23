


import PropertyPreviewClient from "@/components/modules/dashboard/property/PropertyPreviewClient";
import { Suspense } from "react";

export default function PropertyPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
          Loading preview...
        </div>
      }
    >
      <PropertyPreviewClient />
    </Suspense>
  );
}