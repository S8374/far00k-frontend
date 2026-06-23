"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Mail,
  Lock,
  Edit,
  Verified,
  CircleCheckBig,
  Flag,
} from "lucide-react";
import ProfileOverview from "@/components/modules/dashboard/profile/ProfileOverview";
import ProfileContactInfo from "@/components/modules/dashboard/profile/ProfileContactInfo";
import ProfileSecurity from "@/components/modules/dashboard/profile/ProfileSecurity";
import Image from "next/image";
import { useGetMeQuery } from "@/redux/api/authApi";
import { GoUnverified } from "react-icons/go";
import { ProfileSkeleton } from "../../Skeleton/ProfileSkeleton";
import { useState, useRef } from "react";
import EditProfileModal from "@/components/modules/dashboard/profile/EditProfileModal";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";

export const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.split(" ");
  const first = parts[0]?.charAt(0) || "";
  const second = parts[1]?.charAt(0) || "";
  return (first + second).toUpperCase();
};

export default function AgentProfile() {
  const [isBasicEditModalOpen, setIsBasicEditModalOpen] = useState(false);
  const [isAgencyEditModalOpen, setIsAgencyEditModalOpen] = useState(false);
  const { data: meData, isLoading, isFetching, refetch } = useGetMeQuery(undefined);
  const [updateProfile, { isLoading: isProfileLoading }] =
    useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadImages, { isLoading: uploadImageLoading }] =
    useUploadImagesMutation();

  const user = meData?.data?.data || meData?.data || meData;
  const id = user?.id || user?._id || user?.uid || user?.userId;
  const bio = user?.agentProfile?.bio;

  const handleImageUpload = async (selectedFile: File) => {
    try {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image must be 5MB or less");
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("files", selectedFile);

      const uploadResponse = await uploadImages(imageFormData).unwrap();
      const uploadData: any = uploadResponse;
      const imageUrl =
        uploadData?.data?.urls?.[0] ||
        uploadData?.data?.data?.urls?.[0] ||
        uploadData?.urls?.[0] ||
        uploadData?.data?.url ||
        uploadData?.url;

      if (!imageUrl) {
        toast.error("Failed to upload photo");
        return;
      }

      await updateProfile({ avatarUrl: imageUrl }).unwrap();
      await refetch();
      toast.success("Photo updated successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleImageUpload(selectedFile);
    }
  };

  if (isLoading || isFetching) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="px-2 sm:px-4">
        <div className="bg-[#2c2a2a] p-6 rounded-lg text-center text-gray-300">
          Profile information is not available right now.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-2 sm:px-4">
        <h1 className="text-xl font-semibold">My Profile</h1>
        <p className="text-sm text-gray-300 mb-6">
          Professional agent profile & verification
        </p>

        {/* 
          KEY FIX: Removed the Tabs wrapper as layout container.
          Now we use a plain div for layout, keeping Tabs only for tab logic.
          - Mobile/md: flex-col (tabs nav on top, content below, full width)
          - lg+: flex-row (tabs nav on left sidebar, content on right)
        -->
        */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full">

            {/* Left Sidebar Tabs - stacks vertically on lg+, horizontal row on smaller */}
            <TabsList
              className="
                flex flex-row lg:flex-col
                bg-[#2c2a2a]
                p-4
                rounded-xl
                overflow-x-auto
                w-full lg:w-56 lg:min-w-56 lg:max-w-56
                h-fit
                shadow-sm
                gap-1
                shrink-0
                self-start
              "
            >
              <TabsTrigger
                value="overview"
                className="
                  flex-1 lg:flex-none
                  lg:w-full
                  justify-start
                  gap-3
                  px-3 sm:px-5 py-3.5
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
                value="contact"
                className="
                  flex-1 lg:flex-none
                  lg:w-full
                  justify-start
                  gap-3
                  px-3 sm:px-5 py-3.5
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
                value="security"
                className="
                  flex-1 lg:flex-none
                  lg:w-full
                  justify-start
                  gap-3
                  px-3 sm:px-5 py-3.5
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

            {/* Right Content Area - takes remaining space, never overflows */}
            <div className="flex-1 min-w-0 w-full">
              {/* Common Profile Header */}
              <div className="bg-[#2c2a2a] p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="relative shrink-0">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user?.fullName}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-700 flex items-center justify-center text-white font-semibold text-lg">
                          {getInitials(user?.fullName)}
                        </div>
                      )}

                      {/* Camera Button */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 bg-emerald-900 p-1 rounded-full cursor-pointer hover:bg-emerald-800 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploadImageLoading || isProfileLoading}
                      />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold">{user?.fullName}</h2>

                      <div className="flex flex-wrap gap-2 mt-1">
                        <p className="text-sm text-gray-200 bg-gray-500/20 px-3 rounded-full">
                          Agent ID: AGT-{user?.id?.slice(0, 8)}
                        </p>
                        {user?.agentProfile?.isRegaVerified ? (
                          <Badge className="bg-emerald-700 text-white flex items-center gap-1">
                            <Verified size={16} /> REGA Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white flex items-center gap-1">
                            <GoUnverified size={16} /> REGA Not Verified
                          </Badge>
                        )}

                        {user?.agentProfile?.isNafathVerified ? (
                          <Badge className="bg-blue-600 text-white flex items-center gap-1">
                            <CircleCheckBig size={16} /> Nafath Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white flex items-center gap-1">
                            <GoUnverified size={16} /> Nafath Not Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-3.5">
                        <div className="flex items-center gap-2 mt-1">
                          <Image
                            src="/vision.svg"
                            alt="vision"
                            height={16}
                            width={16}
                          />
                          <p>{user?.agentProfile?.agencyName}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Flag className="w-4" />
                          <p>{user?.nationality}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setIsBasicEditModalOpen(true)}
                    disabled={uploadImageLoading || isProfileLoading}
                    className="text-white flex items-center space-x-2 bg-gray-500/20 border-none hover:bg-emerald-700 shrink-0"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </Button>
                </div>

                <div className="bg-[#434141] p-3 rounded-lg mt-4 flex flex-col sm:flex-row justify-between text-sm gap-2">
                  <div className="flex-1">
                    <p className="text-gray-300">FAL License</p>
                    <p>
                      FAL-{user?.agentProfile?.licenseId || "N/A"}
                    </p>
                  </div>
                  <div className="sm:text-right flex-1">
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <p className="text-gray-300">Years Of Experience</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAgencyEditModalOpen(true)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                    <p>
                      {user?.agentProfile?.yearsExperience || 0}{" "}
                      years
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Contents */}
              <TabsContent value="overview" className="mt-6">
                <ProfileOverview id={id} bio={bio} user={user} />
              </TabsContent>
              <TabsContent value="contact" className="mt-6">
                <ProfileContactInfo user={user} />
              </TabsContent>
              <TabsContent value="security" className="mt-6">
                <ProfileSecurity user={user} />
              </TabsContent>
            </div>

          </div>
        </Tabs>
      </div>

      {/* Edit Profile Modals */}
      <EditProfileModal
        isOpen={isBasicEditModalOpen}
        onClose={() => setIsBasicEditModalOpen(false)}
        user={user}
        section="basic"
      />

      <EditProfileModal
        isOpen={isAgencyEditModalOpen}
        onClose={() => setIsAgencyEditModalOpen(false)}
        user={user}
        section="agency"
      />
    </>
  );
}