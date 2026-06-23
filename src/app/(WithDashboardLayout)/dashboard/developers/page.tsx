"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Globe,
    ImagePlus,
    Loader2,
    Trash2,
    Edit2,
    Plus,
    Search,
    ExternalLink,
    Building2,
    CheckCircle2,
    LayoutGrid,
    List,
    MoreHorizontal,
    ArrowUpRight,
    ShieldCheck,
    ChevronRight,
    Activity,
} from "lucide-react";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import {
    useCreateDeveloperMutation,
    useUpdateDeveloperMutation,
    useGetDeveloperQuery,
    useDeleteDeveloperMutation
} from "@/redux/api/developer.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type DeveloperFormState = {
    name: string;
    description: string;
    websiteUrl: string;
};

const initialFormState: DeveloperFormState = {
    name: "",
    description: "",
    websiteUrl: "",
};

export default function DevelopersPage() {
    const [form, setForm] = useState<DeveloperFormState>(initialFormState);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDeveloper, setEditingDeveloper] = useState<any>(null);
    const [editForm, setEditForm] = useState<DeveloperFormState>(initialFormState);
    const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
    const [editLogoPreview, setEditLogoPreview] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    const [createDeveloper, { isLoading: isCreating }] = useCreateDeveloperMutation();
    const [updateDeveloper, { isLoading: isUpdating }] = useUpdateDeveloperMutation();
    const [deleteDeveloper, { isLoading: isDeleting }] = useDeleteDeveloperMutation();
    const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();

    const { data: developerResponse, isLoading: isLoadingDevelopers } =
        useGetDeveloperQuery({});

    const developers = developerResponse?.data?.data || developerResponse?.data || [];

    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Logo image must be 5MB or less");
            return;
        }

        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const removeSelectedLogo = () => {
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview("");
        setLogoFile(null);
    };

    const openEditModal = (developer: any) => {
        setEditingDeveloper(developer);
        setEditForm({
            name: developer.name,
            description: developer.description,
            websiteUrl: developer.websiteUrl || "",
        });
        setEditLogoPreview(developer.logoUrl);
        setEditLogoFile(null);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingDeveloper(null);
        setEditForm(initialFormState);
        if (editLogoPreview && !editLogoPreview.startsWith("http")) {
            URL.revokeObjectURL(editLogoPreview);
        }
        setEditLogoPreview("");
        setEditLogoFile(null);
    };

    const handleEditLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Logo image must be 5MB or less");
            return;
        }

        if (editLogoPreview && !editLogoPreview.startsWith("http")) {
            URL.revokeObjectURL(editLogoPreview);
        }

        setEditLogoFile(file);
        setEditLogoPreview(URL.createObjectURL(file));
    };

    const removeEditLogo = () => {
        if (editLogoPreview && !editLogoPreview.startsWith("http")) {
            URL.revokeObjectURL(editLogoPreview);
        }
        setEditLogoPreview("");
        setEditLogoFile(null);
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editForm.name.trim() || !editForm.description.trim()) {
            toast.error("Name and description are required");
            return;
        }

        try {
            let logoUrl = editLogoPreview;

            if (editLogoFile) {
                const imageFormData = new FormData();
                imageFormData.append("files", editLogoFile);

                const uploadResponse = await uploadImages(imageFormData).unwrap();
                logoUrl = uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

                if (!logoUrl) {
                    toast.error("Failed to upload logo image");
                    return;
                }
            }

            const payload = {
                name: editForm.name.trim(),
                description: editForm.description.trim(),
                logoUrl: logoUrl,
                websiteUrl: editForm.websiteUrl.trim() || undefined,
            };

            const response = await updateDeveloper({
                id: editingDeveloper?.id,
                payload,
            }).unwrap();

            if (response?.success) {
                toast.success(response?.message || "Developer updated successfully");
            } else {
                toast.success("Developer updated successfully");
            }

            closeEditModal();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update developer");
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.name.trim() || !form.description.trim()) {
            toast.error("Name and description are required");
            return;
        }

        if (!logoFile) {
            toast.error("Developer logo is required");
            return;
        }

        try {
            const imageFormData = new FormData();
            imageFormData.append("files", logoFile);

            const uploadResponse = await uploadImages(imageFormData).unwrap();
            const uploadedLogoUrl =
                uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

            if (!uploadedLogoUrl) {
                toast.error("Failed to upload logo image");
                return;
            }

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                logoUrl: uploadedLogoUrl,
                websiteUrl: form.websiteUrl.trim() || undefined,
            };

            const response = await createDeveloper(payload).unwrap();
            if (response?.success) {
                toast.success(response?.message || "Developer created successfully");
            } else {
                toast.success("Developer created successfully");
            }

            setForm(initialFormState);
            removeSelectedLogo();
            setIsAddModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create developer");
        }
    };

    const handleDeleteDeveloper = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this developer? This will remove all associated project links.")) return;
        try {
            await deleteDeveloper(id).unwrap();
            toast.success("Developer removed successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete developer");
        }
    };

    const filteredDevelopers = developers.filter((dev: any) =>
        dev?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSaving = isCreating || isUploading;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800 backdrop-blur-xl">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
                        <div className="bg-emerald-500/10 p-3 rounded-2xl">
                            <Building2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        Developer Network
                    </h1>
                    <p className="text-zinc-400 font-medium">Curate and manage your premier real estate developer partnerships.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/20 gap-3 transition-all active:scale-95">
                                <Plus size={18} />
                                Add Developer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border border-zinc-800 bg-zinc-950 text-white max-w-2xl w-[calc(100vw-1rem)] sm:w-full rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh]">
                            <div className="relative overflow-hidden border-b border-zinc-800 bg-linear-to-r from-emerald-600/20 via-emerald-500/10 to-zinc-900 px-4 sm:px-8 py-5 sm:py-7">
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
                                <div className="relative flex items-start gap-4">
                                    <div className="mt-0.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                                        <Building2 className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">Add Developer</DialogTitle>
                                        <p className="mt-1 text-sm text-zinc-300">Create a verified developer profile with brand details and website link.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-150px)]">
                                <form onSubmit={handleSubmit} className="space-y-7">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Developer Name</Label>
                                            <Input
                                                value={form.name}
                                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="e.g. Aldar Properties"
                                                className="bg-zinc-900/70 border-zinc-800 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Official Website (Optional)</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    value={form.websiteUrl}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                                                    className="pl-10 bg-zinc-900/70 border-zinc-800 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-semibold"
                                                    placeholder="https://www.aldar.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Company Description</Label>
                                        <Textarea
                                            value={form.description}
                                            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                            rows={4}
                                            className="bg-zinc-900/70 border-zinc-800 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all text-sm"
                                            placeholder="Describe the developer's market presence, core projects, and reputation."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Brand Logo</Label>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                                            <label
                                                htmlFor="developer-logo"
                                                className="flex-1 cursor-pointer flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-sm text-zinc-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                                            >
                                                <div className="bg-zinc-800 p-3 rounded-full group-hover:bg-emerald-500/10 transition-all">
                                                    <ImagePlus className="h-5 w-5 text-zinc-500 group-hover:text-emerald-500" />
                                                </div>
                                                <span className="font-semibold">Upload logo</span>
                                                <span className="text-[11px] text-zinc-500">Drag and drop or click to browse</span>
                                                <span className="text-[10px] uppercase tracking-wider text-zinc-600">PNG, JPG, SVG up to 5MB</span>
                                            </label>
                                            <input id="developer-logo" type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />

                                            {logoPreview && (
                                                <div className="relative group shrink-0 self-center">
                                                    <img src={logoPreview} alt="Preview" className="h-32 w-32 rounded-2xl border border-emerald-500/30 object-cover" />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        onClick={removeSelectedLogo}
                                                        className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-red-600 hover:bg-red-500 z-20 shadow-lg border-2 border-zinc-950"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsAddModalOpen(false);
                                                setForm(initialFormState);
                                                removeSelectedLogo();
                                            }}
                                            className="h-11 px-6 rounded-xl border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white h-11 px-7 rounded-xl font-bold tracking-wide shadow-lg shadow-emerald-900/25 w-full md:w-auto"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Add Developer"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <Input
                            placeholder="Search agencies, portfolios..."
                            className="pl-12 bg-zinc-900/40 border-zinc-800 h-14 rounded-2xl focus:border-emerald-500/50 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-10 w-10 rounded-xl ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={20} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-10 w-10 rounded-xl ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={20} />
                        </Button>
                    </div>
                </div>

                {isLoadingDevelopers ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                        <p className="text-zinc-500 font-black tracking-widest text-xs uppercase">Mapping Ecosystem...</p>
                    </div>
                ) : filteredDevelopers.length === 0 ? (
                    <div className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-[3rem] py-32 flex flex-col items-center text-center space-y-6">
                        <div className="bg-zinc-800 p-8 rounded-full">
                            <Search className="h-12 w-12 text-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">No Developers Found</h3>
                            <p className="text-zinc-500 max-w-sm">Adjust your search parameters or onboard a new partner to the network.</p>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDevelopers.map((developer: any) => (
                            <Card key={developer.id} className="bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                                <div className="relative h-48 overflow-hidden bg-zinc-950 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={developer?.logoUrl || "/placeholder-image.png"}
                                        alt={developer.name}
                                        className="h-24 w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-emerald-600 transition-colors"
                                            onClick={() => openEditModal(developer)}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-colors"
                                            onClick={() => handleDeleteDeveloper(developer.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{developer.name}</h3>
                                            <a href={developer.websiteUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-500 transition-colors">
                                                <ArrowUpRight size={20} />
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-3">Partner</Badge>
                                            <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 uppercase">
                                                <Activity size={10} className="text-emerald-500" />
                                                Verified Authority
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed font-medium">{developer.description}</p>
                                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-zinc-800 p-2 rounded-lg">
                                                <LayoutGrid size={14} className="text-zinc-500" />
                                            </div>
                                            <span className="text-xs font-black text-white">{developer.projectsCount || 0} Assets</span>
                                        </div>
                                        <Button variant="ghost" className="text-emerald-500 hover:text-emerald-400 hover:bg-transparent font-black text-xs uppercase tracking-widest gap-2">
                                            Explore Portfolio <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-transparent h-16 bg-zinc-950/30">
                                    <TableHead className="pl-8 text-zinc-500 uppercase font-black text-[10px] tracking-widest">Agency Identity</TableHead>
                                    <TableHead className="text-zinc-500 uppercase font-black text-[10px] tracking-widest">Market Presence</TableHead>
                                    <TableHead className="text-zinc-500 uppercase font-black text-[10px] tracking-widest">Official Channel</TableHead>
                                    <TableHead className="text-right pr-8 text-zinc-500 uppercase font-black text-[10px] tracking-widest">Authority Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDevelopers.map((developer: any) => (
                                    <TableRow key={developer.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-all group h-24">
                                        <TableCell className="pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-emerald-500/30 transition-all shadow-lg">
                                                    <img src={developer?.logoUrl || "/placeholder-image.png"} className="h-10 w-10 object-contain" alt="" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-white group-hover:text-emerald-400 transition-colors">{developer.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck size={12} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Onboarded Partner</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-zinc-400 line-clamp-1 max-w-md font-medium">{developer.description}</p>
                                        </TableCell>
                                        <TableCell>
                                            <a href={developer.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-black text-xs uppercase tracking-widest transition-colors">
                                                Visit Agency <ExternalLink size={12} />
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-10 w-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-emerald-600 hover:text-white transition-all shadow-md"
                                                    onClick={() => openEditModal(developer)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700 transition-all shadow-md">
                                                            <MoreHorizontal size={18} className="text-zinc-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300 w-56 p-2 rounded-2xl shadow-2xl">
                                                        <DropdownMenuLabel className="text-[10px] uppercase font-black text-zinc-500 px-3 py-2 tracking-[0.2em]">Management</DropdownMenuLabel>
                                                        <DropdownMenuItem className="flex gap-3 font-bold cursor-pointer rounded-xl focus:bg-emerald-600 focus:text-white p-3">
                                                            <LayoutGrid size={16} /> View All Assets
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(developer)} className="flex gap-3 font-bold cursor-pointer rounded-xl focus:bg-emerald-600 focus:text-white p-3">
                                                            <Edit2 size={16} /> Modify Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-800 mx-2 my-2" />
                                                        <DropdownMenuItem onClick={() => handleDeleteDeveloper(developer.id)} className="flex gap-3 font-black cursor-pointer rounded-xl text-red-500 focus:bg-red-600 focus:text-white p-3">
                                                            <Trash2 size={16} /> Delete Partnership
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Redesigned Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="border border-zinc-800 bg-zinc-950 text-white max-w-2xl w-[calc(100vw-1rem)] sm:w-full rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh]">
                    <div className="relative overflow-hidden border-b border-zinc-800 bg-linear-to-r from-emerald-600/20 via-emerald-500/10 to-zinc-900 px-4 sm:px-8 py-5 sm:py-7">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                                    <Edit2 className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">Update Developer</DialogTitle>
                                    <p className="mt-1 text-sm text-zinc-300">Refine developer profile details, branding, and website information.</p>
                                </div>
                            </div>
                            <div className="h-14 w-14 rounded-xl bg-zinc-950/80 border border-zinc-800 p-2 shrink-0">
                                <img src={editLogoPreview || "/placeholder-image.png"} className="h-full w-full object-contain" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-150px)]">
                        <form onSubmit={handleEditSubmit} className="space-y-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Developer Name</Label>
                                    <Input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                        className="bg-zinc-900/70 border-zinc-800 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-semibold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Official Website (Optional)</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            value={editForm.websiteUrl}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                                            className="pl-10 bg-zinc-900/70 border-zinc-800 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-semibold"
                                            placeholder="https://www.aldar.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Company Description</Label>
                                <Textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    className="bg-zinc-900/70 border-zinc-800 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-400 ml-1">Brand Logo</Label>
                                <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                                    <label
                                        htmlFor="edit-developer-logo"
                                        className="flex-1 cursor-pointer flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-sm text-zinc-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                                    >
                                        <div className="bg-zinc-800 p-3 rounded-full group-hover:bg-emerald-500/10 transition-all">
                                            <ImagePlus className="h-5 w-5 text-zinc-500 group-hover:text-emerald-500" />
                                        </div>
                                        <span className="font-semibold">Upload logo</span>
                                        <span className="text-[11px] text-zinc-500">Drag and drop or click to browse</span>
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">PNG, JPG, SVG up to 5MB</span>
                                    </label>
                                    <input id="edit-developer-logo" type="file" accept="image/*" onChange={handleEditLogoSelect} className="hidden" />

                                    {editLogoPreview && (
                                        <div className="relative group shrink-0 self-center">
                                            <img src={editLogoPreview} alt="Preview" className="h-32 w-32 rounded-2xl border border-zinc-800 object-cover" />
                                            <Button
                                                type="button"
                                                size="icon"
                                                onClick={removeEditLogo}
                                                className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-red-600 hover:bg-red-500 shadow-lg border-2 border-zinc-950"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeEditModal}
                                    className="h-11 px-6 rounded-xl border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating || isUploading}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white h-11 px-7 rounded-xl font-bold tracking-wide shadow-lg shadow-emerald-900/25 w-full md:w-auto"
                                >
                                    {isUpdating || isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Update Developer"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
