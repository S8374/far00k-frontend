"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ডামি ডেটা
const dummyUnits = [
  { id: "AD-001", status: "Available", sold: 75, price: "1,900,000 - 1,950,000", beds: "4", baths: "4", units: "324/324" },
  { id: "AD-002", status: "Available", sold: 75, price: "1,900,000 - 1,950,000", beds: "4", baths: "4", units: "324/324" },
  { id: "AD-003", status: "Sold Out", sold: 100, price: "1,900,000 - 1,950,000", beds: "4", baths: "4", units: "324/324" },
  { id: "AD-004", status: "Sold Out", sold: 100, price: "1,900,000 - 1,950,000", beds: "4", baths: "4", units: "324/324" },
  { id: "AD-005", status: "Reserved", sold: 90, price: "1,900,000 - 1,950,000", beds: "4", baths: "4", units: "324/324" },
];

interface UnitsModalProps {
  projectTitle: string;
  triggerButton?: React.ReactNode;
}

export function UnitsModal({ projectTitle, triggerButton }: UnitsModalProps) {
  const [open, setOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("AD ID copied!");
  };

  const filteredUnits = (status: string) => {
    if (status === "All") return dummyUnits;
    return dummyUnits.filter((u) => u.status === status);
  };

  const getProgressColor = (sold: number) => {
    if (sold === 100) return "bg-red-500";
    if (sold > 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full">
            More Info
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Units in {projectTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="All" className="mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-800">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Available">Available</TabsTrigger>
            <TabsTrigger value="Sold Out">Sold Out</TabsTrigger>
            <TabsTrigger value="Reserved">Reserved</TabsTrigger>
          </TabsList>

          {["All", "Available", "Sold Out", "Reserved"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredUnits(tab).map((unit) => (
                  <Card
                    key={unit.id}
                    className="bg-neutral-800 border-neutral-700 overflow-hidden"
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={cn(
                            "text-white",
                            unit.status === "Available"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : unit.status === "Sold Out"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-amber-600 hover:bg-amber-700"
                          )}
                        >
                          {unit.status}
                        </Badge>
                        <span className="text-sm text-zinc-400">
                          {unit.sold}% Sold
                        </span>
                      </div>

                      {/* প্রোগ্রেস বার — এখানে ফিক্স */}
                      <Progress
                        value={unit.sold}
                        className={cn(
                          "h-2",
                          `[&>[data-slot=progress-indicator]]:${getProgressColor(unit.sold)}`
                        )}
                      />

                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{unit.price}</p>
                        <div className="flex justify-between text-zinc-400">
                          <span>SAR</span>
                          <span>{unit.units}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Beds: {unit.beds} • Baths: {unit.baths}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyToClipboard(unit.id)}
                        >
                          AD ID #{unit.id} <Copy className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredUnits(tab).length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  No units found in this category.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}