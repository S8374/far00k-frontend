"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPendingMilestonePaymentsByAdminQuery,
  useVerifyMilestonePaymentByAdminMutation,
} from "@/redux/api/adminApi";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CheckCircle2, FileText, User, Home, Info, MoreVertical, ExternalLink, CreditCard, Search, Building2 } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const formatCurrency = (amount: number, currency = "SAR") => {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
};

export default function VerifyPaymentPage() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const [activeTab, setActiveTab] = useState<string>("PENDING");

  const [notesByPayment, setNotesByPayment] = useState<Record<string, string>>({});
  const [rejectionReasonByPayment, setRejectionReasonByPayment] = useState<Record<string, string>>({});
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<any>(null);
  const [isMilestoneDetailsOpen, setIsMilestoneDetailsOpen] = useState(false);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: paymentsData = [],
    isLoading: paymentsLoading,
  } = useGetPendingMilestonePaymentsByAdminQuery(
    {
      adminId: admin?.id || "",
      status: activeTab === "PENDING" ? "AGENT_REVIEWED" : "VERIFIED"
    },
    { skip: !admin?.id }
  );

  const payments = Array.isArray(paymentsData) ? paymentsData : [];

  const [verifyPayment, { isLoading: verifyingPayment }] = useVerifyMilestonePaymentByAdminMutation();
  const [activeActionByPayment, setActiveActionByPayment] = useState<Record<string, "APPROVE" | "REJECT" | null>>({});

  const handleVerify = async (payment: any, approve: boolean) => {
    const paymentId = payment?.id || payment?._id || payment?.paymentId;

    if (!paymentId) {
      toast.error("Invalid payment request");
      return;
    }

    const rejectionReason = rejectionReasonByPayment[paymentId]?.trim() || "";
    if (!approve && !rejectionReason) {
      toast.error("Please provide a rejection reason before rejecting.");
      return;
    }

    try {
      await verifyPayment({
        paymentId,
        adminId: admin?.id,
        approve,
        notes: notesByPayment[paymentId] || (approve ? "Payment verified" : "Payment rejected"),
        ...(!approve ? { rejectionReason } : {}),
      }).unwrap();

      toast.success(approve ? "Payment approved" : "Payment rejected");
      setActiveActionByPayment((prev) => ({ ...prev, [paymentId]: null }));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify payment");
    }
  };

  const filteredPayments = payments.filter((p: any) => {
    const property = (p?.milestone?.plan?.property?.title || "").toLowerCase();
    const buyer = (p?.buyer?.fullName || p?.buyer?.name || p?.user?.fullName || "").toLowerCase();
    const milestone = (p?.milestone?.tittle || p?.milestone?.title || "").toLowerCase();
    const search = searchQuery.toLowerCase();
    return property.includes(search) || buyer.includes(search) || milestone.includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-emerald-500" />
            Verify Payment
          </h1>
          <p className="text-zinc-400">Review and authorize pending milestone payment requests from buyers.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search property, buyer, or milestone..."
            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 transition-colors h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="PENDING" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900/60 border border-zinc-800 h-12 p-1 mb-6">
          <TabsTrigger value="PENDING" className="px-8 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold transition-all">
            <Clock className="w-4 h-4 mr-2" />
            Pending Action
          </TabsTrigger>
          <TabsTrigger value="VERIFIED" className="px-8 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold transition-all">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Verified History
          </TabsTrigger>
        </TabsList>

        <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
          <CardHeader className="border-b border-zinc-800 px-6 py-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                {activeTab === "PENDING" ? (
                  <>
                    <Clock className="h-5 w-5 text-amber-500" />
                    Pending Settlements
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Verified Settlements
                  </>
                )}
              </CardTitle>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1">
                {filteredPayments.length} {activeTab === "PENDING" ? "Requests Awaiting Action" : "Successfully Verified"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                    <TableHead className="text-zinc-400 font-medium h-14 pl-6">Property Context</TableHead>
                    <TableHead className="text-zinc-400 font-medium h-14">Buyer Entity</TableHead>
                    <TableHead className="text-zinc-400 font-medium h-14">Milestone Detail</TableHead>
                    <TableHead className="text-zinc-400 font-medium h-14 text-right pr-6">Settlement Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-zinc-800 animate-pulse">
                        <TableCell colSpan={4} className="h-24"></TableCell>
                      </TableRow>
                    ))
                  ) : filteredPayments.length === 0 ? (
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableCell colSpan={4} className="h-[400px] text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-medium text-white">Queue is empty</p>
                            <p className="text-zinc-400 max-w-[250px]">No pending payment requests match your current search.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment: any) => {
                      const paymentId = payment?.id || payment?._id || payment?.paymentId;
                      const propertyTitle = payment?.milestone?.plan?.property?.title || "Property N/A";
                      const buyerName = payment?.buyer?.fullName || payment?.buyer?.name || payment?.user?.fullName || "Buyer N/A";
                      const milestoneName = payment?.milestone?.tittle || payment?.milestone?.title || "Milestone N/A";
                      const amount = payment?.amountPaid || payment?.amount || 0;
                      const currency = payment?.currency || "SAR";
                      const activeAction = activeActionByPayment[paymentId];

                      return (
                        <TableRow key={paymentId} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group">
                          <TableCell className="pl-6 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                                <Home className="h-5 w-5 text-zinc-500" />
                              </div>
                              <div>
                                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate max-w-[180px]">{propertyTitle}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">ID: {paymentId.slice(-8).toUpperCase()}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-zinc-800">
                                <AvatarFallback className="bg-zinc-800 text-[10px] text-zinc-400">{buyerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-zinc-200">{buyerName}</p>
                                <p className="text-[10px] text-zinc-500">{payment?.buyer?.email || "Buyer contact N/A"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-300">{milestoneName}</span>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px] px-1.5 h-4">
                                  {formatCurrency(amount, currency)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => { setSelectedPaymentForDetails(payment); setIsMilestoneDetailsOpen(true); }}
                                  className="text-[10px] text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors font-bold underline-offset-4 hover:underline"
                                >
                                  <Eye className="h-3 w-3" /> View Audit Evidence
                                </button>
                                <button
                                  onClick={() => { setSelectedPaymentForDetails(payment); setIsPropertyDetailsOpen(true); }}
                                  className="text-[10px] text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors font-bold underline-offset-4 hover:underline"
                                >
                                  <Info className="h-3 w-3" /> Full Schedule
                                </button>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex flex-col items-end gap-2">
                              {activeTab === "VERIFIED" ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 font-black px-4 py-1.5 rounded-full">
                                  VERIFIED
                                </Badge>
                              ) : !activeAction ? (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="h-9 px-4 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition-all font-bold"
                                    onClick={() => setActiveActionByPayment(p => ({ ...p, [paymentId]: "APPROVE" }))}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-9 px-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 transition-all font-bold"
                                    onClick={() => setActiveActionByPayment(p => ({ ...p, [paymentId]: "REJECT" }))}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2 animate-in slide-in-from-right-4 duration-300">
                                  <Textarea
                                    value={activeAction === "APPROVE" ? (notesByPayment[paymentId] || "") : (rejectionReasonByPayment[paymentId] || "")}
                                    onChange={(e) => activeAction === "APPROVE"
                                      ? setNotesByPayment(prev => ({ ...prev, [paymentId]: e.target.value }))
                                      : setRejectionReasonByPayment(prev => ({ ...prev, [paymentId]: e.target.value }))
                                    }
                                    placeholder={activeAction === "APPROVE" ? "Internal approval note..." : "Mandatory rejection reason..."}
                                    className={`min-h-[60px] w-64 bg-zinc-950 border-zinc-800 text-xs focus:ring-1 ${activeAction === "APPROVE" ? "focus:border-emerald-500 ring-emerald-500/20" : "focus:border-red-500 ring-red-500/20"}`}
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      size="sm"
                                      className={`h-8 px-4 font-bold ${activeAction === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"}`}
                                      onClick={() => handleVerify(payment, activeAction === "APPROVE")}
                                      disabled={verifyingPayment}
                                    >
                                      {verifyingPayment ? "Processing..." : "Confirm Finalize"}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-zinc-500 hover:text-white"
                                      onClick={() => setActiveActionByPayment(p => ({ ...p, [paymentId]: null }))}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
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
      </Tabs>

      {/* RE-USING THE EXISTING DIALOGS WITH MINIMAL STYLING UPDATES */}
      <Dialog open={isMilestoneDetailsOpen} onOpenChange={setIsMilestoneDetailsOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 border-b border-zinc-800 pb-4 text-xl font-bold">
              <FileText className="w-5 h-5 text-emerald-500" />
              Audit Log: {selectedPaymentForDetails?.milestone?.tittle || "Payment Proof"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-6">
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-2 tracking-widest">Transaction Status</h4>
                <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 font-bold">
                  {selectedPaymentForDetails?.status?.replace(/_/g, ' ')}
                </Badge>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-3 tracking-widest flex items-center gap-2">
                  <Info className="h-3 w-3" /> Historical Notes
                </h4>
                <div className="text-xs text-zinc-400 space-y-4">
                  {selectedPaymentForDetails?.notes && (
                    <div className="border-l-2 border-emerald-500/30 pl-3 py-1">
                      <p className="text-[9px] text-emerald-500 font-bold uppercase mb-1">System/Admin</p>
                      <p className="italic leading-relaxed">{selectedPaymentForDetails.notes}</p>
                    </div>
                  )}
                  {selectedPaymentForDetails?.agentDocumentNote && (
                    <div className="border-l-2 border-blue-500/30 pl-3 py-1">
                      <p className="text-[9px] text-blue-500 font-bold uppercase mb-1">Agent Review</p>
                      <p className="italic leading-relaxed">{selectedPaymentForDetails.agentDocumentNote}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-1">Agent Documentation</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedPaymentForDetails?.agentDocumentUrls?.length > 0 ? (
                    selectedPaymentForDetails.agentDocumentUrls.map((url: string, idx: number) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group shadow-lg">
                        <img src={url} alt="" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all" />
                        <a href={url} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
                          <Button variant="outline" size="sm" className="border-white/20 text-white font-bold h-8">View Document</Button>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="h-24 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs italic">No agent documents</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-1">Buyer Payment Proof</h4>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {selectedPaymentForDetails?.proofUrls?.length > 0 ? (
                  selectedPaymentForDetails.proofUrls.map((url: string, idx: number) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group shadow-2xl">
                      <img src={url} alt="" className="w-full object-contain" />
                      <a href={url} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="outline" size="sm" className="border-white/20 text-white font-bold h-8">Full Audit View</Button>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs italic">No buyer evidence</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPropertyDetailsOpen} onOpenChange={setIsPropertyDetailsOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight">
              <Building2 className="w-6 h-6 text-blue-500" />
              Payment Schedule Overview
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 py-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 overflow-hidden relative group">
                <div className="aspect-square rounded-xl bg-zinc-950 mb-4 overflow-hidden border border-zinc-800">
                  {selectedPaymentForDetails?.milestone?.plan?.property?.images?.[0] ? (
                    <img src={selectedPaymentForDetails.milestone.plan.property.images[0]} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-10"><Building2 className="h-16 w-16" /></div>
                  )}
                </div>
                <h3 className="font-bold text-lg leading-tight mb-1">{selectedPaymentForDetails?.milestone?.plan?.property?.title || "Property N/A"}</h3>
                <p className="text-sm text-zinc-500 mb-4">{selectedPaymentForDetails?.milestone?.plan?.property?.addressLine || "Address Restricted"}</p>
                <p className="text-2xl font-bold text-emerald-500">{formatCurrency(selectedPaymentForDetails?.milestone?.plan?.property?.price || 0)}</p>
              </div>

              <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Buyer Identification</h5>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">{selectedPaymentForDetails?.buyer?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-zinc-100">{selectedPaymentForDetails?.buyer?.fullName}</p>
                    <p className="text-xs text-zinc-500">{selectedPaymentForDetails?.buyer?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                Execution Milestones
              </h4>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                {selectedPaymentForDetails?.milestone?.plan?.milestones?.length > 0 ? (
                  selectedPaymentForDetails.milestone.plan.milestones.sort((a: any, b: any) => a.milestoneOrder - b.milestoneOrder).map((m: any) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${m.id === selectedPaymentForDetails?.milestone?.id
                        ? "bg-emerald-600/10 border-emerald-500/40 shadow-xl shadow-emerald-500/5"
                        : "bg-zinc-900/30 border-zinc-800"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.id === selectedPaymentForDetails?.milestone?.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-zinc-800 text-zinc-500"
                          }`}>
                          {m.milestoneOrder}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${m.id === selectedPaymentForDetails?.milestone?.id ? "text-emerald-400" : "text-white"}`}>{m.tittle || "Phase Segment"}</p>
                          <p className="text-[10px] text-zinc-500 font-medium">Priority Sequence: {m.milestoneOrder}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">{formatCurrency(m.amount || 0)}</p>
                        {m.id === selectedPaymentForDetails?.milestone?.id && (
                          <Badge className="bg-emerald-600 h-4 text-[8px] font-bold uppercase tracking-tighter">Current</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20"><Info className="h-10 w-10 mb-2" /><p className="text-sm">No linked milestones</p></div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


