"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreatePropertyBankAccountsMutation } from "@/redux/api/bankAccountApi";

/* ---------------- ZOD SCHEMA ---------------- */
const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountHolder: z.string().min(2, "Account holder is required"),
  accountNumber: z
    .string()
    .min(5, "Account number is required"),
  iban: z
    .string()
    .min(15, "IBAN is required"),
  swiftCode: z
    .string()
    .min(8, "SWIFT/BIC is required"),
  branchAddress: z.string().min(3, "Branch address is required"),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof bankAccountSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  userId: string;
}

export default function CreateBankAccountModal({
  open,
  onClose,
  propertyId,
  userId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bankAccountSchema),
  });

  const [createBankAccount, { isLoading: bankAccountCreateLoading }] =
    useCreatePropertyBankAccountsMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        propertyId,
        userId,
        ...data,
      };

      const res = await createBankAccount(payload).unwrap();

      if (res.success) {
        toast.success("Bank account created successfully");
        reset();
        onClose();
      }
    } catch (error: any) {
      if (error?.data?.message) toast.error(error.data.message);
      else toast.error("Failed to create bank account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2E2E2E] text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Bank Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Bank Name */}
          <div className="space-y-1">
            <Label>Bank Name</Label>
            <Input
              {...register("bankName")}
              placeholder="Al Rajhi Bank"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm">{errors.bankName.message}</p>
            )}
          </div>

          {/* Account Holder */}
          <div className="space-y-1">
            <Label>Account Holder</Label>
            <Input
              {...register("accountHolder")}
              placeholder="Company Name"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.accountHolder && (
              <p className="text-red-500 text-sm">
                {errors.accountHolder.message}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-1">
            <Label>Account Number</Label>
            <Input
              {...register("accountNumber")}
              placeholder="123456789"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          {/* IBAN */}
          <div className="space-y-1">
            <Label>IBAN</Label>
            <Input
              {...register("iban")}
              placeholder="SA44 8000 0000 6080 1016 7519"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.iban && (
              <p className="text-red-500 text-sm">{errors.iban.message}</p>
            )}
          </div>

          {/* SWIFT Code */}
          <div className="space-y-1">
            <Label>SWIFT/BIC</Label>
            <Input
              {...register("swiftCode")}
              placeholder="RJHISARI"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.swiftCode && (
              <p className="text-red-500 text-sm">
                {errors.swiftCode.message}
              </p>
            )}
          </div>

          {/* Branch Address */}
          <div className="space-y-1">
            <Label>Branch Address</Label>
            <Input
              {...register("branchAddress")}
              placeholder="Branch location"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.branchAddress && (
              <p className="text-red-500 text-sm">
                {errors.branchAddress.message}
              </p>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-1">
            <Label>Additional Info</Label>
            <Input
              {...register("additionalInfo")}
              placeholder="Optional information"
              className="bg-[#1E1E1E] border-gray-700"
            />
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600   hover:bg-emerald-700 flex items-center justify-center gap-2"
            disabled={bankAccountCreateLoading}
          >
            {bankAccountCreateLoading && (
              <Loader2 className="animate-spin h-4 w-4 text-white" />
            )}
            Create Bank Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}