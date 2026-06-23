"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { Loader2, Landmark } from "lucide-react";

import { useUpdateBankAccountMutation } from "@/redux/api/bankAccountApi";

const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountHolder: z.string().min(2, "Account holder name is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
  branchAddress: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof bankAccountSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  bankAccount: any;
  propertyId: string;
}

export default function EditBankAccountModal({
  open,
  onClose,
  bankAccount,
  propertyId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      iban: "",
      swiftCode: "",
      branchAddress: "",
      additionalInfo: "",
    },
  });

  const [updateBankAccount, { isLoading }] = useUpdateBankAccountMutation();

  // Populate form with bank account data when it loads
  useEffect(() => {
    if (bankAccount) {
      reset({
        bankName: bankAccount.bankName || "",
        accountHolder: bankAccount.accountHolder || "",
        accountNumber: bankAccount.accountNumber || "",
        iban: bankAccount.iban || "",
        swiftCode: bankAccount.swiftCode || "",
        branchAddress: bankAccount.branchAddress || "",
        additionalInfo: bankAccount.additionalInfo || "",
      });
    }
  }, [bankAccount, reset]);

  const onSubmit = async (form: FormValues) => {
    try {
      const payload = {
        id: bankAccount.id,
        data: form,
      };

      const res = await updateBankAccount(payload).unwrap();

      if (res.success) {
        toast.success("Bank account updated successfully");
        onClose();
      }
    } catch (error: any) {
      console.error("Error updating bank account:", error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to update bank account");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2E2E2E] text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-emerald-500" />
            Edit Bank Account
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Bank Name */}
          <div className="space-y-1">
            <Label>Bank Name <span className="text-red-500">*</span></Label>
            <Input
              {...register("bankName")}
              placeholder="Enter bank name"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm">{errors.bankName.message}</p>
            )}
          </div>

          {/* Account Holder */}
          <div className="space-y-1">
            <Label>Account Holder <span className="text-red-500">*</span></Label>
            <Input
              {...register("accountHolder")}
              placeholder="Enter account holder name"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.accountHolder && (
              <p className="text-red-500 text-sm">{errors.accountHolder.message}</p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-1">
            <Label>Account Number <span className="text-red-500">*</span></Label>
            <Input
              {...register("accountNumber")}
              placeholder="Enter account number"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm">{errors.accountNumber.message}</p>
            )}
          </div>

          {/* IBAN */}
          <div className="space-y-1">
            <Label>IBAN</Label>
            <Input
              {...register("iban")}
              placeholder="Enter IBAN"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.iban && (
              <p className="text-red-500 text-sm">{errors.iban.message}</p>
            )}
          </div>

          {/* SWIFT Code */}
          <div className="space-y-1">
            <Label>SWIFT Code</Label>
            <Input
              {...register("swiftCode")}
              placeholder="Enter SWIFT code"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.swiftCode && (
              <p className="text-red-500 text-sm">{errors.swiftCode.message}</p>
            )}
          </div>

          {/* Branch Address */}
          <div className="space-y-1">
            <Label>Branch Address</Label>
            <Input
              {...register("branchAddress")}
              placeholder="Enter branch address"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.branchAddress && (
              <p className="text-red-500 text-sm">{errors.branchAddress.message}</p>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-1">
            <Label>Additional Information</Label>
            <Textarea
              {...register("additionalInfo")}
              placeholder="Any additional information..."
              rows={3}
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.additionalInfo && (
              <p className="text-red-500 text-sm">{errors.additionalInfo.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 mt-6"
          >
            {(isLoading || isSubmitting) && <Loader2 className="animate-spin h-4 w-4" />}
            Update Bank Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}