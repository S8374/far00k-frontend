"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetAllKycDocumentsByAdminQuery, useVerifyKycDocumentByAdminMutation } from "@/redux/api/adminApi";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck, Search, FileText, Eye, CheckCircle2, AlertCircle, UserX, User, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getStatus = (doc: any) => {
  const raw = doc?.status || doc?.verificationStatus || doc?.verifyStatus;
  if (raw) return String(raw).toUpperCase();
  if (doc?.isVerified === true) return "VERIFIED";
  if (doc?.isVerified === false) return "REJECTED";
  return "PENDING";
};

const getUserName = (doc: any) =>
  doc?.user?.fullName ||
  doc?.user?.name ||
  doc?.fullName ||
  doc?.name ||
  doc?.userName ||
  doc?.userId ||
  "Anonymous User";

const getDocumentId = (doc: any) =>
  doc?.documentUID ||
  doc?.documentId ||
  doc?.kycDocumentId ||
  doc?.uid ||
  doc?.id ||
  doc?._id ||
  null;

const getDocumentUrls = (doc: any): string[] => {
  const candidates = [
    doc?.fileUrl,
    doc?.url,
    doc?.documentUrl,
    doc?.imageUrl,
    doc?.frontImageUrl,
    doc?.backImageUrl,
    doc?.selfieUrl,
    doc?.passportUrl,
    doc?.nidFrontUrl,
    doc?.nidBackUrl,
  ];

  if (Array.isArray(doc?.files)) {
    for (const f of doc.files) {
      if (typeof f === "string") candidates.push(f);
      else candidates.push(f?.url, f?.fileUrl, f?.documentUrl);
    }
  }

  return candidates.filter((u): u is string => Boolean(u && typeof u === "string"));
};

const normalizeKycDocs = (data: any[]) => {
  const list = Array.isArray(data) ? data : [];
  const normalized: any[] = [];

  for (const item of list) {
    const nestedDocs = item?.documents || item?.kycDocuments || item?.docs;

    if (Array.isArray(nestedDocs) && nestedDocs.length > 0) {
      for (const nested of nestedDocs) {
        normalized.push({
          ...nested,
          user: nested?.user || item?.user,
          fullName: nested?.fullName || item?.fullName,
          userId: nested?.userId || item?.userId,
        });
      }
      continue;
    }

    normalized.push(item);
  }

  return normalized;
};

