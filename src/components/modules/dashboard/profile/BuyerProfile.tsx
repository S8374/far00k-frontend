"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Mail, Lock, Trophy, Edit, FileText, LandPlot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import BuyerProfileOverview from "./BuyerProfileOverView";
import BuyerProfileContactInfo from "./BuyerProfileContactInfo";
import BuyerProfileSecurity from "./BuyerProfileSecurity";
import BuyerProfileProperty from "./BuyerProfileProperty";
import { Button } from "@/components/ui/button";
import BuyerProfileKYCDocuments from "./BuyerProfileKYCDocuments";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetGoldenVisaProgressQuery } from "@/redux/api/mileston.api";
import { useRef, useState } from "react";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import BuyerEditProfileModal from "./BuyerEditProfileModal";
import BuyerContactEditModal from "./BuyerContactEditModal";

export default function BuyerProfile() {
    const { data: userData } = useGetMeQuery({})
    const user = userData?.data?.data || userData?.data || userData;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isContactEditModalOpen, setIsContactEditModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadImages, { isLoading: isUploadingImage }] = useUploadImagesMutation();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const { data: goldenVisaDataResponse } = useGetGoldenVisaProgressQuery(undefined, { skip: !user?.id });
    const goldenVisaProgress = Math.max(0, Math.min(100, Number(goldenVisaDataResponse?.totalProgress || 0)));
    
    console.log("user",user)
    const handleImageUpload = async (selectedFile: File) => {
        try {
            const imageFormData = new FormData();
            imageFormData.append("files", selectedFile);

            const uploadResponse = await uploadImages(imageFormData).unwrap();
            const uploadedUrl =
                uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

            if (!uploadedUrl) {
                toast.error("Failed to get uploaded image URL");
                return;
            }

            const profileResponse = await updateProfile({ avatarUrl: uploadedUrl }).unwrap();

            if (profileResponse?.success) {
                toast.success(profileResponse?.message || "Photo updated successfully!");
            } else {
                toast.error(profileResponse?.message || "Failed to update profile photo");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to upload photo");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        handleImageUpload(file);
        e.target.value = "";
    };

    const isImageUpdating = isUploadingImage || isUpdatingProfile;
    return (
        <div className="px-2 sm:px-4">
            <h1 className="text-xl font-semibold">My Profile</h1>
            <p className="text-sm text-gray-300 mb-6">Professional agent profile & verification</p>

            <Tabs defaultValue="overview" className="flex flex-col lg:grid lg:grid-cols-6 gap-6">
                {/* Sidebar – horizontal scroll on mobile, fixed-width column on sm+ */}
                <TabsList
                    className="
                            flex lg:flex-col
                            bg-[#2c2a2a]
                            p-4
                            rounded-xl
                            overflow-x-auto lg:overflow-hidden
                            w-full lg:w-56 lg:min-w-56
                            h-fit
                            shadow-sm
                            gap-1
          "
                >
                    <TabsTrigger
                        value="overview"
                        className="
                        group relative
                        w-full
                        justify-start
                        gap-3
                        px-5 py-3.5
                        text-left
                        whitespace-nowrap
                        data-[state=inactive]:text-gray-400
                        data-[state=active]:bg-emerald-700
                        data-[state=active]:text-white
                        data-[state=active]:shadow-inner
                        hover:bg-emerald-700/50
                        transition-colors
                        border-l-4 border-transparent
                        data-[state=active]:border-l-emerald-500
            "
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        <span className="font-medium">Overview</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="kyc_documents"
                        className="
                        group relative
                        w-full
                        justify-start
                        gap-3
                        px-5 py-3.5
                        text-left
                        whitespace-nowrap
                        data-[state=inactive]:text-gray-400
                        data-[state=active]:bg-emerald-700
                        data-[state=active]:text-white
                        data-[state=active]:shadow-inner
                        hover:bg-emerald-700/50
                        transition-colors
                        border-l-4 border-transparent
                        data-[state=active]:border-l-emerald-500
            "
                    >
                        <FileText size={18} className="shrink-0" />
                        <span className="font-medium">KYC Documents</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="contact"
                        className="
                        group relative
                        w-full
                        justify-start
                        gap-3
                        px-5 py-3.5
                        text-left
                        whitespace-nowrap
                        data-[state=inactive]:text-gray-400
                        data-[state=active]:bg-emerald-700
                        data-[state=active]:text-white
                        data-[state=active]:shadow-inner
                        hover:bg-emerald-700/50
                        transition-colors
                        border-l-4 border-transparent
                        data-[state=active]:border-l-emerald-500
            "
                    >
                        <Mail size={18} className="shrink-0" />
                        <span className="font-medium">Contact Info</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="property"
                        className="
                        group relative
                        w-full
                        justify-start
                        gap-3
                        px-5 py-3.5
                        text-left
                        whitespace-nowrap
                        data-[state=inactive]:text-gray-400
                        data-[state=active]:bg-emerald-700
                        data-[state=active]:text-white
                        data-[state=active]:shadow-inner
                        hover:bg-emerald-700/50
                        transition-colors
                        border-l-4 border-transparent
                        data-[state=active]:border-l-emerald-500
            "
                    >
                        <LandPlot size={18} className="shrink-0" />
                        <span className="font-medium">Property</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="security"
                        className="
                        group relative
                        w-full
                        justify-start
                        gap-3
                        px-5 py-3.5
                        text-left
                        whitespace-nowrap
                        data-[state=inactive]:text-gray-400
                        data-[state=active]:bg-emerald-700
                        data-[state=active]:text-white
                        data-[state=active]:shadow-inner
                        hover:bg-emerald-700/50
                        transition-colors
                        border-l-4 border-transparent
                        data-[state=active]:border-l-emerald-500
            "
                    >
                        <Lock size={18} className="shrink-0" />
                        <span className="font-medium">Security</span>
                    </TabsTrigger>
                </TabsList>

                {/* Main content area */}
                <div className="lg:col-span-5 w-full">
                    {/* Profile Header – always visible */}
                    <div className="bg-[#2c2a2a] p-6 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <img
                                        src={user?.avatarUrl || "/nayan-dhali.jpg"}
                                        alt={user?.fullName || "User profile"}
                                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isImageUpdating}
                                        className="absolute -bottom-1 -right-1 bg-emerald-900 p-1 rounded-full hover:bg-emerald-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        aria-label="Upload profile photo"
                                    >
                                        <svg className="cursor-pointer w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-lg md:text-xl font-semibold text-white truncate">{user?.fullName}</h2>

                                    <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                                        <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                                            <span className="text-gray-400">User ID:</span>
                                            <span className="text-gray-200 font-medium">{user?.id}                                                        </span>
                                        </div>
{
    user?.isVerified ?   <button className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-medium rounded-full border border-blue-700/40 shrink-0">
                                            
                                             Verified
                                        </button> : <button className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/60 text-red-300 text-xs font-medium rounded-full border border-red-700/40 shrink-0">
                                            
                                             Not Verified
                                        </button>
    
}
                                      
                                    </div>


                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{user?.nationality}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-white flex items-center gap-2 bg-gray-500/20 border-none hover:bg-emerald-700 mt-3 sm:mt-0 w-full sm:w-auto"
                            >
                                <Edit size={16} /> <span>Edit Profile</span>
                            </Button>
                        </div>

                        {/* Golden Visa Progress */}
                            <div className="px-4 sm:px-6 mt-4">
                                <div className="bg-linear-to-r from-emerald-800/50  to-yellow-600/40 rounded-xl px-4 sm:px-6 py-4 border-t border-gray-800">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <Trophy className="text-yellow-400 w-6 h-6" />
                                            <span className="font-medium text-white">Golden Visa Progress</span>
                                        </div>
                                        <span className="text-yellow-400 font-semibold">{goldenVisaProgress}%</span>
                                    </div>

                                    <Progress
                                        value={goldenVisaProgress}
                                        className="h-3 bg-gray-800/70 rounded-full overflow-hidden [&>div]:bg-linear-to-r [&>div]:from-emerald-500 [&>div]:via-lime-400 [&>div]:to-yellow-400"
                                    />

                                    <div className="mt-2.5 flex items-center gap-2 text-sm">
                                        <Trophy className={`w-4 h-4 ${goldenVisaProgress === 100 ? 'text-emerald-300' : 'text-gray-400'}`} />
                                        <span className={`${goldenVisaProgress === 100 ? 'text-emerald-300' : 'text-gray-400'} font-medium`}>
                                            {goldenVisaProgress === 100 ? 'Golden Visa Eligible!' : 'Application in progress'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        <div className="px-4 sm:px-6 pb-4">
                            <div className="bg-[#434141] p-3 rounded-lg mt-4 flex flex-col sm:flex-row justify-between text-sm gap-3">
                                <div>
                                    <p className="text-gray-400">FAL License</p>
                                    <p>FAL-RYD-2023-1547</p>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-gray-300">Expires</p>
                                    <p>2025-12-31</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab contents */}
                    <TabsContent value="overview" className="mt-6">
                        <BuyerProfileOverview
                            user={user}
                            onEditContact={() => setIsContactEditModalOpen(true)}
                        />
                    </TabsContent>
                    <TabsContent value="kyc_documents" className="mt-6">
                        <BuyerProfileKYCDocuments />
                    </TabsContent>
                    <TabsContent value="contact" className="mt-6">
                        <BuyerProfileContactInfo
                            user={user}
                            onEditContact={() => setIsContactEditModalOpen(true)}
                        />
                    </TabsContent>
                    <TabsContent value="security" className="mt-6">
                        <BuyerProfileSecurity />
                    </TabsContent>
                    <TabsContent value="property" className="mt-6">
                        <BuyerProfileProperty />
                    </TabsContent>
                </div>
            </Tabs>

            <BuyerEditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />

            <BuyerContactEditModal
                isOpen={isContactEditModalOpen}
                onClose={() => setIsContactEditModalOpen(false)}
                user={user}
            />
        </div>
    );
}