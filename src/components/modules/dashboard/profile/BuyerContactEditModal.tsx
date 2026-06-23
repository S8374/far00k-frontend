"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";

type BuyerContactEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
};

export default function BuyerContactEditModal({
  isOpen,
  onClose,
  user,
}: BuyerContactEditModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editProfile, { isLoading }] = useEditProfileMutation();

  useEffect(() => {
    if (!isOpen) return;
    setPhoneNumber(user?.phoneNumber || "");
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      const res = await editProfile({
        phoneNumber: phoneNumber.trim(),
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Contact number updated successfully");
      } else {
        toast.success("Contact number updated successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update contact number");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2c2a2a] border-none text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Contact Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Contact Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-[#434141] border-none text-white"
              placeholder="Enter contact number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              value={user?.email || ""}
              disabled
              className="bg-[#434141] border-none text-white opacity-70"
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
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
