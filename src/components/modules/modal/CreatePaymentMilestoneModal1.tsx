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
import { Loader2, Calendar } from "lucide-react";

import { useCreatePaymentMilestoneMutation, useGetMilestonesByPlanQuery } from "@/redux/api/mileston.api";

// Predefined milestone templates based on order - UPDATED to match database
const MILESTONE_TEMPLATES = {
  1: {
    title: "Deposit (10%)",
    description: "Initial booking deposit to secure property",
    constructionProgress: 0,  // This is correct for deposit
    amountPercentage: 10,
  },
  2: {
    title: "On 20% Completion",
    description: "Payment after foundation and structural work completion",
    constructionProgress: 20,  // Changed from 20 to 20 to match template title
    amountPercentage: 20,
  },
  3: {
    title: "On 40% Completion",
    description: "Payment after walls and roofing completion",
    constructionProgress: 40,
    amountPercentage: 30,
  },
  4: {
    title: "On 60% Completion",
    description: "Payment after electrical and plumbing installation",
    constructionProgress: 60,
    amountPercentage: 20,
  },
  5: {
    title: "On 80% Completion",
    description: "Payment after finishing and fixtures installation",
    constructionProgress: 80,
    amountPercentage: 10,
  },
  6: {
    title: "Final Payment (100%)",
    description: "Final payment upon handover and title deed transfer",
    constructionProgress: 100,
    amountPercentage: 10,
  },
} as const;

// Calculate total construction progress to ensure it's 100%
const TOTAL_CONSTRUCTION_PROGRESS = Object.values(MILESTONE_TEMPLATES).reduce(
  (sum, template) => sum + template.constructionProgress, 
  0
);

console.log("Total construction progress:", TOTAL_CONSTRUCTION_PROGRESS); // Should be 300? Wait, that's not right

// Let's fix the construction progress values to sum to 100%
const FIXED_MILESTONE_TEMPLATES = {
  1: {
    title: "Deposit (10%)",
    description: "Initial booking deposit to secure property",
    constructionProgress: 0,
    amountPercentage: 10,
  },
  2: {
    title: "On 20% Completion",
    description: "Payment after foundation and structural work completion",
    constructionProgress: 20,  // Progress from 0% to 20%
    amountPercentage: 20,
  },
  3: {
    title: "On 40% Completion",
    description: "Payment after walls and roofing completion",
    constructionProgress: 20,  // Progress from 20% to 40% (20% increase)
    amountPercentage: 30,
  },
  4: {
    title: "On 60% Completion",
    description: "Payment after electrical and plumbing installation",
    constructionProgress: 20,  // Progress from 40% to 60% (20% increase)
    amountPercentage: 20,
  },
  5: {
    title: "On 80% Completion",
    description: "Payment after finishing and fixtures installation",
    constructionProgress: 20,  // Progress from 60% to 80% (20% increase)
    amountPercentage: 10,
  },
  6: {
    title: "Final Payment (100%)",
    description: "Final payment upon handover and title deed transfer",
    constructionProgress: 20,  // Progress from 80% to 100% (20% increase)
    amountPercentage: 10,
  },
} as const;

// Now total construction progress = 0 + 20 + 20 + 20 + 20 + 20 = 100%

const milestoneSchema = z.object({
  tittle: z.string().min(3, "Milestone title is required"),
  description: z.string().min(5, "Description is required"),
  milestoneOrder: z
    .number()
    .min(1, "Please select a milestone order")
    .max(6, "Maximum order is 6"),
  dueDate: z.string().min(1, "Due date is required"),
  amount: z.number().positive("Amount must be positive"),
  constructionProgress: z
    .number()
    .min(0)
    .max(100),
});

type FormValues = z.infer<typeof milestoneSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  paymentPlanId?: string;
  totalPropertyPrice?: number;
}

