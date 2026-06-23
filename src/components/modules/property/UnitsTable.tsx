"use client";

import { Copy, Car, VectorSquare, BedDouble, Bath } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

type Unit = {
  id: string;
  unitNumber: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  price: number;
  currency: string;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
};

type UnitsTableProps = {
  units: Unit[];
};

export default function UnitsTable({ units }: UnitsTableProps) {
  const copyAd = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("AD ID copied");
  };

  // filter units by status
  const filteredUnits = (status: string) => {
    if (status === "All") return units;

    return units.filter(
      (unit) => unit.status?.toLowerCase() === status.toLowerCase()
    );
  };

  const renderUnits = (status: string) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
      {filteredUnits(status).map((unit) => {
        const sold =
          unit.status === "SOLD"
            ? 100
            : unit.status === "RESERVED"
            ? 70
            : 20;

        return (
          <div
            key={unit.id}
            className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white space-y-4"
          >
            {/* Status */}
            <div className="flex justify-between items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full
                ${
                  unit.status === "AVAILABLE"
                    ? "bg-emerald-600"
                    : unit.status === "SOLD"
                    ? "bg-red-600"
                    : "bg-amber-600"
                }`}
              >
                {unit.status}
              </span>

              <span className="text-xs text-zinc-400">{sold}%</span>
            </div>

            {/* Progress */}
            <div>
              <p className="text-xs mb-1">Sold Units</p>

              <div className="w-full bg-zinc-700 h-2 rounded-full">
                <div
                  style={{ width: `${sold}%` }}
                  className={`h-2 rounded-full
                  ${
                    unit.status === "SOLD"
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-yellow-400 to-green-600"
                  }`}
                />
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Price */}
              <div className="bg-white/10 p-3 rounded-lg flex flex-col items-center">
                <p>{unit.price}</p>

                <p className="text-zinc-400 flex items-center gap-1">
                  <Image
                    src="/saudi-rial.svg"
                    alt="sar"
                    width={16}
                    height={16}
                  />
                  {unit.currency}
                </p>
              </div>

              {/* Area */}
              <div className="bg-white/10 p-3 rounded-lg flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <VectorSquare className="w-4 h-4" />
                  <p>{unit.areaSqm} sqm</p>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <Car className="w-4 h-4" />
                  <p>{unit.parkingSlots} Parking</p>
                </div>
              </div>

              {/* Beds & Baths */}
              <div className="bg-white/10 p-3 rounded-lg flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  <p>{unit.bedrooms} Beds</p>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <Bath className="w-4 h-4" />
                  <p>{unit.bathrooms} Baths</p>
                </div>
              </div>

              {/* Unit Number */}
              <button
                onClick={() => copyAd(unit.id)}
                className="bg-white/10 rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                Unit #{unit.unitNumber}
                <Copy className="text-emerald-500 w-4 h-4" />
              </button>

              {/* More Info */}
              <Button className="col-span-2 bg-white/10 hover:bg-emerald-600 h-10">
                More Info
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Units Table</h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="All" className="w-full">
        <div className="flex justify-end">
          <TabsList className="bg-neutral-900 border border-neutral-700">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="AVAILABLE">Available</TabsTrigger>
            <TabsTrigger value="SOLD">Sold</TabsTrigger>
            <TabsTrigger value="RESERVED">Reserved</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="All">{renderUnits("All")}</TabsContent>

        <TabsContent value="AVAILABLE">
          {renderUnits("AVAILABLE")}
        </TabsContent>

        <TabsContent value="SOLD">
          {renderUnits("SOLD")}
        </TabsContent>

        <TabsContent value="RESERVED">
          {renderUnits("RESERVED")}
        </TabsContent>
      </Tabs>
    </div>
  );
}