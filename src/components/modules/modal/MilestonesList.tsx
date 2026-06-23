"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  Lock,
  CheckCircle2,
  AlertCircle,
  CircleOff,
} from "lucide-react";
import { useGetMilestonesByPlanQuery } from "@/redux/api/mileston.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MilestonesListProps {
  planId: string;
  totalSteps?: number;
}

export default function MilestonesList({
  planId,
  totalSteps = 6,
}: MilestonesListProps) {
  const [milestones, setMilestones] = useState<any[]>([]);

  const { data, isLoading, error, refetch } = useGetMilestonesByPlanQuery(
    { planId },
    { skip: !planId, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data?.data?.data && Array.isArray(data.data.data)) {
      const sorted = [...data.data.data].sort(
        (a, b) => a.milestoneOrder - b.milestoneOrder
      );
      setMilestones(sorted);
    } else {
      setMilestones([]);
    }
  }, [data]);

  useEffect(() => {
    if (planId) refetch();
  }, [planId, refetch]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };
  if (isLoading) {
    return (
      <h1 className="text-center items-center">Loading...</h1>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="bg-stone-900/70 border-red-500/30 rounded-xl">
        <CardContent className="py-12 px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Failed to Load Milestones</h3>
            <p className="text-sm text-gray-400 max-w-md">
              Unable to fetch milestones. Please try again later.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-2 border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No Plan ID State
  if (!planId) {
    return (
      <Card className="bg-stone-900/70 border-stone-700 rounded-xl">
        <CardContent className="py-12 px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center">
              <Lock className="w-7 h-7 text-stone-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">No Plan Selected</h3>
            <p className="text-sm text-gray-400">
              Please select a payment plan to view its milestones
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty Milestones State
  if (milestones.length === 0) {
    return (
      <Card className="bg-stone-900/70 border-stone-700 rounded-xl">
        <CardContent className=" px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-semibold text-white">No Milestones Yet</h3>
            <p className="text-sm text-gray-400 max-w-md">
              This payment plan doesn't have any milestones created yet.
              {totalSteps > 0 && (
                <span className="block mt-1 text-emerald-400">
                  You can create up to {totalSteps} milestones for this plan.
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCompleted = milestones
    .filter((m) => m.constructionProgress >= 100)
    .reduce((max, m) => Math.max(max, m.milestoneOrder), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {milestones.map((milestone) => {
        const isCurrent = milestone.milestoneOrder === maxCompleted + 1;
        const isCompleted = milestone.constructionProgress >= 100;
        const isLocked = milestone.milestoneOrder > maxCompleted + 1;

        const showAction = isCurrent && !isCompleted;

        const percentLabel = milestone.constructionProgress
          ? `${milestone.constructionProgress}%`
          : "0%";

        const titleText =
          milestone.tittle || `Deposit (${percentLabel})`;

        return (
          <Card
            key={milestone.id}
            className={`
            relative bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl overflow-hidden p-0
            shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300
            ${isCurrent ? "ring-2 ring-yellow-600/60 shadow-yellow-600/20" : ""}
            ${isLocked ? "opacity-70" : ""}
            hover:border-emerald-700/50 hover:shadow-lg
          `}
          >
            {/* HEADER */}
            <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between bg-gradient-to-r from-[#1a1a1a] to-[#111]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${showAction
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                      : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                >
                  {milestone.milestoneOrder}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white line-clamp-1">
                    {titleText}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Step {milestone.milestoneOrder} of {totalSteps}
                  </p>
                </div>
              </div>

              {isCompleted && (
                <Badge className="bg-emerald-700 text-white text-xs px-2 py-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                </Badge>
              )}

              {isLocked && (
                <Badge className="bg-gray-700 text-gray-300 text-xs px-2 py-1">
                  <Lock className="h-3 w-3 mr-1" /> Locked
                </Badge>
              )}

              {showAction && (
                <Badge className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 border border-yellow-500/30">
                  <AlertCircle className="h-3 w-3 mr-1" /> Action Required
                </Badge>
              )}
            </div>

            <CardContent className="">
              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Amount */}
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" />
                    Amount
                  </div>
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(milestone.amount || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({percentLabel})
                  </div>
                </div>

                {/* Construction Progress */}
                <div className="border-l border-r border-[#222] px-2">
                  <div className="text-gray-400 text-xs mb-1">
                    Progress
                  </div>
                  <div className="text-sm font-bold text-white">
                    {percentLabel}
                  </div>
                  {showAction && (
                    <div className="text-[10px] text-yellow-500 font-medium">
                      Required
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                    <Calendar className="h-3 w-3 text-blue-400" />
                    Due
                  </div>
                  <div className="text-xs text-white">
                    {formatDate(milestone.dueDate)}
                  </div>
                </div>
              </div>


              {isLocked && (
                <div className="mt-3 py-2 px-3 bg-black/40 rounded-lg text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                  <Lock className="h-3 w-3" />
                  Complete previous milestones to unlock
                </div>
              )}

              {isCompleted && milestone.paidAt && (
                <div className="mt-3 py-2 px-3 bg-emerald-500/10 rounded-lg text-center text-emerald-500 text-xs">
                  Paid on {formatDate(milestone.paidAt)}
                </div>
              )}
            </CardContent>

            {isLocked && (
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            )}
          </Card>
        );
      })}
    </div>
  );
}