export default function KycVerificationPage() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const [kycNotes, setKycNotes] = useState<Record<string, string>>({});
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserGroup, setSelectedUserGroup] = useState<any | null>(null);
  const [processingDocumentIds, setProcessingDocumentIds] = useState<Record<string, boolean>>({});
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileLabel, setPreviewFileLabel] = useState("KYC Document");

  const {
    data: allKycDocs = [],
    isLoading: pendingKycLoading,
    refetch: refetchAllKycDocs,
  } = useGetAllKycDocumentsByAdminQuery();
  const [verifyKyc, { isLoading: verifyingKyc }] = useVerifyKycDocumentByAdminMutation();

  const groupedUsers = useMemo(() => {
    const keyword = searchUser.trim().toLowerCase();
    const list = normalizeKycDocs(allKycDocs);
    const groupedMap = new Map<string, { userName: string; userId: string; user: any; documents: any[] }>();

    for (const doc of list) {
      const userName = String(getUserName(doc));
      const user = doc?.user || {};
      const rawUserId = user?.id || user?._id || doc?.userId || doc?.email || user?.email || userName;

      const userId = String(rawUserId || userName);
      const key = userId.toLowerCase();

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          userName,
          userId,
          user,
          documents: [],
        });
      }

      groupedMap.get(key)?.documents.push(doc);
    }

    const groups = Array.from(groupedMap.values()).sort((a, b) =>
      a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
    );

    if (!keyword) return groups;

    return groups.filter((group) => group.userName.toLowerCase().includes(keyword));
  }, [allKycDocs, searchUser]);

  const handleKycAction = async (doc: any, isApproved: boolean) => {
    const docId = getDocumentId(doc);

    if (!docId) {
      toast.error("KYC document id not found");
      return;
    }

    if (!admin?.id) {
      toast.error("Admin session not ready");
      return;
    }

    try {
      const docIdKey = String(docId);
      setProcessingDocumentIds((prev) => ({ ...prev, [docIdKey]: true }));

      const noteText = kycNotes[docId] || "";
      const rejectionReason = isApproved ? undefined : noteText || "Rejected by admin";

      await verifyKyc({
        documentId: docId,
        adminId: admin?.id,
        status: isApproved ? "VERIFIED" : "REJECTED",
        notes: noteText || (isApproved ? "KYC approved" : "KYC rejected"),
        rejectionReason,
      }).unwrap();

      setSelectedUserGroup((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          documents: (prev.documents || []).map((item: any) => {
            const itemId = getDocumentId(item);
            if (String(itemId) !== docIdKey) return item;

            return {
              ...item,
              status: isApproved ? "VERIFIED" : "REJECTED",
              verificationStatus: isApproved ? "VERIFIED" : "REJECTED",
              verifyStatus: isApproved ? "VERIFIED" : "REJECTED",
              isVerified: isApproved,
              rejectionReason: isApproved ? undefined : rejectionReason,
            };
          }),
        };
      });

      refetchAllKycDocs();
      toast.success(isApproved ? "KYC approved" : "KYC rejected");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update KYC status");
    } finally {
      const docIdKey = String(docId);
      setProcessingDocumentIds((prev) => {
        const next = { ...prev };
        delete next[docIdKey];
        return next;
      });
    }
  };

  const handleOpenFilePreview = (url: string, label?: string) => {
    setPreviewFileUrl(url);
    setPreviewFileLabel(label || "KYC Document");
    setIsFilePreviewOpen(true);
  };

  const getPreviewFileType = (url: string): "image" | "pdf" | "other" => {
    const lower = url.toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/.test(lower)) return "image";
    if (/\.pdf(\?|#|$)/.test(lower)) return "pdf";
    return "other";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            KYC Verification
          </h1>
          <p className="text-zinc-400">Validate user identities and secure document uploads across the platform.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search by user name or ID..."
            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 transition-colors h-11"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-2xl">
        <CardHeader className="border-b border-zinc-800 px-6 py-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-500" />
              Identity Queue
            </CardTitle>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1">
              {groupedUsers.length} Users with Docs
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/20">
                  <TableHead className="text-zinc-400 font-medium h-14 pl-6">User Profile</TableHead>
                  <TableHead className="text-zinc-400 font-medium h-14">Document Stats</TableHead>
                  <TableHead className="text-zinc-400 font-medium h-14">Status Distribution</TableHead>
                  <TableHead className="text-right pr-6 h-14">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingKycLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-zinc-800 animate-pulse">
                      <TableCell colSpan={4} className="h-20"></TableCell>
                    </TableRow>
                  ))
                ) : groupedUsers.length === 0 ? (
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableCell colSpan={4} className="h-[300px] text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <UserX className="h-10 w-10 text-zinc-700" />
                        <p className="text-zinc-500">No KYC submissions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  groupedUsers.map((group: any) => {
                    const docs = group.documents;
                    const pending = docs.filter((d: any) => getStatus(d) === "PENDING").length;
                    const verified = docs.filter((d: any) => getStatus(d) === "VERIFIED").length;
                    const rejected = docs.filter((d: any) => getStatus(d) === "REJECTED").length;

                    return (
                      <TableRow key={group.userId} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group">
                        <TableCell className="pl-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-zinc-800 shadow-sm">
                              <AvatarImage src={group.user?.profileImage} />
                              <AvatarFallback className="bg-zinc-800 text-zinc-500"><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{group.userName}</p>
                              <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">{group.userId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-zinc-500" />
                            <span className="text-sm font-medium text-zinc-300">{docs.length} Total</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {pending > 0 && <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 text-[10px] h-5 px-1.5">{pending} Pending</Badge>}
                            {verified > 0 && <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[10px] h-5 px-1.5">{verified} Verified</Badge>}
                            {rejected > 0 && <Badge variant="outline" className="bg-red-500/5 text-red-500 border-red-500/20 text-[10px] h-5 px-1.5">{rejected} Rejected</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 h-9 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all"
                            onClick={() => setSelectedUserGroup(group)}
                          >
                            Approved Doc
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

      {/* DOCUMENT REVIEW DIALOG */}
      <Dialog
        open={Boolean(selectedUserGroup)}
        onOpenChange={(open) => { if (!open) setSelectedUserGroup(null); }}
      >
        <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-white rounded-2xl shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/30">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedUserGroup?.user?.profileImage} />
                <AvatarFallback className="bg-zinc-800 text-[10px]">{selectedUserGroup?.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              Verification Portfolio: {selectedUserGroup?.userName}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6 custom-scrollbar">
            {(selectedUserGroup?.documents || []).map((doc: any) => {
              const docId = getDocumentId(doc);
              const status = getStatus(doc);
              const urls = getDocumentUrls(doc);
              const isVerified = status === "VERIFIED";
              const isRejected = status === "REJECTED";
              const isProcessing = docId ? Boolean(processingDocumentIds[String(docId)]) : false;

              return (
                <div key={docId} className={`rounded-xl border p-5 transition-all ${isVerified ? 'bg-emerald-500/5 border-emerald-500/20' : isRejected ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-900/40 border-zinc-800'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        {doc?.documentType || "ID Document"}
                      </h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Ref: {docId?.slice(-10)}</p>
                    </div>
                    <Badge className={`px-3 py-1 font-bold ${isVerified ? 'bg-emerald-500' : isRejected ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="space-y-3">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Evidence Links</p>
                      <div className="flex flex-wrap gap-2">
                        {urls.map((url, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenFilePreview(url, `${doc?.documentType || 'Doc'} Part ${idx + 1}`)}
                            className="h-8 border-zinc-800 hover:border-emerald-500 text-[11px] font-bold gap-2"
                          >
                            <Eye className="h-3 w-3" /> Proof {urls.length > 1 ? idx + 1 : ""}
                          </Button>
                        ))}
                        {urls.length === 0 && <p className="text-xs text-zinc-600 italic">No files attached</p>}
                      </div>
                    </div>
                    {/* <div className="space-y-2">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase px-1">Auditor Feedback</p>
                        <Textarea
                          value={docId ? kycNotes[docId] || "" : ""}
                          onChange={(e) => docId && setKycNotes(p => ({ ...p, [docId]: e.target.value }))}
                          placeholder={isVerified ? "Approval notes..." : "Reason for rejection..."}
                          className="min-h-[60px] bg-zinc-950 border-zinc-800 text-xs focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                        />
                    </div> */}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/50">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold px-5 h-8 rounded-lg"
                      onClick={() => handleKycAction(doc, true)}
                      disabled={verifyingKyc || isProcessing || isVerified || isRejected}
                    >
                      {isProcessing ? "Authorizing..." : "Authorize"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-500 font-bold px-5 h-8 rounded-lg"
                      onClick={() => handleKycAction(doc, false)}
                      disabled={verifyingKyc || isProcessing || isVerified || isRejected}
                    >
                      {isProcessing ? "Saving..." : "Decline"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
            <Button variant="ghost" onClick={() => setSelectedUserGroup(null)} className="text-zinc-400 hover:text-white">Close Portfolio</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-white rounded-2xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="px-6 py-4 border-b border-zinc-800">
            <DialogTitle className="flex items-center gap-2"><Eye className="h-4 w-4 text-emerald-500" /> {previewFileLabel}</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            {previewFileUrl ? (
              <div className="relative group">
                {getPreviewFileType(previewFileUrl) === "image" ? (
                  <img src={previewFileUrl} alt="" className="max-h-[75vh] w-full rounded-xl object-contain bg-zinc-900/50" />
                ) : (
                  <iframe src={previewFileUrl} title="" className="h-[75vh] w-full rounded-xl border border-zinc-800 bg-white" />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <a href={previewFileUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" className="bg-black/60 hover:bg-black backdrop-blur-md border border-white/10 h-8 gap-2">
                      <ExternalLink className="h-3 w-3" /> Full Size
                    </Button>
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