export default function CreatePaymentMilestoneModal1({
  open,
  onClose,
  paymentPlanId,
  totalPropertyPrice = 4200000,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      tittle: "",
      description: "",
      amount: 0,
      constructionProgress: 0,
      dueDate: "",
    },
  });

  const selectedOrder = watch("milestoneOrder");
  const [createMilestone, { isLoading }] = useCreatePaymentMilestoneMutation();

  const { data, refetch } = useGetMilestonesByPlanQuery(
    { planId: paymentPlanId },
    { skip: !paymentPlanId || !open }
  );
  
  const milestones = Array.isArray(data?.data) ? data.data : [];
  const existingOrders = milestones.map((m: any) => m.milestoneOrder);
  const availableOrders = [1, 2, 3, 4, 5, 6].filter(
    (order) => !existingOrders.includes(order)
  );
  const milestoneCount = milestones.length;
  const reachedLimit = milestoneCount >= 6;

  // Auto-fill fields ONLY when user manually selects an order
  useEffect(() => {
    if (!selectedOrder) return;
    
    const template = FIXED_MILESTONE_TEMPLATES[selectedOrder as keyof typeof FIXED_MILESTONE_TEMPLATES];
    if (!template) return;

    // Fill in the template values
    setValue("tittle", template.title, { shouldValidate: false });
    setValue("description", template.description, { shouldValidate: false });
    setValue("constructionProgress", template.constructionProgress, { shouldValidate: false });

    const calculatedAmount = (totalPropertyPrice * template.amountPercentage) / 100;
    setValue("amount", calculatedAmount, { shouldValidate: false });
    
  }, [selectedOrder, setValue, totalPropertyPrice]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (form: FormValues) => {
    try {
      const payload = {
        planId: paymentPlanId,
        tittle: form.tittle,
        description: form.description,
        milestoneOrder: Number(form.milestoneOrder),
        amount: form.amount,
        constructionProgress: form.constructionProgress,
        dueDate: new Date(form.dueDate).toISOString(),
      };

      const res = await createMilestone(payload).unwrap();

      if (res.success) {
        toast.success("Milestone created successfully");
        reset();
        refetch();
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating milestone:", error);

      if (error?.data?.errors) {
        error.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create milestone");
      }
    }
  };

  const getTemplateForOrder = (order: number) => {
    return FIXED_MILESTONE_TEMPLATES[order as keyof typeof FIXED_MILESTONE_TEMPLATES];
  };

  // Calculate cumulative construction progress up to selected order
  const getCumulativeProgress = (order: number) => {
    let total = 0;
    for (let i = 1; i <= order; i++) {
      const template = FIXED_MILESTONE_TEMPLATES[i as keyof typeof FIXED_MILESTONE_TEMPLATES];
      total += template.constructionProgress;
    }
    return total;
  };

  // Don't render form content if modal is closed
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#2E2E2E] text-white border-gray-700 max-w-lg"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Create Payment Milestone
          </DialogTitle>
        </DialogHeader>

        {reachedLimit ? (
          <div className="text-center py-6 text-red-400">
            Maximum 6 milestones allowed for this payment plan.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Milestone Order Selection */}
            <div className="space-y-1">
              <Label>Milestone Order <span className="text-red-500">*</span></Label>
              <select
                {...register("milestoneOrder", { valueAsNumber: true })}
                className="bg-[#1E1E1E] border-gray-700 w-full p-2 rounded text-white"
                disabled={availableOrders.length === 0}
              >
                <option value="">-- Select milestone order --</option>
                {availableOrders.map((order) => {
                  const template = FIXED_MILESTONE_TEMPLATES[order as keyof typeof FIXED_MILESTONE_TEMPLATES];
                  const cumulativeProgress = getCumulativeProgress(order);
                  return (
                    <option key={order} value={order}>
                      Step {order} - {template.title} (Progress: {cumulativeProgress}%)
                    </option>
                  );
                })}
              </select>
              {errors.milestoneOrder && (
                <p className="text-red-500 text-sm">{errors.milestoneOrder.message}</p>
              )}
              {availableOrders.length === 0 && (
                <p className="text-yellow-500 text-sm">No orders available</p>
              )}
            </div>

            {/* Milestone Title */}
            <div className="space-y-1">
              <Label>Milestone Title</Label>
              <Input
                {...register("tittle")}
                placeholder={selectedOrder ? "Auto-filled" : "Select an order first"}
                className="bg-[#1E1E1E] border-gray-700"
                readOnly
              />
              {errors.tittle && (
                <p className="text-red-500 text-sm">{errors.tittle.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder={selectedOrder ? "Auto-filled" : "Select an order first"}
                rows={3}
                className="bg-[#1E1E1E] border-gray-700"
                readOnly
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <Label>Amount (SAR)</Label>
              <Input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder={selectedOrder ? "Auto-calculated" : "Select an order first"}
                className="bg-[#1E1E1E] border-gray-700"
                readOnly
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
              {selectedOrder && getTemplateForOrder(selectedOrder) && (
                <p className="text-xs text-gray-400 mt-1">
                  {getTemplateForOrder(selectedOrder).amountPercentage}% of total property value
                </p>
              )}
            </div>

            {/* Construction Progress */}
            <div className="space-y-1">
              <Label>Construction Progress Increase (%)</Label>
              <Input
                type="number"
                {...register("constructionProgress", { valueAsNumber: true })}
                placeholder={selectedOrder ? "Auto-filled" : "Select an order first"}
                className="bg-[#1E1E1E] border-gray-700"
                readOnly
              />
              {errors.constructionProgress && (
                <p className="text-red-500 text-sm">{errors.constructionProgress.message}</p>
              )}
              {selectedOrder && (
                <>
                  <p className="text-xs text-gray-400 mt-1">
                    This milestone adds {getTemplateForOrder(selectedOrder)?.constructionProgress}% to construction
                  </p>
                  <p className="text-xs text-emerald-400">
                    Total construction after this milestone: {getCumulativeProgress(selectedOrder)}%
                  </p>
                </>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <Label>Due Date <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                {...register("dueDate")}
                className="bg-[#1E1E1E] border-gray-700"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Preview */}
            {selectedOrder && getTemplateForOrder(selectedOrder) && (
              <div className="bg-stone-800/50 p-4 rounded-lg mt-2">
                <h4 className="text-sm font-medium text-emerald-400 mb-2">Preview:</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Title:</span> {getTemplateForOrder(selectedOrder).title}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Description:</span> {getTemplateForOrder(selectedOrder).description}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Amount:</span> {(totalPropertyPrice * getTemplateForOrder(selectedOrder).amountPercentage / 100).toLocaleString()} SAR ({getTemplateForOrder(selectedOrder).amountPercentage}%)
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Construction Increase:</span> {getTemplateForOrder(selectedOrder).constructionProgress}%
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Total Construction:</span> {getCumulativeProgress(selectedOrder)}%
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !selectedOrder}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
              Create Milestone
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}