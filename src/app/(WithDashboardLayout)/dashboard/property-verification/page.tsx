"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  User,
  ChevronRight,
  ShieldCheck,
  Building
} from "lucide-react";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPendingPropertiesQuery,
  useGetVerifiedPropertiesQuery,
  useVerifyPropertyByAdminMutation,
} from "@/redux/api/adminApi";

export default function PropertyVerificationPage() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const [propertyForm, setPropertyForm] = useState<Record<string, { sakNumber: string }>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const { data: pendingProperties = [], isLoading: pendingPropertyLoading } = useGetPendingPropertiesQuery();
  const { data: verifiedProperties = [], isLoading: verifiedPropertyLoading } = useGetVerifiedPropertiesQuery();
  const [verifyProperty, { isLoading: verifyingProperty }] = useVerifyPropertyByAdminMutation();

  const handlePropertyVerify = async (property: any) => {
    const rowState = propertyForm[property.id] || { sakNumber: property?.sakNumber || "" };

    if (!rowState.sakNumber) {
      toast.error("Sak number is required before verification");
      return;
    }

    try {
      await verifyProperty({
        propertyId: property.id,
        adminId: admin?.id,
        isRegaVerified: true,
        sakNumber: rowState.sakNumber,
        notes: "Property verified by admin",
      }).unwrap();
      toast.success("Property verified successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify property");
    }
  };

  const filterProperties = (list: any[]) => {
    return list.filter((p) => {
      const title = p?.title?.toLowerCase() || "";
      const owner = (p?.user?.fullName || p?.ownerName || "").toLowerCase();
      const sak = (p?.sakNumber || "").toLowerCase();
      const search = searchQuery.toLowerCase();
      return title.includes(search) || owner.includes(search) || sak.includes(search);
    });
  };

  const filteredPending = filterProperties(pendingProperties);
  const filteredVerified = filterProperties(verifiedProperties);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Building2 className="h-8 w-8 text-emerald-500" />
            Property Verification
          </h1>
          <p className="text-zinc-400">Validate property ownership and REGA documentation for new listings.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search property, owner, or Sak..."
            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 transition-colors h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-zinc-900/60 border border-zinc-800 h-12 p-1">
            <TabsTrigger value="pending" className="px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Pending Review
              <Badge className="ml-2 bg-zinc-800 text-zinc-400 border-0">{pendingProperties.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified" className="px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verified Assets
              <Badge className="ml-2 bg-zinc-800 text-zinc-400 border-0">{verifiedProperties.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="mt-0">
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                    <TableHead className="pl-6 h-14 text-zinc-400 font-medium">Property Details</TableHead>
                    <TableHead className="h-14 text-zinc-400 font-medium">Owner / Listing Agent</TableHead>
                    <TableHead className="h-14 text-zinc-400 font-medium">Sak Verification</TableHead>
                    <TableHead className="text-right pr-6 h-14 text-zinc-400 font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPropertyLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-zinc-800 animate-pulse">
                        <TableCell colSpan={4} className="h-24"></TableCell>
                      </TableRow>
                    ))
                  ) : filteredPending.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Building className="h-12 w-12 text-zinc-700" />
                          <p className="text-zinc-400">No properties awaiting verification</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPending.map((property: any) => {
                      const rowState = propertyForm[property.id] || { sakNumber: property?.sakNumber || "" };
                      return (
                        <TableRow key={property?.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group">
                          <TableCell className="pl-6 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-24 relative rounded-lg overflow-hidden border border-zinc-800 group-hover:border-emerald-500/30 transition-colors bg-zinc-950 flex items-center justify-center">
                                {property?.images?.[0] ? (
                                  <img src={property?.images[0]} alt="" className="object-cover w-full h-full" />
                                ) : (
                                  <Building2 className="h-6 w-6 text-zinc-800" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{property?.title || "Untitled Asset"}</p>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Type: {property?.type?.replace(/_/g, ' ')}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={property?.user?.profileImage} />
                                <AvatarFallback className="bg-zinc-800 text-[10px]"><User className="h-3 w-3" /></AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-zinc-200">{property?.user?.fullName || property?.ownerName || "N/A"}</p>
                                <p className="text-[10px] text-zinc-500">{property?.user?.email || "No contact info"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="relative w-48">
                              <Input
                                value={rowState.sakNumber}
                                onChange={(e) =>
                                  setPropertyForm((prev) => ({
                                    ...prev,
                                    [property.id]: { sakNumber: e.target.value },
                                  }))
                                }
                                placeholder="Enter verified Sak #"
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 h-10 text-sm"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500 font-bold h-10 px-5 rounded-lg transition-all"
                              onClick={() => handlePropertyVerify(property)}
                              disabled={verifyingProperty}
                            >
                              Verify Asset
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                    <TableHead className="pl-6 h-14 text-zinc-400 font-medium">Property Details</TableHead>
                    <TableHead className="h-14 text-zinc-400 font-medium">Owner</TableHead>
                    <TableHead className="h-14 text-zinc-400 font-medium">Sak Number</TableHead>
                    <TableHead className="text-right pr-6 h-14 text-zinc-400 font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifiedPropertyLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-zinc-800 animate-pulse">
                        <TableCell colSpan={4} className="h-24"></TableCell>
                      </TableRow>
                    ))
                  ) : filteredVerified.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <ShieldCheck className="h-12 w-12 text-zinc-700" />
                          <p className="text-zinc-400">No verified properties found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVerified.map((property: any) => (
                      <TableRow key={property?.id} className="border-zinc-800 hover:bg-zinc-800/10 transition-colors group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 relative rounded overflow-hidden border border-zinc-800 group-hover:border-emerald-500/30 transition-colors bg-zinc-950 flex items-center justify-center">
                              {property?.images?.[0] ? (
                                <img src={property?.images[0]} alt="" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
                              ) : (
                                <Building2 className="h-4 w-4 text-zinc-800" />
                              )}
                            </div>
                            <span className="font-medium text-zinc-300 group-hover:text-emerald-400 transition-colors">{property?.title || "Untitled"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-400 text-sm">{property?.user?.fullName || property?.ownerName || "N/A"}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800 text-zinc-400">{property?.sakNumber || "N/A"}</code>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-bold">
                            <ShieldCheck className="h-3 w-3 mr-1.5" />
                            VERIFIED
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
