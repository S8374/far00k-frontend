"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Home,
  Calendar,
  Building2,
  Bath,
  Bed,
  Sparkles,
  Clock,
  CheckCircle2,
  CreditCard,
  Layers,
  Ruler,
  Car,
  Tag,
  AlertCircle,
  Landmark,
  Users,
  Mail,
  Phone,
  IdCard,
  ShieldCheck,
  ArrowRight,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/modules/dashboard/StateCard";
import { useDashboardData } from "@/components/hooks/useDashboardData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHomeSkeleton } from "@/components/modules/Skeleton/DashboardHomeSkeleton";
import { useGetBankAccountsByPropertyQuery } from "@/redux/api/bankAccountApi";
import { useGetPropertyInvisitorsByPropertyQuery } from "@/redux/api/invisitorApi";
import { useGetVerifiedStatsQuery } from "@/redux/api/adminApi";

const toSafeRate = (value: unknown) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
};

function RatePie({
  rate,
  color,
}: {
  rate: number;
  color: "emerald" | "sky";
}) {
  const safeRate = toSafeRate(rate);
  const fillColor = color === "emerald" ? "#10b981" : "#38bdf8";

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-14 w-14 rounded-full"
        style={{
          background: `conic-gradient(${fillColor} 0% ${safeRate}%, #27272a ${safeRate}% 100%)`,
        }}
      >
        <div className="absolute inset-1.5 flex items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
          {safeRate}%
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-white">{safeRate}%</p>
        <p className="text-xs text-zinc-400">Verified Portion</p>
      </div>
    </div>
  );
}

