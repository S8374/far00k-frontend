"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Upload, TrendingUp, Shield } from "lucide-react";
import { StatCard } from "@/components/modules/dashboard/StateCard";
import AddPropertyModal from "@/components/modules/dashboard/modal/AddPropertyModal";
import { useState } from "react";
import { PropertyItem } from "@/components/PropertyItem";
import { useGetMyPropertyQuery } from "@/redux/api/propertyApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetAgentStatQuery } from "@/redux/api/userApi";
import { PropertySkeleton } from "@/components/modules/Skeleton/PropertySkeleton";
import Link from "next/link";

export default function MyPropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;
  const agentId = user?.id;

  const { data: myProperties, isLoading: propertyLoading, refetch: refetchMyProperty } =
    useGetMyPropertyQuery(agentId);
  const { data: agentStats, isLoading: agentStatsLoading, refetch: refetchProperty } =
    useGetAgentStatQuery({ agentId });

  const isLoading = userLoading || propertyLoading || agentStatsLoading;

  if (isLoading) {
    return <PropertySkeleton />;
  }

  const stats = agentStats?.data?.data || agentStats?.data || {};
  const totalListings = stats.totalListings || 0;
  const activeListings = stats.activeListings || 0;
  const conversionRate = stats.conversionRate || 0;
  const totalLeads = stats.totalLeads || 0;
  const properties = myProperties?.data?.data || myProperties?.data || [];

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Welcome Back,{" "}
            <span className="text-emerald-500">{user?.fullName}</span>
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Badge
              className={`px-4 py-1 flex items-center gap-1 ${user?.agentProfile?.isRegaVerified
                ? "bg-emerald-700 hover:bg-emerald-600"
                : "bg-red-600 hover:bg-red-500"
                }`}
            >
              <Shield className="w-4 h-4" />
              {user?.agentProfile?.isRegaVerified
                ? "REGA Verified"
                : "Not Verified"}
            </Badge>
          </div>
        </div>

        {/* Upload Property */}
        <Button
          className="bg-emerald-600 hover:bg-emerald-500 gap-2 cursor-pointer shadow-lg hover:shadow-emerald-600/20 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Upload Property
        </Button>
        {isModalOpen && (
          <AddPropertyModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              refetchMyProperty();
              refetchProperty();
            }}
          />
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Listings"
          value={totalListings}
          icon={<Users className="h-6 w-6 text-emerald-500" />}
        />
        <StatCard
          title="Active Listings"
          value={activeListings}
          icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
        />
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={<Users className="h-6 w-6 text-emerald-500" />}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}`}
          icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
        />
      </div>

      {/* My Properties List */}
      <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Properties</h2>
            <Badge variant="outline" className="border-emerald-700 text-emerald-400">
              {properties.length} Properties
            </Badge>
          </div>

          <div className="space-y-6">
            {properties?.map((property: any) => (
              <PropertyItem
                key={property.id}
                {...property}
                paymentPlans={property.paymentPlans || []}
              />
            ))}

            {properties.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
                <Upload className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400 mb-4">No properties uploaded yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}