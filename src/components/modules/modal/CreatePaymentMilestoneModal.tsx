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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreatePaymentMilestoneMutation } from "@/redux/api/mileston.api";


/* ---------------- ZOD SCHEMA ---------------- */

const milestoneSchema = z.object({
  tittle: z.string().min(3, "Title is required"),

  milestoneOrder: z
    .number({ message: "Milestone order required" })
    .min(1, "Order must be at least 1"),

  description: z.string().min(5, "Description is required"),

  amount: z
    .number({ message: "Amount is required" })
    .min(1, "Amount must be greater than 0"),

  dueDate: z.string().min(1, "Due date required"),

  constructionProgress: z
    .number({ message: "Construction progress required" })
    .min(0)
    .max(100),
});

type FormValues = z.infer<typeof milestoneSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatePaymentMilestoneModal({
  open,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(milestoneSchema),
  });

  const [createMilestone, { isLoading }] =
    useCreatePaymentMilestoneMutation()
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
      };
      return
      const res = await createMilestone(payload).unwrap();

      if (res.success) {
        toast.success("Milestone created successfully");
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create milestone");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2E2E2E] text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Payment Milestone</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

          {/* Title */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              {...register("tittle")}
              placeholder="Foundation Stage"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.tittle && (
              <p className="text-red-500 text-sm">{errors.tittle.message}</p>
            )}
          </div>

          {/* Milestone Order */}
          <div className="space-y-1">
            <Label>Milestone Order</Label>
            <Input
              type="number"
              {...register("milestoneOrder", { valueAsNumber: true })}
              placeholder="1"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.milestoneOrder && (
              <p className="text-red-500 text-sm">
                {errors.milestoneOrder.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Complete foundation work"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <Label>Amount</Label>
            <Input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="500000"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <Label>Due Date</Label>
            <Input
              type="date"
              {...register("dueDate")}
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Construction Progress */}
          <div className="space-y-1">
            <Label>Construction Progress (%)</Label>
            <Input
              type="number"
              {...register("constructionProgress", { valueAsNumber: true })}
              placeholder="10"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.constructionProgress && (
              <p className="text-red-500 text-sm">
                {errors.constructionProgress.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <Loader2 className="animate-spin h-4 w-4 text-white" />
            )}
            Create Milestone
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}