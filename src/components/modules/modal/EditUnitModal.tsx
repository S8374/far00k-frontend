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
import { useEffect, useState } from "react";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useGetPropertyUnitByIdQuery, useUpdatePropertyUnitsMutation } from "@/redux/api/unitApi";

// ---------------- ZOD SCHEMA ----------------
const unitSchema = z.object({
  unitNumber: z.string().optional(),
  floorNumber: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  parkingSlots: z.number().optional(),
  status: z
    .enum([
      "RESERVED",
      "SOLD",
      "RENTED",
    ])
    .optional(),
  isFeatured: z.boolean().optional(),
  isPricedOnRequest: z.boolean().optional(),
});

type UnitFormValues = z.infer<typeof unitSchema>;

// ---------------- PROPS ----------------
interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  unitId: string;
}

// ---------------- COMPONENT ----------------
export default function EditUnitModal({
  open,
  onClose,
  propertyId,
  unitId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
  });

  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [uploadImages, { isLoading: uploadImageLoading }] =
    useUploadImagesMutation();

  const [updateUnit, { isLoading: unitUpdateLoading }] =
    useUpdatePropertyUnitsMutation();

  const { data: unitData } = useGetPropertyUnitByIdQuery(unitId);

  const unit = unitData?.data?.data;

  // ---------------- AUTO FILL FORM ----------------
  useEffect(() => {
    if (unit) {
      reset({
        unitNumber: unit.unitNumber,
        floorNumber: unit.floorNumber,
        title: unit.title,
        description: unit.description,
        price: unit.price,
        areaSqm: unit.areaSqm,
        areaSqFt: unit.areaSqFt,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        balconies: unit.balconies,
        parkingSlots: unit.parkingSlots,
        status: unit.status,
        isFeatured: unit.isFeatured,
        isPricedOnRequest: unit.isPricedOnRequest,
      });

      setExistingImages(unit.images || []);
    }
  }, [unit, reset]);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (data: UnitFormValues) => {
    let imageUrls: string[] = existingImages;

    try {
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
        images: imageUrls,
      };

      const res = await updateUnit({
        id: unitId,
        formData: payload,
      }).unwrap();
      console.log("update-unit-res", res);
      if (res.success) {
        toast.success("Unit updated successfully");
        reset();
        setFiles([]);
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update unit");
    }
  };

  // ---------------- CLOSE HANDLER ----------------
  const handleClose = () => {
    reset();
    setFiles([]);
    onClose();
  };

  // ---------------- UI ----------------
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1f1f1f] text-white max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          {/* Unit Number */}
          <div>
            <Label>Unit Number</Label>
            <Input {...register("unitNumber")} />
          </div>

          {/* Floor */}
          <div>
            <Label>Floor Number</Label>
            <Input
              type="number"
              {...register("floorNumber", { valueAsNumber: true })}
            />
          </div>

          {/* Title */}
          <div className="col-span-2">
            <Label>Title</Label>
            <Input {...register("title")} />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={4} />
          </div>

          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
          </div>

          {/* Area Sqm */}
          <div>
            <Label>Area Sqm</Label>
            <Input
              type="number"
              {...register("areaSqm", { valueAsNumber: true })}
            />
          </div>

          {/* Area SqFt */}
          <div>
            <Label>Area SqFt</Label>
            <Input
              type="number"
              {...register("areaSqFt", { valueAsNumber: true })}
            />
          </div>

          {/* Bedrooms */}
          <div>
            <Label>Bedrooms</Label>
            <Input
              type="number"
              {...register("bedrooms", { valueAsNumber: true })}
            />
          </div>

          {/* Bathrooms */}
          <div>
            <Label>Bathrooms</Label>
            <Input
              type="number"
              {...register("bathrooms", { valueAsNumber: true })}
            />
          </div>

          {/* Balconies */}
          <div>
            <Label>Balconies</Label>
            <Input
              type="number"
              {...register("balconies", { valueAsNumber: true })}
            />
          </div>

          {/* Parking */}
          <div>
            <Label>Parking Slots</Label>
            <Input
              type="number"
              {...register("parkingSlots", { valueAsNumber: true })}
            />
          </div>
          {/* Status */}
          <div className="col-span-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#1f1f1f] text-white">
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Image Uploader */}
          <div className="col-span-2">
            <ImageUploader
              onChange={setFiles}
              existingImages={existingImages}
              label="Unit Images"
            />
          </div>
          {/* Featured */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isFeatured")} />
            <Label>Featured</Label>
          </div>

          {/* Price On Request */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isPricedOnRequest")} />
            <Label>Price On Request</Label>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploadImageLoading || unitUpdateLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="cursor-pointer bg-emerald-700 hover:bg-emerald-800 flex items-center gap-2"
              disabled={uploadImageLoading || unitUpdateLoading}
            >
              {(uploadImageLoading || unitUpdateLoading) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Update Unit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
