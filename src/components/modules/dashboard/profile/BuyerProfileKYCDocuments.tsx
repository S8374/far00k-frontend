"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
    KycDocument,
    useDeleteKycDocumentMutation,
    useGetKycDocumentsByUserQuery,
    useUpdateKycDocumentMutation,
    useUploadKycDocumentMutation,
} from "@/redux/api/kycDocumentApi";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { AlertCircle, CarFront, CheckCircle2, CircleCheckBig, Clock, DollarSign, Eye, FileText, ImagePlus, Loader2, MoreVertical, Trash2, UploadIcon, X, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { BsPassport } from "react-icons/bs";
import { toast } from "sonner";

type KycStatus = "NOT_UPLOADED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
type KycDocumentType =
    | "NATIONAL_ID"
    | "PASSPORT"
    | "DRIVING_LICENSE"
    | "PROOF_OF_ADDRESS"
    | "BANK_STATEMENT";

interface KycDocumentConfig {
    label: string;
    type: KycDocumentType;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    notes: string;
}

const KYC_DOCUMENTS: KycDocumentConfig[] = [
    {
        label: "National ID",
        type: "NATIONAL_ID",
        icon: FileText,
        notes: "National ID document",
    },
    {
        label: "Passport",
        type: "PASSPORT",
        icon: BsPassport,
        notes: "International passport",
    },
    {
        label: "Driving License",
        type: "DRIVING_LICENSE",
        icon: CarFront,
        notes: "Valid driving license",
    },
    {
        label: "Proof of Funds",
        type: "PROOF_OF_ADDRESS",
        icon: DollarSign,
        notes: "Proof of funds document",
    },
    {
        label: "Bank Statement",
        type: "BANK_STATEMENT",
        icon: FileText,
        notes: "Recent bank statement",
    },
];

const STATUS_UI: Record<KycStatus, { label: string; className: string; icon: any }> = {
    NOT_UPLOADED: {
        label: "Not Uploaded",
        className: "bg-zinc-800 text-zinc-400 border-zinc-700",
        icon: AlertCircle,
    },
    PENDING_VERIFICATION: {
        label: "Pending",
        className: "bg-amber-900/20 text-amber-500 border-amber-900/30",
        icon: Clock,
    },
    VERIFIED: {
        label: "Verified",
        className: "bg-emerald-900/20 text-emerald-500 border-emerald-900/30",
        icon: CheckCircle2,
    },
    REJECTED: {
        label: "Rejected",
        className: "bg-red-900/20 text-red-500 border-red-900/30",
        icon: XCircle,
    },
};

function normalizeDocType(type?: string): KycDocumentType | null {
    if (!type) return null;

    const normalized = type.trim().toUpperCase().replace(/[\s-]+/g, "_");
    const matching = KYC_DOCUMENTS.find((item) => item.type === normalized);
    return (matching?.type as KycDocumentType) ?? null;
}

function normalizeStatus(document?: KycDocument): KycStatus {
    if (!document?.fileUrl) return "NOT_UPLOADED";
    if (document?.isVerified) return "VERIFIED";

    const rawStatus = (document?.status || document?.verificationStatus || "").toUpperCase();

    if (rawStatus === "REJECTED" || rawStatus.includes("REJECT")) {
        return "REJECTED";
    }

    if (rawStatus === "VERIFIED" || rawStatus === "APPROVED") {
        return "VERIFIED";
    }

    return "PENDING_VERIFICATION";
}

function getDocumentUID(document?: KycDocument): string | null {
    const uid = document?.documentUID || document?.id || document?._id || document?.uid;
    return typeof uid === "string" && uid.length > 0 ? uid : null;
}

function getRejectionReason(document?: KycDocument): string {
    if (!document) return "";

    const reason = document.rejectionReason || document.rejection_reason || document.reason || "";
    return reason.trim();
}

function getDocumentPriority(document?: KycDocument): number {
    const status = normalizeStatus(document);

    if (status === "PENDING_VERIFICATION") return 4;
    if (status === "VERIFIED") return 3;
    if (status === "REJECTED") return 2;
    return 1;
}

function getDocumentTimestamp(document?: KycDocument): number {
    if (!document) return 0;

    const candidates = [document.updatedAt, document.createdAt, document.uploadedAt, document.submittedAt];

    for (const value of candidates) {
        if (!value) continue;
        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }

    return 0;
}

export default function BuyerProfileKYCDocuments() {
    const { data: meData, isLoading: isMeLoading } = useGetMeQuery({});
    const user = meData?.data?.data || meData?.data || meData;
    const userId = user?.id || user?._id || user?.uid || user?.userId;

    const {
        data: kycDocuments = [],
        refetch: refetchKycDocuments,
    } = useGetKycDocumentsByUserQuery(userId, {
        skip: !userId,
    });

    const [uploadImages, { isLoading: isUploadingImage }] = useUploadImagesMutation();
    const [uploadKycDocument, { isLoading: isUploadingKyc }] = useUploadKycDocumentMutation();
    const [updateKycDocument, { isLoading: isUpdatingKyc }] = useUpdateKycDocumentMutation();
    const [deleteKycDocument, { isLoading: isDeletingKyc }] = useDeleteKycDocumentMutation();

    const [activeModalType, setActiveModalType] = useState<KycDocumentType | null>(null);
    const [previewModalType, setPreviewModalType] = useState<KycDocumentType | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Partial<Record<KycDocumentType, File>>>({});
    const [selectedPreviews, setSelectedPreviews] = useState<Partial<Record<KycDocumentType, string>>>({});

    const serverDocumentsByType = useMemo(() => {
        return kycDocuments.reduce<Partial<Record<KycDocumentType, KycDocument>>>(
            (acc, item) => {
                const type = normalizeDocType(item?.documentType);
                if (type) {
                    const current = acc[type];

                    if (!current) {
                        acc[type] = item;
                    } else {
                        const currentTimestamp = getDocumentTimestamp(current);
                        const itemTimestamp = getDocumentTimestamp(item);

                        if (itemTimestamp > currentTimestamp) {
                            acc[type] = item;
                        } else if (
                            itemTimestamp === currentTimestamp &&
                            getDocumentPriority(item) >= getDocumentPriority(current)
                        ) {
                            acc[type] = item;
                        }
                    }
                }
                return acc;
            },
            {}
        );
    }, [kycDocuments]);

    const handleFileChange = (type: KycDocumentType, file?: File) => {
        if (!file) return;

        setSelectedFiles((prev) => ({ ...prev, [type]: file }));

        if (!file.type.startsWith("image/")) {
            setSelectedPreviews((prev) => ({ ...prev, [type]: "" }));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedPreviews((prev) => ({
                ...prev,
                [type]: typeof reader.result === "string" ? reader.result : "",
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveSelectedFile = (type: KycDocumentType) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [type]: undefined,
        }));
        setSelectedPreviews((prev) => ({
            ...prev,
            [type]: undefined,
        }));
    };

    const handleSubmitDocument = async (doc: KycDocumentConfig) => {
        const selectedFile = selectedFiles[doc.type];
        const existingDocument = serverDocumentsByType[doc.type];
        const documentUID = getDocumentUID(existingDocument);
        const previousStatus = normalizeStatus(existingDocument);

        if (isMeLoading) {
            toast.error("User information is still loading. Please wait a moment.");
            return;
        }

        if (!userId) {
            toast.error("User information not found. Please refresh and try again.");
            return;
        }

        if (!selectedFile) {
            toast.error("Please choose a file before uploading.");
            return;
        }

        try {
            const imageFormData = new FormData();
            imageFormData.append("files", selectedFile);

            const uploadResponse = await uploadImages(imageFormData).unwrap();
            const fileUrl = uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

            if (!fileUrl) {
                toast.error("Upload failed: file URL not found.");
                return;
            }

            if (documentUID) {
                await updateKycDocument({
                    documentUID,
                    fileUrl,
                }).unwrap();
            } else {
                await uploadKycDocument({
                    userId,
                    documentType: doc.type,
                    fileUrl,
                    notes: doc.notes,
                }).unwrap();
            }

            setSelectedFiles((prev) => ({
                ...prev,
                [doc.type]: undefined,
            }));
            setSelectedPreviews((prev) => ({
                ...prev,
                [doc.type]: undefined,
            }));

            setActiveModalType(null);
            refetchKycDocuments();
            toast.success(
                documentUID && previousStatus !== "REJECTED" && previousStatus !== "VERIFIED"
                    ? `${doc.label} updated successfully.`
                    : `${doc.label} uploaded successfully. Pending verification.`
            );
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to upload ${doc.label}.`);
        }
    };

    const handleDeleteDocument = async (doc: KycDocumentConfig) => {
        const existingDocument = serverDocumentsByType[doc.type];
        const documentUID = getDocumentUID(existingDocument);

        if (!documentUID) {
            toast.error("Document not found.");
            return;
        }

        try {
            await deleteKycDocument(documentUID).unwrap();
            setSelectedFiles((prev) => ({ ...prev, [doc.type]: undefined }));
            setSelectedPreviews((prev) => ({ ...prev, [doc.type]: undefined }));
            setPreviewModalType(null);
            setActiveModalType(null);
            refetchKycDocuments();
            toast.success(`${doc.label} deleted successfully.`);
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to delete ${doc.label}.`);
        }
    };

    return (
        <div className="bg-[#2c2a2a] p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-4">KYC Documents</h3>

            <div className="space-y-4">
                {KYC_DOCUMENTS.map((doc) => {
                    const Icon = doc.icon;
                    const serverDocument = serverDocumentsByType[doc.type];
                    const documentUID = getDocumentUID(serverDocument);

                    const status = normalizeStatus(serverDocument);
                    const fileUrl = serverDocument?.fileUrl;
                    const rejectionReason = status === "REJECTED" ? getRejectionReason(serverDocument) : "";

                    const statusUi = STATUS_UI[status];
                    const isModalOpen = activeModalType === doc.type;
                    const isPreviewModalOpen = previewModalType === doc.type;
                    const selectedFile = selectedFiles[doc.type];
                    const selectedPreview = selectedPreviews[doc.type];
                    const isSubmitting = isUploadingImage || isUploadingKyc || isUpdatingKyc;
                    const isDeleting = isDeletingKyc;
                    const isUploadedImage = Boolean(fileUrl) && /\.(png|jpe?g|webp|gif|bmp|svg|pdf)(\?.*)?$/i.test(fileUrl || "");

                    return (
                        <div
                            key={doc.type}
                            className="bg-[#383636] p-3 rounded flex items-center justify-between gap-3"
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Icon size={16} className="text-emerald-500" />
                                    <span>{doc.label}</span>
                                </div>
                                {rejectionReason ? (
                                    <p className="mt-1 text-xs text-red-300 truncate" title={rejectionReason}>
                                        Reason: {rejectionReason}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider rounded-full gap-1.5 px-3 py-1 border ${statusUi.className}`}>
                                    <statusUi.icon size={12} />
                                    {statusUi.label}
                                </div>

                                {status === "REJECTED" && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setActiveModalType(doc.type)}
                                        className="h-8 bg-red-950/10 border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 text-xs font-bold"
                                    >
                                        <UploadIcon size={12} className="mr-1.5" />
                                        Re-upload
                                    </Button>
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                            aria-label={`${doc.label} actions`}
                                        >
                                            <MoreVertical size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-52 border-white/5 bg-[#1a1a1a] text-gray-200 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                                    >
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 py-2">Document Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-white/5" />

                                        {fileUrl ? (
                                            <DropdownMenuItem
                                                onClick={() => setPreviewModalType(doc.type)}
                                                className="rounded-xl focus:bg-white/5 focus:text-[#EAB308] gap-3 px-3 py-2.5 cursor-pointer"
                                            >
                                                <Eye size={16} />
                                                <span className="font-bold text-sm">View Document</span>
                                            </DropdownMenuItem>
                                        ) : null}

                                        <DropdownMenuItem
                                            onClick={() => setActiveModalType(doc.type)}
                                            className="rounded-xl focus:bg-white/5 focus:text-emerald-500 gap-3 px-3 py-2.5 cursor-pointer"
                                        >
                                            <UploadIcon size={16} />
                                            <span className="font-bold text-sm">{documentUID ? "Update Document" : "Upload Document"}</span>
                                        </DropdownMenuItem>

                                        {documentUID ? (
                                            <DropdownMenuItem
                                                variant="destructive"
                                                disabled={isDeleting}
                                                onClick={() => handleDeleteDocument(doc)}
                                                className="rounded-xl focus:bg-red-500/10 focus:text-red-500 gap-3 px-3 py-2.5 cursor-pointer mt-1"
                                            >
                                                <Trash2 size={16} />
                                                <span className="font-bold text-sm">{isDeleting ? "Deleting..." : "Delete Document"}</span>
                                            </DropdownMenuItem>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <Dialog open={isModalOpen} onOpenChange={(open) => setActiveModalType(open ? doc.type : null)}>
                                <DialogContent className="bg-[#2c2a2a] border border-emerald-900/50 text-white sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">Upload {doc.label}</DialogTitle>
                                        <DialogDescription className="text-gray-300">
                                            {documentUID
                                                ? `Replace your existing ${doc.label.toLowerCase()} file.`
                                                : `Upload your ${doc.label.toLowerCase()} file. This will be sent for verification.`}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-3">
                                        <input
                                            id={`file-${doc.type}`}
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(doc.type, e.target.files?.[0])}
                                            className="hidden"
                                        />

                                        <label
                                            htmlFor={`file-${doc.type}`}
                                            className="block cursor-pointer rounded-xl border-2 border-dashed border-stone-600 bg-[#383636] p-5 text-center transition hover:border-emerald-500"
                                        >
                                            <ImagePlus className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
                                            <p className="text-sm font-medium text-gray-200">Click to select document</p>
                                            <p className="text-xs text-gray-400 mt-1">Supported: PDF, JPG, PNG, JPEG</p>
                                        </label>

                                        {selectedFile ? (
                                            <div className="rounded-xl border border-stone-600 bg-[#383636] p-3">
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <p className="text-xs text-emerald-300 truncate">{selectedFile.name}</p>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-7 w-7 text-red-300 hover:bg-red-900/30 hover:text-red-200"
                                                        onClick={() => handleRemoveSelectedFile(doc.type)}
                                                        aria-label="Remove selected file"
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>

                                                {selectedPreview ? (
                                                    <div className="overflow-hidden rounded-lg border border-stone-700">
                                                        <img
                                                            src={selectedPreview}
                                                            alt={`${doc.label} preview`}
                                                            className="h-48 w-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="rounded-lg border border-stone-700 bg-[#2c2a2a] px-3 py-4 text-center text-xs text-gray-400">
                                                        Preview not available for this file type.
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setActiveModalType(null)}
                                            className="border-gray-600 text-gray-200"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => handleSubmitDocument(doc)}
                                            disabled={!selectedFile || isSubmitting}
                                            className="bg-emerald-800 hover:bg-emerald-700"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                documentUID ? "Update Document" : "Upload Document"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={isPreviewModalOpen}
                                onOpenChange={(open) => setPreviewModalType(open ? doc.type : null)}
                            >
                                <DialogContent className="bg-[#2c2a2a] border border-emerald-900/50 text-white sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>{doc.label} Preview</DialogTitle>
                                        <DialogDescription className="text-gray-300">
                                            Uploaded document preview
                                        </DialogDescription>
                                    </DialogHeader>

                                    {fileUrl ? (
                                        isUploadedImage ? (
                                            <div className="overflow-hidden rounded-xl border border-stone-700 bg-[#383636]">
                                                <img
                                                    src={fileUrl}
                                                    alt={`${doc.label} uploaded preview`}
                                                    className="max-h-[65vh] w-full object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-stone-700 bg-[#383636] p-4 text-center text-sm text-gray-300">
                                                Preview is not supported for this file type.
                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="ml-1 text-emerald-400 underline hover:text-emerald-300"
                                                >
                                                    Open file
                                                </a>
                                            </div>
                                        )
                                    ) : (
                                        <div className="rounded-xl border border-stone-700 bg-[#383636] p-4 text-center text-sm text-gray-300">
                                            No uploaded file found.
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}