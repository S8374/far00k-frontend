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
import { Loader2, Users } from "lucide-react";

import { useUpdatePropertyInvisitorMutation } from "@/redux/api/invisitorApi";

// Enum values from backend
const RELATIONSHIP_ENUMS = [
  "OWNER",
  "TENANT",
  "FAMILY_MEMBER",
  "FRIEND",
  "COLLEAGUE",
  "LEGAL_REPRESENTATIVE",
  "OTHER"
] as const;

const ID_TYPE_ENUMS = [
  "PASSPORT",
  "NATIONAL_ID",
  "DRIVING_LICENSE",
  "RESIDENT_ID",
  "OTHER"
] as const;

const invisitorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  idType: z.enum(ID_TYPE_ENUMS).optional(),
  idNumber: z.string().optional(),
  relationship: z.enum(RELATIONSHIP_ENUMS).optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof invisitorSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  invisitor: any;
  propertyId: string;
}

export default function EditInvisitorModal({
  open,
  onClose,
  invisitor,
  propertyId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(invisitorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      idType: undefined,
      idNumber: "",
      relationship: undefined,
      additionalInfo: "",
    },
  });

  const [updateInvisitor, { isLoading }] = useUpdatePropertyInvisitorMutation();

  // Populate form with invisitor data when it loads
  useEffect(() => {
    if (invisitor) {
      reset({
        name: invisitor.name || "",
        email: invisitor.email || "",
        phoneNumber: invisitor.phoneNumber || "",
        idType: invisitor.idType || undefined,
        idNumber: invisitor.idNumber || "",
        relationship: invisitor.relationship || undefined,
        additionalInfo: invisitor.additionalInfo || "",
      });
    }
  }, [invisitor, reset]);

  const onSubmit = async (form: FormValues) => {
    try {
      const payload = {
        id: invisitor.id,
        data: form,
      };

      const res = await updateInvisitor(payload).unwrap();

      if (res.success) {
        toast.success("Invisitor updated successfully");
        onClose();
      }
    } catch (error: any) {
      console.error("Error updating invisitor:", error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.data?.errors) {
        error.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error("Failed to update invisitor");
      }
    }
  };

  // Format enum for display
  const formatEnum = (value: string) => {
    return value.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2E2E2E] text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-500" />
            Edit Invisitor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>Full Name <span className="text-red-500">*</span></Label>
            <Input
              {...register("name")}
              placeholder="Enter full name"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter email address"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input
              {...register("phoneNumber")}
              placeholder="Enter phone number"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Relationship - Updated with correct enums */}
          <div className="space-y-1">
            <Label>Relationship</Label>
            <select
              {...register("relationship")}
              className="bg-[#1E1E1E] border-gray-700 w-full p-2 rounded text-white"
            >
              <option value="">Select relationship</option>
              {RELATIONSHIP_ENUMS.map((value) => (
                <option key={value} value={value}>
                  {formatEnum(value)}
                </option>
              ))}
            </select>
            {errors.relationship && (
              <p className="text-red-500 text-sm">{errors.relationship.message}</p>
            )}
          </div>

          {/* ID Type - Updated with correct enums */}
          <div className="space-y-1">
            <Label>ID Type</Label>
            <select
              {...register("idType")}
              className="bg-[#1E1E1E] border-gray-700 w-full p-2 rounded text-white"
            >
              <option value="">Select ID type</option>
              {ID_TYPE_ENUMS.map((value) => (
                <option key={value} value={value}>
                  {formatEnum(value)}
                </option>
              ))}
            </select>
            {errors.idType && (
              <p className="text-red-500 text-sm">{errors.idType.message}</p>
            )}
          </div>

          {/* ID Number */}
          <div className="space-y-1">
            <Label>ID Number</Label>
            <Input
              {...register("idNumber")}
              placeholder="Enter ID number"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.idNumber && (
              <p className="text-red-500 text-sm">{errors.idNumber.message}</p>
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
            Update Invisitor
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}