"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, UserCheck, Search, Building2, CreditCard, UserX, CheckCircle2 } from "lucide-react";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPendingAgentsQuery,
  useVerifyAgentByAdminMutation,
  useGetAgentStatsQuery,
  useGetAllAgentsByAdminQuery
} from "@/redux/api/adminApi";
import { Clock } from "lucide-react";

type VerifyAgentFormState = {
  isRegaVerified: boolean;
  isNafathVerified: boolean;
};

const extractArrayResponse = (response: unknown): any[] => {
  if (Array.isArray(response)) return response;

  if (response && typeof response === "object") {
    const wrapped = response as { data?: { data?: any[] } | any[] };

    if (Array.isArray(wrapped?.data)) return wrapped.data;
    if (Array.isArray((wrapped?.data as { data?: any[] })?.data)) {
      return (wrapped.data as { data?: any[] }).data || [];
    }
  }

  return [];
};

const extractObjectResponse = (response: unknown): Record<string, any> => {
  if (!response || typeof response !== "object" || Array.isArray(response)) return {};

  const wrapped = response as { data?: { data?: Record<string, any> } | Record<string, any> };
  const dataLevel = wrapped?.data;

  if (dataLevel && typeof dataLevel === "object" && !Array.isArray(dataLevel)) {
    const nested = (dataLevel as { data?: Record<string, any> }).data;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested;
    return dataLevel as Record<string, any>;
  }

  return wrapped as Record<string, any>;
};

