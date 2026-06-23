"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";

type BuyerEditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
};

type FormState = {
  fullName: string;
  nationality: string;
};

const initialState: FormState = {
  fullName: "",
  nationality: "",
};

export default function BuyerEditProfileModal({
  isOpen,
  onClose,
  user,
}: BuyerEditProfileModalProps) {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [editProfile, { isLoading }] = useEditProfileMutation();

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      fullName: user?.fullName || "",
      nationality: user?.nationality || "",
    });
  }, [isOpen, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    const payload: Record<string, string> = {
      fullName: formData.fullName.trim(),
      nationality: formData.nationality.trim(),
    };

    try {
      const res = await editProfile(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Profile updated successfully");
      } else {
        toast.success("Profile updated successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2c2a2a] border-none text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-[#434141] border-none text-white"
              placeholder="Enter full name"
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
              placeholder="Enter nationality"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
