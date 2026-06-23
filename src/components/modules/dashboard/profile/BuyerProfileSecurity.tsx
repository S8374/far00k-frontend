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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMeQuery, useChangePasswordMutation } from "@/redux/api/authApi";
import { Shield, Calendar, Lock, CircleCheckBig, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BuyerProfileSecurity() {
  const { data: userData } = useGetMeQuery({});
  const user = userData?.data?.data;
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setEmail(user?.email || "");
  }, [user?.email]);

  const resetForm = () => {
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword) {
      toast.error("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        email,
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      setIsChangePasswordOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <div className="bg-[#2c2a2a] p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
      
        <div className="space-y-4">
     
          <div className="flex justify-between items-center bg-[#434141] p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Shield size={18} className="text-blue-400" />
              <span>Natfah Verification</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-500">
              <span>Connected & Verified</span>
              <CircleCheckBig size={16} />
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#434141] p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-emerald-600" />
              <span>Last Login</span>
            </div>
            <span className="text-gray-300">2024-12-27 09:30</span>
          </div>

          <div className="flex justify-center items-center">
            <Button
              type="button"
              onClick={() => setIsChangePasswordOpen(true)}
              className="text-white bg-[#434141] hover:bg-emerald-600 w-full"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={(open) => {
          setIsChangePasswordOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="bg-[#2c2a2a] border-none text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Change Password</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update your account password securely.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className="bg-[#434141] border-none text-white"
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-gray-400">Email address cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#434141] border-none text-white"
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#434141] border-none text-white"
                placeholder="Enter new password (min. 6 characters)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#434141] border-none text-white"
                placeholder="Confirm new password"
                required
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Password must be at least 6 characters long.
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  resetForm();
                }}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}