export default function AgentVerificationPage() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const { data: pendingAgentsResponse, isLoading: pendingLoading } = useGetPendingAgentsQuery();
  const { data: allAgentsResponse, isLoading: allLoading } = useGetAllAgentsByAdminQuery(
    { adminId: admin?.id || "" },
    { skip: !admin?.id }
  );
  const { data: statsResponse } = useGetAgentStatsQuery(
    { adminId: admin?.id || "" },
    { skip: !admin?.id }
  );
  const [verifyAgent, { isLoading: verifying }] = useVerifyAgentByAdminMutation();

  const stats = extractObjectResponse(statsResponse);
  const pendingAgents = extractArrayResponse(pendingAgentsResponse);
  const allAgents = extractArrayResponse(allAgentsResponse);

  const verifiedAgents = allAgents.filter((a: any) =>
    a?.agentProfile?.isRegaVerified && a?.agentProfile?.isNafathVerified
  );

  const [formByAgent, setFormByAgent] = useState<Record<string, VerifyAgentFormState>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const getForm = (agentId: string): VerifyAgentFormState => {
    return (
      formByAgent[agentId] || {
        isRegaVerified: true,
        isNafathVerified: true,
      }
    );
  };

  const updateForm = (agentId: string, patch: Partial<VerifyAgentFormState>) => {
    const prev = getForm(agentId);
    setFormByAgent((state) => ({
      ...state,
      [agentId]: { ...prev, ...patch },
    }));
  };

  const handleVerify = async (agent: any) => {
    const agentId = agent?.userId || agent?.user?.id || agent?.id;
    if (!agentId) {
      toast.error("Agent ID not found");
      return;
    }

    const form = getForm(agentId);

    try {
      await verifyAgent({
        agentId,
        adminId: admin?.id,
        isRegaVerified: form.isRegaVerified,
        isNafathVerified: form.isNafathVerified,
        notes: "Verified by admin",
      }).unwrap();
      toast.success("Agent verified successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify agent");
    }
  };

  const filterAgents = (list: any[]) => {
    return list.filter((agent: any) => {
      const fullName = (agent?.user?.fullName || agent?.fullName || "").toLowerCase();
      const email = (agent?.user?.email || agent?.email || "").toLowerCase();
      const agency = (agent?.agencyName || agent?.agentProfile?.agencyName || "").toLowerCase();
      const search = searchQuery.toLowerCase();
      return fullName.includes(search) || email.includes(search) || agency.includes(search);
    });
  };

  const filteredPending = filterAgents(pendingAgents);
  const filteredVerified = filterAgents(verifiedAgents);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              Agent Verification
            </h1>
            <p className="text-zinc-400">Manage and authenticate real estate professionals entering the platform.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
            {[
              { label: "Total", value: stats.totalAgents || 0, color: "text-blue-500" },
              { label: "Rega Verified", value: stats.regaVerified || 0, color: "text-emerald-500" },
              { label: "Nafath Verified", value: stats.nafathVerified || 0, color: "text-purple-500" },
              { label: "Unverified", value: stats.unverifiedCount || 0, color: "text-amber-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-950/40 border border-zinc-800/50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-zinc-900/60 border border-zinc-800 h-12 p-1">
            <TabsTrigger value="pending" className="px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Pending
              <Badge className="ml-2 bg-zinc-800 text-zinc-400 border-0">{pendingAgents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified" className="px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verified
              <Badge className="ml-2 bg-zinc-800 text-zinc-400 border-0">{verifiedAgents.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search agent, email, or agency..."
              className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 transition-colors h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
            <CardHeader className="border-b border-zinc-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-500" />
                  Verification Queue
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                      <TableHead className="text-zinc-400 font-medium h-14 pl-6">Agent Identity</TableHead>
                      <TableHead className="text-zinc-400 font-medium h-14">Agency & Credentials</TableHead>
                      <TableHead className="text-zinc-400 font-medium h-14">Current Status</TableHead>
                      <TableHead className="text-zinc-400 font-medium h-14">Validation Control</TableHead>
                      <TableHead className="text-right pr-6 h-14">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-zinc-800 animate-pulse">
                          <TableCell colSpan={5} className="h-24"></TableCell>
                        </TableRow>
                      ))
                    ) : filteredPending.length === 0 ? (
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableCell colSpan={5} className="h-[300px] text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                              <UserX className="h-8 w-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-400">No pending agents found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPending.map((agent: any) => {
                        const agentId = agent?.userId || agent?.user?.id || agent?.id;
                        const form = getForm(agentId);
                        const profile = agent?.agentProfile || agent;
                        const user = agent?.user || agent;

                        return (
                          <TableRow key={agentId} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group">
                            <TableCell className="pl-6 py-6">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                                  <AvatarImage src={user?.profileImage || user?.avatarUrl} />
                                  <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                                    {user?.fullName?.charAt(0) || "A"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                  <p className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                                    {user?.fullName || "Anonymous Agent"}
                                  </p>
                                  <p className="text-sm text-zinc-400">
                                    {user?.email || "No email provided"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-zinc-200">
                                  <Building2 className="h-4 w-4 text-emerald-500/70" />
                                  <span className="font-medium">{profile?.agencyName || "Independent"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                  <CreditCard className="h-3.5 w-3.5" />
                                  <span>Lic: <span className="text-zinc-300">{profile?.licenseId || "N/A"}</span></span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between w-32 bg-zinc-950/40 rounded-full px-2.5 py-1 border border-zinc-800">
                                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">REGA</span>
                                  <Badge className={`h-1.5 w-1.5 rounded-full p-0 min-w-0 ${profile?.isRegaVerified ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"}`} />
                                  <span className={`text-[10px] font-bold ${profile?.isRegaVerified ? "text-emerald-500" : "text-amber-500"}`}>
                                    {profile?.isRegaVerified ? "Verified" : "Pending"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between w-32 bg-zinc-950/40 rounded-full px-2.5 py-1 border border-zinc-800">
                                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">NAFATH</span>
                                  <Badge className={`h-1.5 w-1.5 rounded-full p-0 min-w-0 ${profile?.isNafathVerified ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"}`} />
                                  <span className={`text-[10px] font-bold ${profile?.isNafathVerified ? "text-emerald-500" : "text-amber-500"}`}>
                                    {profile?.isNafathVerified ? "Verified" : "Pending"}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={form.isRegaVerified}
                                    onCheckedChange={(val) => updateForm(agentId, { isRegaVerified: val })}
                                    className="data-[state=checked]:bg-emerald-600"
                                  />
                                  <span className="text-xs font-medium text-zinc-300">Auth REGA</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={form.isNafathVerified}
                                    onCheckedChange={(val) => updateForm(agentId, { isNafathVerified: val })}
                                    className="data-[state=checked]:bg-emerald-600"
                                  />
                                  <span className="text-xs font-medium text-zinc-300">Auth NAFATH</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-xl transition-all"
                                onClick={() => handleVerify(agent)}
                                disabled={verifying}
                              >
                                {verifying ? "Processing..." : "Update"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
            <CardHeader className="border-b border-zinc-800 px-6 py-5">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Verified Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                      <TableHead className="text-zinc-400 font-medium h-14 pl-6">Agent Identity</TableHead>
                      <TableHead className="text-zinc-400 font-medium h-14">Agency</TableHead>
                      <TableHead className="text-zinc-400 font-medium h-14">Performance</TableHead>
                      <TableHead className="text-right pr-6 h-14">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-zinc-800 animate-pulse">
                          <TableCell colSpan={4} className="h-24"></TableCell>
                        </TableRow>
                      ))
                    ) : filteredVerified.length === 0 ? (
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableCell colSpan={4} className="h-[300px] text-center">
                          <p className="text-zinc-500">No verified agents yet</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVerified.map((agent: any) => {
                        const user = agent; // AdminAgentService returns User objects with agentProfile
                        const profile = user.agentProfile;
                        return (
                          <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/10 transition-colors">
                            <TableCell className="pl-6 py-5">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user?.avatarUrl} />
                                  <AvatarFallback className="bg-zinc-800">{user?.fullName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-white">{user?.fullName}</p>
                                  <p className="text-[10px] text-zinc-500">{user?.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-300 text-sm">{profile?.agencyName || "Independent"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-4 text-xs">
                                <div className="text-center">
                                  <p className="text-zinc-500 uppercase text-[9px] font-bold">Properties</p>
                                  <p className="text-white font-bold">{user?.stats?.totalProperties || 0}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-zinc-500 uppercase text-[9px] font-bold">Verified</p>
                                  <p className="text-emerald-500 font-bold">{user?.stats?.verifiedProperties || 0}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-bold">
                                <ShieldCheck className="h-3 w-3 mr-1.5" />
                                FULLY VERIFIED
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