export default function DashboardHomePage() {
  const { user, stats, properties, isLoading } = useDashboardData();
  const { data: verifiedStatsResponse, isLoading: isVerifiedStatsLoading } = useGetVerifiedStatsQuery(undefined, {
    skip: user?.role !== "ADMIN",
  });

  const verifiedStats = verifiedStatsResponse?.data?.data;
  const agentStats = verifiedStats?.agents;
  const propertyStats = verifiedStats?.properties;


  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }

  if (user?.role === "ADMIN") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-zinc-400">Choose a management module below.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-white">
                {isVerifiedStatsLoading ? "..." : agentStats?.total ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Pending Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-amber-400">
                {isVerifiedStatsLoading ? "..." : agentStats?.pending ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Agent Verification Rate</CardTitle>
            </CardHeader>
            <CardContent>
              {isVerifiedStatsLoading ? (
                <p className="text-2xl font-semibold text-emerald-400">...</p>
              ) : (
                <RatePie rate={agentStats?.verificationRate ?? 0} color="emerald" />
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-white">
                {isVerifiedStatsLoading ? "..." : propertyStats?.total ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Verification Rate</CardTitle>
            </CardHeader>
            <CardContent>
              {isVerifiedStatsLoading ? (
                <p className="text-2xl font-semibold text-emerald-400">...</p>
              ) : (
                <RatePie rate={propertyStats?.verificationRate ?? 0} color="sky" />
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Pending Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-amber-400">
                {isVerifiedStatsLoading ? "..." : propertyStats?.pending ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminNavCard
            href="/dashboard/user-management"
            title="User Management"
            description="Create, update, delete users and block/unblock access."
            icon={<Users className="h-5 w-5 text-emerald-400" />}
          />
          <AdminNavCard
            href="/dashboard/agent-verification"
            title="Agent Verification"
            description="Review pending agents and verify REGA + NAFATH status."
            icon={<ShieldCheck className="h-5 w-5 text-emerald-400" />}
          />
          <AdminNavCard
            href="/dashboard/property-verification"
            title="Property Verification"
            description="Review pending properties and verify REGA details."
            icon={<FileText className="h-5 w-5 text-emerald-400" />}
          />
          <AdminNavCard
            href="/dashboard/kyc-verification"
            title="KYC Verification"
            description="Approve or reject pending KYC documents with notes."
            icon={<IdCard className="h-5 w-5 text-emerald-400" />}
          />
          <AdminNavCard
            href="/dashboard/verify-payment"
            title="Verify Payment"
            description="Review pending milestone payment requests and approve/reject."
            icon={<CreditCard className="h-5 w-5 text-emerald-400" />}
          />
          <AdminNavCard
            href="/dashboard/developers"
            title="Developers"
            description="Add and manage developer profiles with logo and website."
            icon={<Building2 className="h-5 w-5 text-emerald-400" />}
          />
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate additional stats
  const totalValue = properties.reduce((sum: number, prop: any) => sum + (prop.price || 0), 0);
  const activeProperties = properties.filter((p: any) => p.status === "ACTIVE").length;
  const soldProperties = properties.filter((p: any) => p.status === "SOLD").length;
  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-stone-950 to-stone-900">
      <div className="max-w-full mx-auto space-y-8 p-4 md:p-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-linear-to-r from-emerald-900/20 to-transparent p-6 rounded-2xl border border-emerald-900/30">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome Back,{" "}
              <span className="text-emerald-400">
                {user?.fullName || "Nayan Dhali"}
              </span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="text-emerald-400 border-emerald-600 bg-emerald-950/50 px-3 py-1"
              >
                <Tag className="h-3 w-3 mr-1" />
                Agent ID: AGT-{user?.id?.slice(0, 5) || "00542"}
              </Badge>
              <Badge
                className={user?.agentProfile?.isRegaVerified
                  ? "bg-emerald-600 text-white px-3 py-1"
                  : "bg-yellow-600 text-white px-3 py-1"
                }
              >
                {user?.agentProfile?.isRegaVerified ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {user?.agentProfile?.isRegaVerified ? "REGA Verified" : "Verification Pending"}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 bg-black/30 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-right">
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4 text-emerald-400" />
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                }) : "2024"}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div className="text-right">
              <p className="text-sm text-gray-400">Properties</p>
              <p className="text-white font-medium">{properties.length} Total</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Listings"
            value={stats.totalListings || properties.length || 0}
            icon={<Home className="h-6 w-6 text-emerald-500" />}
          />
          <StatCard
            title="Active Listings"
            value={activeProperties}
            icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(totalValue)}
            icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
          />
          <StatCard
            title="Portfolio Health"
            value={`${soldProperties} Sold`}
            icon={<Sparkles className="h-6 w-6 text-emerald-500" />}
          />
        </div>

        {/* Property Performance Section */}
        <Card className="bg-stone-900/80 border-stone-800 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b ">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Building2 className="h-6 w-6 text-emerald-500" />
                Property
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-emerald-700 text-emerald-400">
                  <Layers className="h-3 w-3 mr-1" />
                  {properties.length} Properties
                </Badge>
                <Badge variant="outline" className="border-emerald-700 text-emerald-400">
                  <CreditCard className="h-3 w-3 mr-1" />
                  {properties.reduce((sum: number, p: any) => sum + (p._count?.paymentPlans || 0), 0)} Plans
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {properties.length > 0 ? (
              <div className="space-y-6">
                {properties.map((property: any, index: number) => (
                  <PropertyDetailsCard
                    key={property.id || index}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl bg-black/20">
                <Home className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No Properties Yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start building your portfolio by uploading your first property. Track performance, manage payments, and attract leads.
                </p>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all">
                  Upload Your First Property
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Property Details Card Component
function PropertyDetailsCard({ property }: { property: any }) {
  const { data: bankAccountsData } = useGetBankAccountsByPropertyQuery(
    { propertyId: property?.id },
    { skip: !property?.id }
  );
  const bankAccounts = bankAccountsData?.data?.data || [];

  const { data: invisitorsData } = useGetPropertyInvisitorsByPropertyQuery(
    { propertyId: property?.id },
    { skip: !property?.id }
  );
  const invisitors = invisitorsData?.data?.data || [];

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-emerald-600",
      PENDING: "bg-yellow-600",
      SOLD: "bg-red-600",
      RENTED: "bg-blue-600",
    };
    return colors[status as keyof typeof colors] || "bg-gray-600";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "GOLDEN_VISA": return <Sparkles className="h-4 w-4 text-yellow-400" />;
      case "HIGH_YIELD": return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "LUXURY": return <Building2 className="h-4 w-4 text-purple-400" />;
      default: return <Home className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalUnits = property.totalUnits || 0;
  const availableUnits = property.availableUnits || 0;
  const occupancyRate = totalUnits > 0 ? Number(((totalUnits - availableUnits) / totalUnits * 100).toFixed(0)) : 0;

  return (
    <Card className="bg-linear-to-br from-stone-800/50 to-stone-900/50 border-stone-700 py-0 hover:border-emerald-700 transition-all overflow-hidden group">
      <CardContent className="p-0 ">
        {/* Header with Image */}
        <div className="relative  h-30 ">
          <Image
            src={property.images?.[0] || "/br-villa.png"}
            alt={property.title}
            fill
            className="object-cover  transition-transform duration-700"
          />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className={`${getStatusColor(property.status)} text-white border-0`}>
              {property.status}
            </Badge>
            <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-emerald-700 text-emerald-400">
              {getTypeIcon(property.type)}
              <span className="ml-1">{property.type?.replace('_', ' ')}</span>
            </Badge>
            {property.isRegaVerified && (
              <Badge className="bg-emerald-600 text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                REGA Verified
              </Badge>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-emerald-600 text-white text-lg  px-4 border-0 shadow-lg">
              {new Intl.NumberFormat('en-SA', {
                style: 'currency',
                currency: 'SAR',
                minimumFractionDigits: 0,
              }).format(property.price)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Location */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span>{property.location || property.addressLine?.split(',')[0] || "Location not specified"}</span>
              {property.sakNumber && (
                <>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="text-sm">Sak: {property.sakNumber}</span>
                </>
              )}
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FeatureBox icon={<Bed className="h-4 w-4" />} label="Bedrooms" value={property.bedrooms || 0} />
            <FeatureBox icon={<Bath className="h-4 w-4" />} label="Bathrooms" value={property.bathrooms || 0} />
            <FeatureBox icon={<Ruler className="h-4 w-4" />} label="Area" value={`${property.areaSqm || 0} m²`} />
            <FeatureBox icon={<Car className="h-4 w-4" />} label="Parking" value={property.parkingSlots || 0} />
          </div>

          {/* Stats and Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Units Info */}
            <div className="bg-stone-800/50 items-center rounded-xl p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Units</span>
                <span className="text-emerald-400 font-semibold">{availableUnits}/{totalUnits} Available</span>
              </div>
            </div>

            {/* Payment Plans */}
            <div className="bg-stone-800/50 flex justify-between items-center rounded-xl p-2">
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-gray-400 text-sm">Payment Plans</span>
                <CreditCard className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-xl font-bold text-white">{property._count?.paymentPlans || 0}</p>
            </div>

            {/* Performance Metrics */}
            <div className="bg-stone-800/50 flex justify-between items-center rounded-xl p-2">
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-gray-400 text-sm">Performance</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex justify-between text-sm gap-2.5">
                <span className="text-gray-400">Views: <span className="text-white font-semibold">{property._count?.propertyViews || 0}</span></span>
                <span className="text-gray-400">Saved: <span className="text-white font-semibold">{property._count?.savedBy || 0}</span></span>
              </div>
            </div>
          </div>

          {/* Additional Details Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-stone-800 border-stone-700 flex flex-wrap h-auto">
              <TabsTrigger value="details" className="data-[state=active]:bg-emerald-700">Details</TabsTrigger>
              <TabsTrigger value="attributes" className="data-[state=active]:bg-emerald-700">Attributes</TabsTrigger>
              <TabsTrigger value="units" className="data-[state=active]:bg-emerald-700">Units</TabsTrigger>
              <TabsTrigger value="bank-account" className="data-[state=active]:bg-emerald-700">
                Bank Account ({bankAccounts.length})
              </TabsTrigger>
              <TabsTrigger value="invisitor" className="data-[state=active]:bg-emerald-700">
                Invisitor ({invisitors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <DetailItem label="Year Built" value={property.yearBuilt || 'N/A'} />
                <DetailItem label="Floor" value={property.floorNumber || 'N/A'} />
                <DetailItem label="Balconies" value={property.balconies || 0} />
                <DetailItem label="Furnished" value={property.furnished ? 'Yes' : 'No'} />
                <DetailItem label="ROI Projection" value={`${property.roiProjectionPercent || 0}%`} />
                <DetailItem label="Est. Rental" value={formatCurrency(property.estimatedRentalIncome || 0)} />
                <DetailItem label="Developer" value={property.developer?.name || 'N/A'} />
                <DetailItem label="Listed" value={formatDate(property.createdAt)} />
              </div>
            </TabsContent>

            <TabsContent value="attributes" className="mt-4">
              {property.attributes && property.attributes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.attributes.map((attr: any, idx: number) => (
                    <div key={idx} className="bg-stone-800/30 p-3 rounded-lg border border-stone-700">
                      <p className="text-xs text-gray-400">{attr.key}</p>
                      <p className="text-sm font-medium text-white">{attr.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No attributes added yet</p>
              )}
            </TabsContent>

            <TabsContent value="units" className="mt-4">
              {property.units && property.units.length > 0 ? (
                <div className="space-y-2">
                  {property.units.map((unit: any, idx: number) => (
                    <div key={idx} className="bg-stone-800/30 p-3 rounded-lg border border-stone-700 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-white">Unit {unit.unitNumber}</p>
                        <p className="text-xs text-gray-400">{unit.bedrooms} Bed • {unit.areaSqm} m²</p>
                      </div>
                      <Badge className={unit.status === 'AVAILABLE' ? 'bg-emerald-600' : 'bg-yellow-600'}>
                        {unit.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No units created yet</p>
              )}
            </TabsContent>

            <TabsContent value="bank-account" className="mt-4">
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  {bankAccounts.map((account: any) => (
                    <div
                      key={account.id}
                      className="bg-stone-800/30 p-3 rounded-lg border border-stone-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Landmark className="h-4 w-4 text-emerald-400" />
                        <p className="font-medium text-white">{account.bankName || "Bank"}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-300">Holder: <span className="text-white">{account.accountHolder || "N/A"}</span></p>
                        <p className="text-gray-300">Account: <span className="text-white">{account.accountNumber || "N/A"}</span></p>
                        {account.iban && (
                          <p className="text-gray-300 md:col-span-2">IBAN: <span className="text-white">{account.iban}</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No bank account added yet</p>
              )}
            </TabsContent>

            <TabsContent value="invisitor" className="mt-4">
              {invisitors.length > 0 ? (
                <div className="space-y-3">
                  {invisitors.map((visitor: any) => (
                    <div
                      key={visitor.id}
                      className="bg-stone-800/30 p-3 rounded-lg border border-stone-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <p className="font-medium text-white">{visitor.name || "Invisitor"}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {visitor.email && (
                          <p className="text-gray-300 flex items-center gap-1"><Mail className="h-3 w-3" /> {visitor.email}</p>
                        )}
                        {visitor.phoneNumber && (
                          <p className="text-gray-300 flex items-center gap-1"><Phone className="h-3 w-3" /> {visitor.phoneNumber}</p>
                        )}
                        {visitor.idNumber && (
                          <p className="text-gray-300 flex items-center gap-1"><IdCard className="h-3 w-3" /> {visitor.idNumber}</p>
                        )}
                        {visitor.relationship && (
                          <p className="text-gray-300">Relation: <span className="text-white">{visitor.relationship?.replace(/_/g, " ")}</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No invisitor added yet</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer with Date */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-700">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Listed: {formatDate(property.createdAt)}
              </span>
              {property.updatedAt !== property.createdAt && (
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {formatDate(property.updatedAt)}
                </span>
              )}
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper Components
function FeatureBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-stone-800/30 rounded-lg flex justify-between p-3 border border-stone-700">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-stone-800/30 p-2 flex justify-between rounded-lg">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function AdminNavCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="group">
      <Card className="border-zinc-800 bg-zinc-900/60 text-white transition hover:border-emerald-600/60">
        <CardContent className="space-y-3 p-5">
          <div className="inline-flex rounded-md bg-emerald-500/10 p-2">{icon}</div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-zinc-400">{description}</p>
          <div className="inline-flex items-center gap-2 text-sm text-emerald-400">
            Open module
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}