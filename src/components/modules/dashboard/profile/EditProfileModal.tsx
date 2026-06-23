// components/modules/dashboard/profile/EditProfileModal.tsx
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/redux/api/authApi";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    section: "basic" | "contact" | "bio" | "security" | "agency";
}

export default function EditProfileModal({ isOpen, onClose, user, section }: EditProfileModalProps) {
    const [updateProfile, { isLoading: isProfileLoading }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isPasswordLoading }] = useChangePasswordMutation();

    const [formData, setFormData] = useState(() => {
        switch (section) {
            case "basic":
                return {
                    fullName: user?.fullName || "",
                    nationality: user?.nationality || "",
                    phoneNumber: user?.phoneNumber || "",
                    agencyName: user?.agentProfile?.agencyName || "",
                };
            case "agency":
                return {
                    yearsExperience: user?.agentProfile?.yearsExperience || 0,
                    licenseId: user?.agentProfile?.licenseId || "",
                };
            case "contact":
                return {
                    phoneNumber: user?.phoneNumber || "",
                    email: user?.email || "",
                    agencyName: user?.agentProfile?.agencyName || "",
                };
            case "bio":
                return {
                    bio: user?.agentProfile?.bio || "",
                };
            case "security":
                return {
                    email: "",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                };
            default:
                return {};
        }
    });

    // Update form data when user prop changes or modal opens
    useEffect(() => {
        if (isOpen) {
            switch (section) {
                case "basic":
                    setFormData({
                        fullName: user?.fullName || "",
                        nationality: user?.nationality || "",
                        phoneNumber: user?.phoneNumber || "",
                        agencyName: user?.agentProfile?.agencyName || "",
                    });
                    break;
                case "agency":
                    setFormData({
                        yearsExperience: user?.agentProfile?.yearsExperience || 0,
                        licenseId: user?.agentProfile?.licenseId || "",
                    });
                    break;
                case "contact":
                    setFormData({
                        phoneNumber: user?.phoneNumber || "",
                        email: user?.email || "",
                        agencyName: user?.agentProfile?.agencyName || "",
                    });
                    break;
                case "bio":
                    setFormData({
                        bio: user?.agentProfile?.bio || "",
                    });
                    break;
                case "security":
                    setFormData({
                        email: "",
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                    break;
            }
        }
    }, [user, section, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Handle password change
            if (section === "security") {
                // Validate email
                if (!formData.email) {
                    toast.error("Email is required");
                    return;
                }

                // Validate current password
                if (!formData.currentPassword) {
                    toast.error("Current password is required");
                    return;
                }

                // Validate new password
                if (!formData.newPassword) {
                    toast.error("New password is required");
                    return;
                }

                if (formData.newPassword.length < 6) {
                    toast.error("New password must be at least 6 characters");
                    return;
                }

                // Validate confirm password
                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error("New passwords do not match");
                    return;
                }

                // Call change password API
                await changePassword({
                    email: formData.email,
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }).unwrap();

                toast.success("Password changed successfully");
                onClose();
                return;
            }

            // Handle profile updates
            let updateData = {};

            switch (section) {
                case "basic":
                    updateData = {
                        fullName: formData.fullName,
                        nationality: formData.nationality
                    };
                    break;
                case "agency":
                    updateData = {
                        yearsExperience: Number(formData.yearsExperience),
                    };
                    break;
                case "contact":
                    updateData = {
                        phoneNumber: formData.phoneNumber,
                        agencyName: formData.agencyName,
                    };
                    break;
                case "bio":
                    updateData = {
                        bio: formData.bio,
                    };
                    break;
            }

            await updateProfile(updateData).unwrap();
            toast.success("Profile updated successfully");
            onClose();
        } catch (error: any) {
            console.error("Update error:", error);
            toast.error(error?.data?.message || "Failed to update");
        }
    };

    const renderForm = () => {
        switch (section) {
            case "basic":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                                id="nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter your nationality"
                            />
                        </div>
                   
                    </>
                );

            case "agency":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="yearsExperience">Years of Experience</Label>
                            <Input
                                id="yearsExperience"
                                name="yearsExperience"
                                type="number"
                                min="0"
                                value={formData.yearsExperience}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter years of experience"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licenseId">FAL License ID</Label>
                            <Input
                                id="licenseId"
                                name="licenseId"
                                value={formData.licenseId}
                                disabled
                                className="bg-[#434141] border-none text-white opacity-50"
                            />
                            <p className="text-xs text-gray-400">License ID cannot be changed</p>
                        </div>
                    </>
                );

            case "contact":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agencyName">Agency Name</Label>
                            <Input
                                id="agencyName"
                                name="agencyName"
                                value={formData.agencyName}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter agency name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="bg-[#434141] border-none text-white opacity-50"
                            />
                            <p className="text-xs text-gray-400">Email cannot be changed</p>
                        </div>
                    </>
                );

            case "bio":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="bg-[#434141] border-none text-white resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </>
                );

            case "security":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Enter new password (min. 6 characters)"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-[#434141] border-none text-white"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Password must be at least 6 characters long
                        </p>
                    </>
                );
        }
    };

    const getTitle = () => {
        switch (section) {
            case "basic": return "Edit Basic Information";
            case "agency": return "Edit Agency Information";
            case "contact": return "Edit Contact Information";
            case "bio": return "Edit Bio";
            case "security": return "Change Password";
        }
    };

    const isLoading = section === "security" ? isPasswordLoading : isProfileLoading;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#2c2a2a] border-none text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{getTitle()}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {renderForm()}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}