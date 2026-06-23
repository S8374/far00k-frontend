"use client";

import { useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetUsersListQuery,
  useUpdateAdminUserStatusMutation,
  useDeleteUserByAdminMutation,
  useGetAdminUserDetailsQuery
} from "@/redux/api/adminApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Ban,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const STATUS_CONFIG: any = {
  ACTIVE: { label: "Active", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: UserCheck },
  PENDING_VERIFICATION: { label: "Pending", className: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Shield },
  BANNED: { label: "Banned", className: "bg-red-500/10 text-red-500 border-red-500/20", icon: Ban },
  DELETED: { label: "Deleted", className: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", icon: Trash2 },
  INACTIVE: { label: "Inactive", className: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", icon: UserMinus },
};

const ROLE_CONFIG: any = {
  ADMIN: { label: "Admin", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  AGENT: { label: "Agent", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  BUYER: { label: "Buyer", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
};

export default function UserManagementPage() {
  const { data: meData } = useGetMeQuery({});
  const adminUser = meData?.data?.data || meData?.data;
  const adminId = adminUser?.id;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: usersResponse, isLoading: usersLoading } = useGetUsersListQuery(
    {
      adminId: adminId || "",
      page,
      limit: 10,
      search,
      role: roleFilter === "ALL" ? undefined : roleFilter,
      status: statusFilter === "ALL" ? undefined : statusFilter
    },
    { skip: !adminId }
  );

  const [updateStatus, { isLoading: updatingStatus }] = useUpdateAdminUserStatusMutation();
  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserByAdminMutation();

  const { data: userDetailResponse, isLoading: detailLoading } = useGetAdminUserDetailsQuery(
    selectedUserId || "",
    { skip: !selectedUserId || !detailOpen }
  );

  const usersData = usersResponse?.data || usersResponse;
  const users = usersData?.data || [];
  const stats = usersData?.stats || { totalUsers: 0, activeUsers: 0, bannedUsers: 0, pendingUsers: 0 };
  const meta = usersData?.meta || { totalPages: 1, total: 0 };

  const userDetail = userDetailResponse?.data?.data || userDetailResponse?.data || userDetailResponse;

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      await updateStatus({ userId, status }).unwrap();
      toast.success(`User status updated to ${status.toLowerCase()}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const viewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Premium Header with Stats */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Users className="h-8 w-8 text-emerald-500" />
              User Management
            </h1>
            <p className="text-zinc-400">Command center for controlling user access, roles, and platform integrity.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
            {[
              { label: "Total", value: stats.totalUsers, color: "text-blue-500" },
              { label: "Active", value: stats.activeUsers, color: "text-emerald-500" },
              { label: "Banned", value: stats.bannedUsers, color: "text-red-500" },
              { label: "Pending", value: stats.pendingUsers, color: "text-amber-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-950/40 border border-zinc-800/50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
        <CardHeader className="border-b border-zinc-800 px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="pl-10 w-full md:w-64 bg-zinc-950/50 border-zinc-800 focus:border-emerald-500/50 text-white rounded-xl h-10 transition-all"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px] bg-zinc-950/50 border-zinc-800 text-white rounded-xl h-10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="AGENT">Agent</SelectItem>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-zinc-950/50 border-zinc-800 text-white rounded-xl h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING_VERIFICATION">Pending</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                  <TableHead className="text-zinc-500 font-bold h-14 pl-6">Entity Profile</TableHead>
                  <TableHead className="text-zinc-500 font-bold h-14">Contact Layer</TableHead>
                  <TableHead className="text-zinc-500 font-bold h-14">Authorization</TableHead>
                  <TableHead className="text-zinc-500 font-bold h-14">Integrity State</TableHead>
                  <TableHead className="text-right px-6 py-4 h-14">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-zinc-800 h-20 animate-pulse">
                      <TableCell colSpan={5} />
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={48} className="text-zinc-800" />
                        <p className="text-zinc-500 font-bold">No matching personnel found</p>
                        <Button variant="link" onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }} className="text-emerald-500 font-bold">Reset Filters</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: any) => {
                    const status = STATUS_CONFIG[user.status] || STATUS_CONFIG.ACTIVE;
                    const role = ROLE_CONFIG[user.role] || { label: user.role, className: "bg-zinc-500/10 text-zinc-400" };

                    return (
                      <TableRow key={user.id} className="border-zinc-800 group hover:bg-zinc-800/20 transition-colors">
                        <TableCell className="pl-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-zinc-800 shadow-xl group-hover:border-emerald-500/30 transition-colors">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback className="bg-zinc-900 text-zinc-500 font-black">{user.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{user.fullName || "Incognito"}</p>
                              <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">UID: {user.id.substring(0, 12).toUpperCase()}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-zinc-300">{user.email}</p>
                            {user.phoneNumber && <p className="text-[10px] text-zinc-600 font-bold">{user.phoneNumber}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-black border-0 bg-opacity-10 py-1 ${role.className}`}>
                            {role.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${status.className}`}>
                            <status.icon size={12} />
                            {status.label}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white/5 rounded-xl transition-all">
                                <MoreHorizontal size={18} className="text-zinc-500 group-hover:text-white" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300 p-2 rounded-2xl shadow-2xl">
                              <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-zinc-500">Personnel Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-zinc-800" />

                              <DropdownMenuItem onClick={() => viewDetails(user.id)} className="rounded-xl focus:bg-emerald-500 focus:text-white px-3 py-2.5 cursor-pointer flex gap-3 font-bold text-sm transition-all">
                                <Eye size={16} /> View Profile
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-zinc-800" />

                              {user.status !== "ACTIVE" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "ACTIVE")} className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-500 px-3 py-2.5 cursor-pointer flex gap-3 font-bold text-sm">
                                  <UserCheck size={16} /> Restore Active
                                </DropdownMenuItem>
                              )}

                              {user.status !== "BANNED" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "BANNED")} className="rounded-xl focus:bg-red-500/10 focus:text-red-500 px-3 py-2.5 cursor-pointer flex gap-3 font-bold text-sm">
                                  <Ban size={16} /> Restrict/Ban
                                </DropdownMenuItem>
                              )}



                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <div className="p-6 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/20">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Scan result: <span className="text-white">{meta.total}</span> Personnel entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-20 rounded-xl h-10 w-10"
            >
              <ChevronLeft size={18} />
            </Button>
            <div className="bg-zinc-900 border border-zinc-800 text-white h-10 px-5 flex items-center justify-center rounded-xl text-sm font-black">
              {page} <span className="mx-2 text-zinc-600">/</span> {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-20 rounded-xl h-10 w-10"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </Card>

      {/* User Details Modal - Premium Overhaul */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-3xl rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          {detailLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Cloud Profile...</p>
            </div>
          ) : userDetail ? (
            <div className="animate-in slide-in-from-bottom-8 duration-500">
              <div className="h-40 bg-gradient-to-br from-emerald-600/20 via-zinc-900 to-blue-600/20 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute -bottom-14 left-10 h-28 w-28 rounded-[2rem] border-4 border-zinc-950 bg-zinc-800 overflow-hidden shadow-2xl">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={userDetail.avatarUrl} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black text-zinc-500">{userDetail.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="pt-20 px-10 pb-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{userDetail.fullName}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={`font-black border-0 bg-opacity-20 px-3 py-1 ${ROLE_CONFIG[userDetail.role]?.className}`}>
                        {ROLE_CONFIG[userDetail.role]?.label}
                      </Badge>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                        <Mail size={14} className="text-emerald-500" />
                        {userDetail.email}
                      </div>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border-0 bg-opacity-10 text-[10px] font-black uppercase tracking-[0.2em] ${STATUS_CONFIG[userDetail.status]?.className}`}>
                    <CheckCircle2 size={14} />
                    {STATUS_CONFIG[userDetail.status]?.label}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 py-8 border-y border-zinc-800/50">
                  {[
                    { label: "Messages Sent", val: userDetail._count?.sentMessages || 0 },
                    { label: "Saved Listings", val: userDetail._count?.savedListings || 0 },
                    { label: "KYC Submissions", val: userDetail.kycDocuments?.length || 0 }
                  ].map((x, i) => (
                    <div key={i} className="text-center group">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2 group-hover:text-emerald-500 transition-colors">{x.label}</p>
                      <p className="text-3xl font-black text-white">{x.val}</p>
                    </div>
                  ))}
                </div>

                {userDetail.agentProfile && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <div className="h-px bg-zinc-800 flex-1" />
                      Agent Verification Data
                      <div className="h-px bg-zinc-800 flex-1" />
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Official License</p>
                        <p className="text-sm font-bold text-white font-mono">{userDetail.agentProfile.licenseId || "UNLICENSED"}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Agency Brand</p>
                        <p className="text-sm font-bold text-white">{userDetail.agentProfile.agencyName || "INDEPENDENT"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1 bg-zinc-900 border-zinc-800 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs hover:bg-zinc-800" onClick={() => setDetailOpen(false)}>
                    Close Dossier
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/40" onClick={() => { setDetailOpen(false); handleDeleteUser(userDetail.id); }}>
                    Purge Identity
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
