import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleAlert,
  Download,
  Eye,
  Shield,
  ShieldCheck,
  Lock,
  DollarSign,
  Layout,
  Calendar
} from 'lucide-react';
import {
  useUploadBuyerPaymentMutation,
  useReviewPaymentMutation,
  useUploadAgentDocumentMutation,
  useVerifyPaymentMutation,
  useMarkAsReadMutation
} from '@/redux/api/mileston.api';
import { useUploadImagesMutation } from '@/redux/api/uploade.api';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PaymentMilestonesProps {
  milestones: any[];
  propertyId: string;
  paymentPlanId: string;
  role: 'BUYER' | 'AGENT' | 'ADMIN';
  userId: string;
}

export default function PaymentMilestones({
  milestones,
  propertyId,
  paymentPlanId,
  role,
  userId
}: PaymentMilestonesProps) {
  const [uploadBuyerPayment] = useUploadBuyerPaymentMutation();
  const [reviewPayment] = useReviewPaymentMutation();
  const [uploadAgentDocument] = useUploadAgentDocumentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [uploadImages] = useUploadImagesMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetMilestone, setTargetMilestone] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Note View State
  const [isNotesViewOpen, setIsNotesViewOpen] = useState(false);
  const [viewNotesMilestone, setViewNotesMilestone] = useState<any>(null);

  // Document Viewer Modal State
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [viewDocumentUrls, setViewDocumentUrls] = useState<string[]>([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [viewDocumentType, setViewDocumentType] = useState<'pdf' | 'image' | 'document'>('document');

  const hasMilestones = milestones && milestones.length > 0;
  console.log(milestones)
  // Find active milestone
  const nextUnpaidOrder = hasMilestones
    ? [...milestones].sort((a, b) => a.order - b.order).find(m => m.paymentStatus !== 'VERIFIED')?.order
    : null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
      setIsNoteModalOpen(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0 || !targetMilestone) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const uploadRes: any = await uploadImages(formData).unwrap();

      // Extract URLs from the response
      let documentUrls: string[] = [];
      if (uploadRes?.data?.urls) {
        documentUrls = uploadRes.data.urls;
      } else if (Array.isArray(uploadRes?.urls)) {
        documentUrls = uploadRes.urls;
      } else {
        // Fallback to deep search if response is unusual
        const findUrlsDeep = (obj: any): string[] => {
          if (!obj) return [];
          if (typeof obj === 'string' && obj.startsWith('http')) return [obj];
          if (Array.isArray(obj)) return obj.flatMap(item => findUrlsDeep(item));
          if (typeof obj === 'object') {
            if (obj.urls) return obj.urls;
            if (obj.url) return [obj.url];
            return Object.values(obj).flatMap(val => findUrlsDeep(val));
          }
          return [];
        };
        documentUrls = findUrlsDeep(uploadRes);
      }

      if (documentUrls.length === 0) throw new Error("No document URLs received.");

      if (role === 'BUYER') {
        await uploadBuyerPayment({
          dto: {
            milestoneId: targetMilestone.id,
            propertyId,
            paymentplanId: paymentPlanId,
            amountPaid: targetMilestone.amount,
            proofUrls: documentUrls,
            notes: note || "Payment submitted",
          },
          buyerId: userId,
        }).unwrap();
        toast.success(`Payment submitted with ${documentUrls.length} file(s)`);
      } else if (role === 'AGENT') {
        if (!targetMilestone.paymentId) throw new Error("Payment ID not found");
        await uploadAgentDocument({
          paymentId: targetMilestone.paymentId,
          agentId: userId,
          agentDocumentUrls: documentUrls,
          notes: note,
        }).unwrap();
        toast.success(`Review completed with ${documentUrls.length} file(s)`);
      }
      setIsNoteModalOpen(false);
      setNote('');
      setSelectedFiles([]);
      setTargetMilestone(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewNotes = (m: any) => {
    setViewNotesMilestone(m);
    setIsNotesViewOpen(true);
  };

  const handleViewDocument = (url: string, allUrls?: string[]) => {
    const urls = allUrls || [url];
    const index = urls.indexOf(url);
    setViewDocumentUrls(urls);
    setCurrentDocIndex(index !== -1 ? index : 0);
    
    // Determine document type from URL
    const targetUrl = url;
    if (targetUrl.toLowerCase().includes('.pdf')) {
      setViewDocumentType('pdf');
    } else if (targetUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      setViewDocumentType('image');
    } else {
      setViewDocumentType('document');
    }
    setIsDocumentViewOpen(true);
  };

  const nextDoc = () => {
    const nextIdx = (currentDocIndex + 1) % viewDocumentUrls.length;
    setCurrentDocIndex(nextIdx);
    const url = viewDocumentUrls[nextIdx];
    if (url.toLowerCase().includes('.pdf')) setViewDocumentType('pdf');
    else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) setViewDocumentType('image');
    else setViewDocumentType('document');
  };

  const prevDoc = () => {
    const prevIdx = (currentDocIndex - 1 + viewDocumentUrls.length) % viewDocumentUrls.length;
    setCurrentDocIndex(prevIdx);
    const url = viewDocumentUrls[prevIdx];
    if (url.toLowerCase().includes('.pdf')) setViewDocumentType('pdf');
    else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) setViewDocumentType('image');
    else setViewDocumentType('document');
  };

  const handleDownloadDocument = async (url: string) => {
    try {
      if (!url) {
        toast.error('Document URL is missing');
        return;
      }

      console.log('Starting download from:', url);

      // Fetch the file as blob
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Blob received, size:', blob.size);

      // Extract filename
      let filename = 'document.pdf';
      const contentDisposition = response.headers.get('content-disposition');

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(["\']?)([^"\';]*)\1/);
        if (filenameMatch) {
          filename = filenameMatch[2];
        }
      } else {
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname;
          const urlFilename = pathname.split('/').pop();
          if (urlFilename && urlFilename.trim().length > 0) {
            filename = urlFilename.split('?')[0];
          }
        } catch (e) {
          console.warn('Could not parse filename from URL');
        }
      }

      // Create blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      link.setAttribute('target', '_self'); // Ensure no new tab

      document.body.appendChild(link);
      link.click();

      // Clean up immediately
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.success(`Downloaded: ${filename}`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Download failed: ${error.message}`);
    }
  };

  const handleMarkAsRead = async (m: any) => {
    if (!m.paymentId) return;
    try {
      await markAsRead({ paymentId: m.paymentId, userId, userRole: role }).unwrap();
      toast.success('Marked as read');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAsReceived = async (m: any) => {
    if (!m.paymentId) return;
    
    // Safety check: Ensure agent has uploaded proof
    if (!m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0)) {
      toast.error('You must upload a document proof before marking as received');
      return;
    }

    try {
      await reviewPayment({ paymentId: m.paymentId, agentId: userId, status: 'AGENT_REVIEWED' }).unwrap();
      toast.success('Milestone marked as received');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update review status');
    }
  };

  const handleAdminVerify = async (m: any) => {
    if (!m.paymentId) return;
    try {
      await markAsRead({ paymentId: m.paymentId, userId, userRole: role }).unwrap();
      await verifyPayment({ paymentId: m.paymentId, adminId: userId, status: 'VERIFIED' }).unwrap();
      toast.success('Verified');
    } catch (error: any) {
      toast.error('Failed to verify');
    }
  };

  return (
    <div className="text-white space-y-0 relative">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200">Payment Milestones</h2>

      <div className="relative pl-12 space-y-5">
        <div className="absolute left-5.75 top-4 bottom-8 w-px bg-white/10" />

        {milestones?.map((m: any, index: number) => {
          const isCompleted = m.paymentStatus === 'VERIFIED';
          const isRejected = String(m.paymentStatus || '').toUpperCase().includes('REJECT');
          const isPending = m.paymentStatus === 'PENDING' || m.paymentStatus === 'AGENT_REVIEWED';
          const isActive = m.order === nextUnpaidOrder;
          const isUpcoming = !isCompleted && !isPending && !isRejected && !isActive;

          return (
            <div key={m.id} className="relative group">
              {/* Timeline Icon */}
              <div className="absolute -left-13 top-1 z-10 transition-transform duration-300 group-hover:scale-105">
                {isCompleted ? (
                  <div className="w-9 h-9 bg-emerald-500/15 rounded-full border border-emerald-500/40 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : isActive || isPending ? (
                  <div className="w-9 h-9 bg-amber-500/15 rounded-full border border-amber-500/40 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-[#262626] rounded-full border border-white/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Milestone Card */}
              <div className={`ml-2 p-4 sm:p-5 rounded-xl border transition-all duration-500 ${isActive ? 'bg-[#1D2025] border-[#D0A700]' :
                  isCompleted || isPending ? 'bg-[#1D2025] border-white/10' :
                    'bg-[#1D2025]/60 border-white/10 opacity-70'
                }`}>

                {/* Header Row */}
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5 leading-snug">
                      {m.tittle} <span className="text-gray-500 text-[10px] sm:text-xs font-normal ml-1.5">Step {index + 1} of {milestones.length}</span>
                    </h3>
                    {isActive && <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed mt-1">{m.description || 'Proceed with this milestone payment'}</p>}
                  </div>
                  {isCompleted && <span className="text-[10px] bg-emerald-950/40 text-emerald-500 px-3 py-1 rounded-full font-bold border border-emerald-900/50 uppercase tracking-tighter">Completed</span>}
                  {isPending && (
                    <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-900/40 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[10px] text-amber-500 font-bold">Pending Your Review</span>
                    </div>
                  )}
                  {isRejected && (
                    <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[10px] text-red-400 font-bold">Rejected - Re-upload Required</span>
                    </div>
                  )}
                  {isUpcoming && <span className="text-[10px] bg-gray-900/60 text-gray-600 px-3 py-1 rounded-full font-bold border border-gray-800/80 uppercase tracking-tighter">Upcoming</span>}
                </div>

                {/* Details Section */}
                <div className="space-y-3 mb-5">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-[13px]">
                    <div className="text-gray-400 flex items-center gap-2 font-medium">
                      <span className="text-gray-600">•</span> 10% • SAR {m.amount?.toLocaleString()}
                    </div>
                    <div className="text-gray-400 font-medium">
                      <span className="text-gray-600">•</span> Construction: {m.constructionProgress}% Required
                    </div>
                  </div>

                  {isActive ? (
                    <div className="flex flex-wrap gap-x-8 gap-y-3 items-center py-1">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-[#EAB308]" />
                        <span className="text-[13px] text-gray-400">Amount:</span>
                        <span className="text-lg sm:text-xl font-bold text-white tracking-tight">SAR {m.amount?.toLocaleString()}</span>
                        <span className="text-[11px] text-gray-600 font-bold">(10%)</span>
                      </div>
                      <div className="flex items-center gap-3 sm:border-l border-gray-800 sm:pl-8">
                        <Layout className="w-4 h-4 text-emerald-500" />
                        <span className="text-[13px] text-gray-400">Construction Stage:</span>
                        <span className="text-lg sm:text-xl font-bold text-white tracking-tight">{m.constructionProgress}%</span>
                      </div>
                    </div>
                  ) : (m.paidAt || m.dueDate) && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <Calendar className="w-4 h-4 opacity-70" />
                      <span>{isCompleted ? 'Paid on' : 'Due Date:'} {new Date(isCompleted ? m.paidAt : m.dueDate).toISOString().split('T')[0]}</span>
                    </div>
                  )}
                </div>

                {/* Admin Verification Box (Completed Only) */}
                {isCompleted && (
                  <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-xl p-4 mb-6 transition-colors hover:bg-emerald-950/20">
                    <div className="flex items-center gap-3 text-emerald-600 text-[13px] font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified by: Admin - Ahmed Al-Saud</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 ml-7">{new Date(m.paidAt).toISOString().split('T')[0]}</p>
                  </div>
                )}

                {/* Shared Documents Header */}
                {((m.proofUrls?.length || 0) > 0 || (m.agentDocumentUrls?.length || 0) > 0 || m.proofUrl || m.agentDocumentUrl) && (
                   <div className="mb-4">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Documentation</p>
                      <div className="space-y-2">
                         {/* Buyer Documents Summary */}
                         {((m.proofUrls?.length || 0) > 0 || m.proofUrl) && (
                            <div className="flex items-center justify-between p-3.5 bg-white/3 border border-gray-800/80 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleViewNotes(m)}>
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                     <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[13px] text-gray-300 font-bold group-hover:text-[#EAB308] transition-colors">Buyer Payment Proofs</span>
                                     <span className="text-[10px] text-gray-500 font-medium tracking-tight">{(m.proofUrls?.length || (m.proofUrl ? 1 : 0))} Document(s) • Click to view details</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                     {role === 'BUYER' && m.isReadByAgent && (
                                        <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/20">
                                           Agent Read
                                        </span>
                                     )}
                                     {m.isReadByAdmin && (
                                        <span className="flex items-center gap-1 text-[10px] text-purple-400 font-bold bg-purple-400/5 px-2 py-0.5 rounded-full border border-purple-400/20">
                                           Admin Read
                                        </span>
                                     )}
                                     {role === 'AGENT' && !m.isReadByAgent && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(m); }} 
                                          className="text-[11px] text-amber-500 font-bold hover:underline"
                                        >
                                          Mark as Read
                                        </button>
                                     )}
                                     {role === 'AGENT' && m.isReadByAgent && (
                                        <span className="flex items-center gap-1 text-[10px] text-emerald-500/80 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                           <CheckCircle2 className="w-3 h-3" /> Read
                                        </span>
                                     )}
                                  </div>
                                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 group-hover:text-[#EAB308] group-hover:bg-[#EAB308]/10 transition-all">
                                     <Eye className="w-4 h-4" />
                                  </button>
                               </div>
                            </div>
                         )}

                         {/* Agent Documents Summary */}
                         {((m.agentDocumentUrls?.length || 0) > 0 || m.agentDocumentUrl) && (
                            <div className="flex items-center justify-between p-3.5 bg-white/3 border border-gray-800/80 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleViewNotes(m)}>
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                     <Shield className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[13px] text-gray-300 font-bold group-hover:text-emerald-500 transition-colors">Agent Confirmation Proofs</span>
                                     <span className="text-[10px] text-gray-500 font-medium tracking-tight">{(m.agentDocumentUrls?.length || (m.agentDocumentUrl ? 1 : 0))} Document(s) • Click to view details</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                     {role === 'AGENT' && m.isReadByBuyer && (
                                        <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/20">
                                           Buyer Read
                                        </span>
                                     )}
                                     {role === 'BUYER' && !m.isReadByBuyer && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(m); }} 
                                          className="text-[11px] text-[#EAB308] font-bold hover:underline"
                                        >
                                          Mark as Read
                                        </button>
                                     )}
                                     {role === 'BUYER' && m.isReadByBuyer && (
                                        <span className="flex items-center gap-1 text-[10px] text-emerald-500/80 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                           <CheckCircle2 className="w-3 h-3" /> Read
                                        </span>
                                     )}
                                  </div>
                                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                                     <Eye className="w-4 h-4" />
                                  </button>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                )}

                {/* Primary Action Row */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  {isActive && role === 'BUYER' && (!m.proofUrl || isRejected) && (
                    <Button
                      onClick={() => { setTargetMilestone(m); fileInputRef.current?.click(); }}
                      className="bg-transparent border border-[#EAB308] hover:bg-[#EAB308]/10 text-[#EAB308] font-bold px-5 sm:px-7 h-11 rounded-lg flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isRejected ? 'Re-upload Receipt' : 'Upload Receipt'}</span>
                      <CircleAlert className="w-4 h-4 opacity-70 ml-1" />
                    </Button>
                  )}

                  {m.paymentStatus === 'PENDING' && role === 'AGENT' && (
                    <>
                      {!m.agentDocumentUrl && (
                        <Button
                          onClick={() => { setTargetMilestone(m); fileInputRef.current?.click(); }}
                          className="bg-transparent border border-[#EAB308] hover:bg-[#EAB308]/10 text-[#EAB308] font-bold px-5 sm:px-7 h-11 rounded-lg flex items-center gap-2.5 transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Proof</span>
                        </Button>
                      )}
                      <Button
                        disabled={!m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0)}
                        onClick={() => handleMarkAsReceived(m)}
                        className={`font-bold px-6 sm:px-9 h-11 rounded-lg flex items-center gap-2.5 border-none shadow-lg transition-all ${
                          !m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0)
                            ? 'bg-gray-600 cursor-not-allowed opacity-50 shadow-none'
                            : 'bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-900/10 hover:scale-105'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Mark as Received</span>
                        {!m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0) && (
                          <Shield className="w-3.5 h-3.5 opacity-70 ml-1" />
                        )}
                      </Button>
                    </>
                  )}

                  {m.paymentStatus === 'AGENT_REVIEWED' && role === 'AGENT' && (
                    <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-900/30 px-6 py-3 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-500">Wait for Admin Verification</span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 border border-gray-800 px-5 h-10 rounded-lg flex items-center gap-2 text-sm font-bold"
                        onClick={() => {
                          if ((m.proofUrls?.length || 0) > 1) {
                            handleViewNotes(m);
                          } else if (m.proofUrl) {
                            window.open(m.proofUrl, '_blank');
                          }
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        {(m.proofUrls?.length || 0) > 1 ? `View All (${m.proofUrls.length})` : 'View Receipt'}
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 border border-gray-800 px-5 h-10 rounded-lg flex items-center gap-2 text-sm font-bold"
                        onClick={() => {
                          const url = m.proofUrls?.[0] || m.proofUrl;
                          if (url) handleDownloadDocument(url);
                        }}
                      >
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </div>
                  )}

                  {role === 'ADMIN' && m.paymentStatus === 'AGENT_REVIEWED' && (
                    <Button
                      onClick={() => handleAdminVerify(m)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 h-12 rounded-xl border-none shadow-xl transition-all hover:scale-105"
                    >
                      Verify Milestone
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" multiple />

      <Dialog open={isNoteModalOpen} onOpenChange={(open) => {
        setIsNoteModalOpen(open);
        if (!open) {
          setSelectedFiles([]);
          setNote('');
        }
      }}>
        <DialogContent className="bg-[#1a1a1a] border border-gray-800 text-white rounded-3xl p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black mb-1">Upload Documentation</DialogTitle>
            <p className="text-gray-400 text-sm font-medium">Add receipts or confirmation documents</p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* File List */}
            {selectedFiles.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-300 truncate font-medium">{file.name}</span>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-800 rounded-2xl p-8 text-center hover:border-[#EAB308]/50 hover:bg-[#EAB308]/5 transition-all cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3 group-hover:text-[#EAB308] transition-colors" />
                <p className="text-sm text-gray-400 font-medium">Click to select multiple files</p>
                <p className="text-[10px] text-gray-600 mt-1">Images or PDF</p>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 border border-dashed border-gray-800 rounded-xl text-[11px] text-gray-500 font-bold hover:border-[#EAB308]/50 hover:text-[#EAB308] transition-all"
              >
                + Add More Files
              </button>
            )}

            <div className="pt-2">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Notes</label>
              <Textarea
                placeholder="Transaction ID or specific notes..."
                className="bg-black/50 border-gray-800 rounded-2xl min-h-24 focus:border-[#EAB308] transition-colors text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              className="bg-[#EAB308] hover:bg-amber-400 text-black font-black h-12 px-10 rounded-2xl w-full shadow-lg shadow-amber-900/10 transition-all hover:scale-[1.02] active:scale-95"
              onClick={handleConfirmUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Uploading {selectedFiles.length} File(s)...</span>
                </div>
              ) : (
                `Submit ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotesViewOpen} onOpenChange={setIsNotesViewOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-gray-800 text-white rounded-3xl p-8 max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black mb-1">Payment & Document Details</DialogTitle>
            <p className="text-gray-400 text-sm font-medium">Review transaction notes and all uploaded documents</p>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
             {/* Documents Gallery Section */}
             {((viewNotesMilestone?.proofUrls?.length || 0) > 0 || (viewNotesMilestone?.agentDocumentUrls?.length || 0) > 0) && (
               <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Uploaded Documents</span>
                  <div className="grid grid-cols-2 gap-3">
                     {[...(viewNotesMilestone?.proofUrls || []), ...(viewNotesMilestone?.agentDocumentUrls || [])].map((url: string, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => handleViewDocument(url, [...(viewNotesMilestone?.proofUrls || []), ...(viewNotesMilestone?.agentDocumentUrls || [])])}
                          className="relative aspect-video bg-black/40 border border-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:border-[#EAB308]/50 transition-all"
                        >
                           {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img src={url} alt={`Doc ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                 <FileText className="w-6 h-6 text-blue-500" />
                                 <span className="text-[10px] text-gray-500 font-bold">PDF Document</span>
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}

             <div className="bg-black/40 p-5 rounded-2xl border border-gray-800/50 transition-colors hover:border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                      <FileText className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-black text-gray-200 uppercase tracking-widest">Buyer's Note</span>
                </div>
                <p className="text-gray-400 text-[13px] leading-relaxed italic ml-11">
                   {viewNotesMilestone?.buyerNote || 'No notes provided by the buyer.'}
                </p>
             </div>

             <div className="bg-black/40 p-5 rounded-2xl border border-gray-800/50 transition-colors hover:border-emerald-500/30">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                      <Shield className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-black text-gray-200 uppercase tracking-widest">Agent's Note</span>
                </div>
                <p className="text-gray-400 text-[13px] leading-relaxed italic ml-11">
                   {viewNotesMilestone?.agentDocumentNote || 'No notes provided by the agent.'}
                </p>
             </div>
          </div>

          <DialogFooter className="mt-8">
             <Button className="bg-[#EAB308] hover:bg-amber-400 text-black font-black h-12 px-10 rounded-2xl w-full transition-all hover:scale-[1.02] active:scale-95" onClick={() => setIsNotesViewOpen(false)}>
               Close Details
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={isDocumentViewOpen} onOpenChange={setIsDocumentViewOpen}>
        <DialogContent className="bg-[#121417] border border-white/5 text-white rounded-3xl p-0 max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-white/5 shrink-0 flex flex-row items-center justify-between">
            <div>
               <DialogTitle className="text-xl font-black tracking-tight">Document Viewer</DialogTitle>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                 File {currentDocIndex + 1} of {viewDocumentUrls.length}
               </p>
            </div>
          </DialogHeader>
          
          <div className="flex-1 relative overflow-hidden bg-black/40 flex items-center justify-center p-4 min-h-[500px]">
            {/* Navigation Arrows */}
            {viewDocumentUrls.length > 1 && (
               <>
                  <button onClick={prevDoc} className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white/70">
                    <Layout className="w-5 h-5 rotate-90" />
                  </button>
                  <button onClick={nextDoc} className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white/70">
                    <Layout className="w-5 h-5 -rotate-90" />
                  </button>
               </>
            )}

            <div className="w-full h-full flex items-center justify-center transition-all duration-500">
               {viewDocumentType === 'image' ? (
                 <img 
                   src={viewDocumentUrls[currentDocIndex]} 
                   alt="Document" 
                   className="max-w-full max-h-[calc(90vh-200px)] object-contain rounded-xl shadow-2xl"
                 />
               ) : (
                 <div className="text-center space-y-6 p-12 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl">
                   <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto">
                      <FileText className="w-10 h-10" />
                   </div>
                   <div>
                      <p className="text-lg font-bold text-white mb-2">Document Preview Not Available</p>
                      <p className="text-sm text-gray-400">Please download the file to view its full content</p>
                   </div>
                   <Button 
                     onClick={() => handleDownloadDocument(viewDocumentUrls[currentDocIndex])}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-2xl font-bold shadow-lg shadow-blue-900/20"
                   >
                     <Download className="w-4 h-4 mr-2" /> Download to View
                   </Button>
                 </div>
               )}
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 border-t border-white/5 shrink-0 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 px-8 rounded-2xl transition-all" 
                onClick={() => setIsDocumentViewOpen(false)}
              >
                Close Viewer
              </Button>
            </div>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-10 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-900/20" 
              onClick={() => handleDownloadDocument(viewDocumentUrls[currentDocIndex])}
            >
              <Download className="w-4 h-4 mr-2" /> Download File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}