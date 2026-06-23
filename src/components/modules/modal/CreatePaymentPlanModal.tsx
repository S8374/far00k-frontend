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
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreatePaymentPlanMutation } from "@/redux/api/paymentPlanApi";

const paymentPlanOptions = ["Off-Line Payment Plan"] as const;

/* ---------------- ZOD SCHEMA ---------------- */
const paymentPlanSchema = z.object({
  name: z.string().min(3, "Payment plan name is required"),
  totalInstallments: z
    .number({
      message: "Installments must be a number",
    })
    .min(1, "Minimum 1 installment required")
    .max(120, "Maximum 120 installments allowed"),
  description: z.string().min(5, "Description is required"),
});

type FormValues = z.infer<typeof paymentPlanSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
}

export default function CreatePaymentPlanModal({
  open,
  onClose,
  propertyId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(paymentPlanSchema),
    defaultValues: {
      name: paymentPlanOptions[0],
      totalInstallments: 6,
    },
  });

  const [createPaymentPlan, { isLoading }] = useCreatePaymentPlanMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        propertyId,
        ...data,
      };

      const res = await createPaymentPlan(payload).unwrap();

      if (res.success) {
        toast.success("Payment plan created successfully");
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create payment plan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2E2E2E] text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Payment Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Plan Name */}
          <div className="space-y-1">
            <Label>Plan Type</Label>
            <select
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1E1E1E] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            >
              {paymentPlanOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Total Installments */}
          <div className="space-y-1">
            <Label>Total Installments</Label>
            <Input
              type="number"
              {...register("totalInstallments", { valueAsNumber: true })}
              value={6}
              disabled
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.totalInstallments && (
              <p className="text-red-500 text-sm">
                {errors.totalInstallments.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="20% down payment, remaining in 24 monthly installments"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="animate-spin h-4 w-4 text-white" />
            )}
            Create Payment Plan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
