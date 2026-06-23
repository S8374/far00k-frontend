"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPaymentPlansByCreatorQuery,
  useGetPaymentPlansByBuyerQuery
} from "@/redux/api/paymentPlanApi";

const formatCurrency = (amount: number, currency: string = "SAR") => {
  return `${currency} ${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getStatusBadge = (paymentProgress: number, verifiedMilestones: number) => {
  if (paymentProgress >= 100) {
    return {
      label: "Completed",
      color: "text-emerald-500",
      icon: CheckCircle,
    };
  }

  if (verifiedMilestones > 0) {
    return {
      label: "In Progress",
      color: "text-blue-500",
      icon: Clock,
    };
  }

  return {
    label: "Not Started",
    color: "text-gray-500",
    icon: Calendar,
  };
};

export default function PaymentSchedulePage() {
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;
  const userId = user?.id || "";
  const role = user?.role;

  // Fetch as creator/agent
  const { data: creatorData, isLoading: creatorLoading } = useGetPaymentPlansByCreatorQuery(
    { creatorId: userId },
    { skip: !userId || role !== "AGENT", refetchOnMountOrArgChange: true }
  );

  // Fetch as buyer
  const { data: buyerData, isLoading: buyerLoading } = useGetPaymentPlansByBuyerQuery(
    { buyerId: userId },
    { skip: !userId || role !== "BUYER", refetchOnMountOrArgChange: true }
  );

  const data = role === "BUYER" ? buyerData : creatorData;
  const plansLoading = role === "BUYER" ? buyerLoading : creatorLoading;

  const paymentPlans = data?.data?.data?.plans || data?.data?.plans || data?.plans || [];
  console.log("paymentPlans", paymentPlans);
  const content = useMemo(() => {
    if (paymentPlans.length === 0) {
      return (
        <Card className="bg-[#2E2E2E] border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No payment plans found</p>
            <p className="text-gray-500 text-sm mt-2">
              Create a payment plan to get started
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {paymentPlans.map((plan: any) => {
          const property = plan?.property;
          const summary = plan?.summary || {};
          const milestones = plan?.milestones || [];
          const firstImage =
            property?.images?.[0] || property?.imageUrl?.[0] || "/placeholder-image.jpg";
          const status = getStatusBadge(
            Number(summary.paymentProgress || 0),
            Number(summary.verifiedMilestones || 0)
          );
          const StatusIcon = status.icon;

          return (
            <Link
              href={{
                pathname: `/dashboard/payments/${plan.id}`,
                query: {
                  creatorId: userId,
                  propertyId: property?.id || "",
                },
              }}
              key={plan.id}
            >
              <Card className="bg-[#2E2E2E] border-gray-700 hover:border-emerald-500 transition-all duration-300 cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0">
                    <div className="p-6">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={firstImage}
                            alt={property?.title || "Property"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="text-lg md:text-xl font-semibold hover:text-emerald-400 transition-colors">
                                {property?.title || "Untitled Property"}
                              </h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-sm text-gray-400">
                                  ID: {property?.id?.slice(-8) || "N/A"}
                                </span>
                                <span className={`flex items-center gap-1 text-sm ${status.color}`}>
                                  <StatusIcon className="h-4 w-4" />
                                  {status.label}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${plan?.accepted || plan?.isAccepted
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                                >
                                  {plan?.accepted || plan?.isAccepted ? "Accepted" : "Pending"}
                                </span>
                              </div>
                            </div>

                            <div className="text-right hidden md:block">
                              <p className="text-sm text-gray-400">Plan Name</p>
                              <p className="font-medium text-white">{plan?.name || "Plan"}</p>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-3">
                            {property?.isBooked ? (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">
                                Booked
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">
                                Not Booked
                              </span>
                            )}
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs">
                              {summary.totalMilestones || milestones.length || 0} Milestones
                            </span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs">
                              {summary.verifiedMilestones || 0} Paid
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t lg:border-t-0 lg:border-l border-gray-700 p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-400">Property Price</p>
                          <p className="font-semibold text-white">
                            {formatCurrency(summary.totalPrice || property?.price || 0, property?.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total Paid</p>
                          <p className="font-semibold text-yellow-400">
                            {formatCurrency(summary.totalPaid || 0, property?.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Remaining</p>
                          <p className="font-semibold text-gray-300">
                            {formatCurrency(summary.remainingAmount || 0, property?.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Installments</p>
                          <p className="font-semibold text-gray-300">
                            {plan?.totalInstallments || summary.totalMilestones || 0}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Payment Progress</span>
                            <span className="text-xs text-gray-500">
                              ({summary.verifiedMilestones || 0}/{summary.totalMilestones || 0} milestones)
                            </span>
                          </div>
                          <p className="font-semibold text-emerald-400">
                            {summary.paymentProgress || 0}%
                          </p>
                        </div>
                        <Progress value={summary.paymentProgress || 0} className="h-3 bg-gray-700" />

                        {(summary.constructionProgress || 0) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Construction Progress</span>
                              <span className="font-semibold text-blue-400">
                                {summary.constructionProgress || 0}%
                              </span>
                            </div>
                            <Progress
                              value={summary.constructionProgress || 0}
                              className="h-2 bg-gray-700 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {Array.isArray(plan?.recentPayments) && plan.recentPayments.length > 0 && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-400 mb-2">Recent Activity</p>
                        <div className="flex gap-4 text-sm flex-wrap">
                          <span className="text-emerald-400">
                            +{formatCurrency(plan.recentPayments[0].amount, property?.currency)}
                          </span>
                          <span className="text-gray-500">
                            {new Date(plan.recentPayments[0].paidAt).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${plan.recentPayments[0].status === "VERIFIED"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : plan.recentPayments[0].status === "REJECTED"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {plan.recentPayments[0].status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }, [userId, role, paymentPlans, plansLoading]);

  if (userLoading || plansLoading) {
    return (
      <div className="text-gray-100 flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="text-gray-100">
      <div className="max-w-full mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Off-plan Payment Schedule</h1>
            <p className="text-gray-400 mt-1">Track your property payment progress</p>
          </div>
          <div className="bg-[#2E2E2E] px-4 py-2 rounded-lg">
            <span className="text-gray-400">Total Plans: </span>
            <span className="font-semibold text-emerald-500">{paymentPlans.length}</span>
          </div>
        </div>

        {content}
      </div>
    </div>
  );
}
