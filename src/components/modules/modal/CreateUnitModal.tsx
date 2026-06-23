"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import ImageUploader from "@/components/shared/ImageUploader";
import { useState } from "react";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreatePropertyUnitsMutation } from "@/redux/api/unitApi";

// -------------------- Zod Schema --------------------
const unitSchema = z.object({
  unitNumber: z.string().min(1, "Unit Number is required"),
  floorNumber: z
    .number({ message: "Floor Number must be a number" })
    .min(0, "Floor Number cannot be negative"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z
    .number({ message: "Price must be a number" })
    .positive("Price must be greater than 0"),
  areaSqm: z
    .number({ message: "Area Sqm must be a number" })
    .positive("Area Sqm must be greater than 0"),
  areaSqFt: z
    .number({ message: "Area SqFt must be a number" })
    .positive("Area SqFt must be greater than 0"),
  bedrooms: z
    .number({ message: "Bedrooms must be a number" })
    .min(0),
  bathrooms: z
    .number({ message: "Bathrooms must be a number" })
    .min(0),
  balconies: z
    .number({ message: "Balconies must be a number" })
    .min(0),
  parkingSlots: z
    .number({ message: "Parking Slots must be a number" })
    .min(0),
  status: z.enum([
    "AVAILABLE",
    "RENTED",
    "OFF_MARKET",
    "UNDER_OFFER",
    "SELL"
  ]),
  isFeatured: z.boolean().optional(),
  isPricedOnRequest: z.boolean().optional(),
});

type UnitFormValues = z.infer<typeof unitSchema>;

// -------------------- Component --------------------
interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
}

export default function CreateUnitModal({ open, onClose, propertyId }: Props) {
  const { register, handleSubmit, reset, control, formState } =
    useForm<UnitFormValues>({
      resolver: zodResolver(unitSchema),
      defaultValues: {
        status: "AVAILABLE",
        isFeatured: false,
        isPricedOnRequest: false,
      },
    });

  const { errors } = formState;

  const [files, setFiles] = useState<File[]>([]);
  const [uploadImages, { isLoading: uploadImageLoading }] =
    useUploadImagesMutation();
  const [createUnit, { isLoading: unitCreateLoading }] =
    useCreatePropertyUnitsMutation();

  const onSubmit = async (data: UnitFormValues) => {
    let imageUrls: string[] = [];

    if (files.length > 0) {
      const imageFormData = new FormData();
      files.forEach((file) => {
        imageFormData.append("files", file);
      });

      const uploadResponse = await uploadImages(imageFormData).unwrap();
      if (uploadResponse?.success) {
        imageUrls = uploadResponse?.data?.data?.urls ?? [];
      }
    }

    const payload = {
      ...data,
      propertyId,
      images: imageUrls,
    };

    try {
      const res = await createUnit(payload).unwrap();
      if (res.success) {
        toast.success("Unit created successfully");
        reset();
        setFiles([]);
        onClose();
      }
    } catch {
      toast.error("Failed to create unit");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1f1f1f] text-white max-w-2xl overflow-y-auto max-h-[90vh] scroll-hide">
        <DialogHeader>
          <DialogTitle>Create Unit</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          {/* Unit Number */}
          <div className="space-y-1">
            <Label>Unit Number</Label>
            <Input {...register("unitNumber")} />
            {errors.unitNumber && (
              <p className="text-red-500 text-sm">{errors.unitNumber.message}</p>
            )}
          </div>

          {/* Floor Number */}
          <div className="space-y-1">
            <Label>Floor Number</Label>
            <Input type="number" {...register("floorNumber", { valueAsNumber: true })} />
            {errors.floorNumber && (
              <p className="text-red-500 text-sm">{errors.floorNumber.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="col-span-2 space-y-1">
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2 space-y-1">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={4} />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <Label>Price</Label>
            <Input type="number" {...register("price", { valueAsNumber: true })} />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Area Sqm */}
          <div className="space-y-1">
            <Label>Area Sqm</Label>
            <Input type="number" {...register("areaSqm", { valueAsNumber: true })} />
            {errors.areaSqm && (
              <p className="text-red-500 text-sm">{errors.areaSqm.message}</p>
            )}
          </div>

          {/* Area SqFt */}
          <div className="space-y-1">
            <Label>Area SqFt</Label>
            <Input type="number" {...register("areaSqFt", { valueAsNumber: true })} />
            {errors.areaSqFt && (
              <p className="text-red-500 text-sm">{errors.areaSqFt.message}</p>
            )}
          </div>

          {/* Bedrooms */}
          <div className="space-y-1">
            <Label>Bedrooms</Label>
            <Input type="number" {...register("bedrooms", { valueAsNumber: true })} />
            {errors.bedrooms && (
              <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>
            )}
          </div>

          {/* Bathrooms */}
          <div className="space-y-1">
            <Label>Bathrooms</Label>
            <Input type="number" {...register("bathrooms", { valueAsNumber: true })} />
            {errors.bathrooms && (
              <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>
            )}
          </div>

          {/* Balconies */}
          <div className="space-y-1">
            <Label>Balconies</Label>
            <Input type="number" {...register("balconies", { valueAsNumber: true })} />
            {errors.balconies && (
              <p className="text-red-500 text-sm">{errors.balconies.message}</p>
            )}
          </div>

          {/* Parking Slots */}
          <div className="space-y-1 col-span-2">
            <Label>Parking Slots</Label>
            <Input type="number" {...register("parkingSlots", { valueAsNumber: true })} />
            {errors.parkingSlots && (
              <p className="text-red-500 text-sm">{errors.parkingSlots.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1 col-span-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full text-white border rounded">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] text-white">
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                    <SelectItem value="OFF_MARKET">Off Market</SelectItem>
                    <SelectItem value="UNDER_OFFER">Under Offer</SelectItem>
                    <SelectItem value="SELL">Sell</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Image Uploader */}
          <div className="col-span-2">
            <ImageUploader onChange={setFiles} label="Property Images" />
          </div>

          {/* Featured & Price On Request */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isFeatured")} />
            <Label>Featured</Label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isPricedOnRequest")} />
            <Label>Price On Request</Label>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
              disabled={uploadImageLoading || unitCreateLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 cursor-pointer flex items-center justify-center gap-2"
              disabled={uploadImageLoading || unitCreateLoading}
            >
              {(uploadImageLoading || unitCreateLoading) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Unit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}