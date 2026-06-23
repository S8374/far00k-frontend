// Edit Property Modal

"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ImagePlus, Edit } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  useEditPropertyMutation,
  useGetPropertyByIdQuery,
} from "@/redux/api/propertyApi";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import AddressInput from "./AddressInput";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { FaSpinner } from "react-icons/fa6";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().optional(),
  sakNumber: z.string().optional(),
  description: z.string().optional(),
  listingPurpose: z.enum(["SELL", "RENT"]),
  type: z
    .enum([
      "GOLDEN_VISA",
      "HIGH_YIELD",
      "GIGA_PROJECT",
      "OFF_PLAN",
      "LUXURY",
      "COMMERCIAL",
      "RESIDENTIAL",
      "KAFD_ELITE",
      "MADINAH",
      "MAKKAH",
    ])
    .optional(),
  addressLine: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapEmbedUrl: z.string().optional(),
  location: z.string().optional(),
  developerId: z.string(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  price: z.number().optional(),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  yearBuilt: z.number().optional(),
  parkingSlots: z.number().optional(),
  roiProjectionPercent: z.number().optional(),
  estimatedRentalIncome: z.number().optional(),
  valueApproximate: z.number().optional(),
  featuredUntil: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPropertyModal({
  onClose,
  propertyId,
}: {
  onClose: () => void;
  propertyId: string;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { data: propertyDataById } = useGetPropertyByIdQuery(propertyId);
  const property = propertyDataById?.data;
  const [editProperty, { isLoading: editPropertyLoading }] =
    useEditPropertyMutation();
  const [uploadImages] = useUploadImagesMutation();
  const { data: developerData } = useGetDeveloperQuery({});
  const developers = developerData?.data?.data || [];
  const { data: userData } = useGetMeQuery({});
  const userId = (userData?.data?.data || userData?.data)?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingPurpose: "SELL",
      developerId: "",
    },
  });

  useEffect(() => {
    if (property) {
      reset({
        title: property.title ?? "",
        sakNumber: property.sakNumber ?? "",
        description: property.description ?? "",
        listingPurpose: property.listingPurpose as "SELL" | "RENT",
        type: property.type as FormData["type"],
        addressLine: property.addressLine ?? "",
        latitude: property.latitude ?? undefined,
        longitude: property.longitude ?? undefined,
        mapEmbedUrl: property.mapEmbedUrl ?? "",
        location: property.location ?? "",
        developerId: property.developerId ?? "",
        totalUnits: property.totalUnits ?? undefined,
        availableUnits: property.availableUnits ?? undefined,
        price: property.price ?? undefined,
        areaSqm: property.areaSqm ?? undefined,
        areaSqFt: property.areaSqFt ?? undefined,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        balconies: property.balconies ?? undefined,
        floorNumber: property.floorNumber ?? undefined,
        yearBuilt: property.yearBuilt ?? undefined,
        parkingSlots: property.parkingSlots ?? undefined,
        roiProjectionPercent: property.roiProjectionPercent ?? undefined,
        estimatedRentalIncome: property.estimatedRentalIncome ?? undefined,
        valueApproximate: property.valueApproximate ?? undefined,
      });
      if (property.images && property.images.length > 0) {
        setExistingImages(property.images);
      }
    }
  }, [property, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: FormData) => {
    if (!formData) return;
    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append("files", file);
        });
        const uploadResponse = await uploadImages(imageFormData).unwrap();
        if (uploadResponse?.success) {
          imageUrls = uploadResponse?.data?.data?.urls ?? [];
        }
      }
      const allImages = [...existingImages, ...imageUrls];

      const payload = {
        ...formData,
        images: allImages,
        currency: "SAR",
        estimatedRentalCurrency: "SAR",
        valueApproximateCurrency: "SAR",
        listingAgentId: userId,
      };

      const response = await editProperty({
        formData: payload,
        propertyId,
      }).unwrap();
      if (response?.success) {
        toast.success("Property updated successfully!");
      }
      reset();
      setImages([]);
      setPreviews([]);
      setExistingImages([]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update property");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-stone-950 border border-white/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-4 lg:px-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">
            Smart Property Listing (Sak)
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Property Title</Label>
              <Input
                {...register("title")}
                placeholder="Luxury Villa in Al Malqa"
                className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Sak Number</Label>
              <Input
                {...register("sakNumber")}
                placeholder="Enter Sak Number"
                className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Listing Purpose</Label>
              <Controller
                name="listingPurpose"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                      <SelectValue placeholder="Select your listing purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SELL">Sale</SelectItem>
                      <SelectItem value="RENT">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Select Developer</Label>
              <Controller
                name="developerId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                      <SelectValue placeholder="Select your developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers?.map((dev: any) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <AddressInput
              register={register}
              setValue={setValue}
              addressLineFieldName="addressLine"
              latitudeFieldName="latitude"
              longitudeFieldName="longitude"
              mapEmbedUrlFieldName="mapEmbedUrl"
              locationFieldName="location"
              placeholder="Search your address"
            />
            <div className="space-y-2">
              <Label className="text-white">Property Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                      <SelectValue placeholder="Select your property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOLDEN_VISA">Golden Visa</SelectItem>
                      <SelectItem value="HIGH_YIELD">High Yield</SelectItem>
                      <SelectItem value="GIGA_PROJECT">Giga-Project</SelectItem>
                      <SelectItem value="OFF_PLAN">Off-Plan</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                      <SelectItem value="KAFD_ELITE">KAFD Elite</SelectItem>
                      <SelectItem value="MADINAH">Madinah</SelectItem>
                      <SelectItem value="MAKKAH">Makkah</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Total Units</Label>
                <Input
                  type="number"
                  {...register("totalUnits", { valueAsNumber: true })}
                  placeholder="Total Units"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Available Units</Label>
                <Input
                  type="number"
                  {...register("availableUnits", { valueAsNumber: true })}
                  placeholder="Available Units"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Price (SAR)</Label>
                <Input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="4200000"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Area (Sqm)</Label>
                <Input
                  type="number"
                  {...register("areaSqm", { valueAsNumber: true })}
                  placeholder="35"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Area (Sqft)</Label>
                <Input
                  type="number"
                  {...register("areaSqFt", { valueAsNumber: true })}
                  placeholder="25"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Bedrooms</Label>
                <Input
                  type="number"
                  {...register("bedrooms", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Bathrooms</Label>
                <Input
                  type="number"
                  {...register("bathrooms", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Balconies</Label>
                <Input
                  type="number"
                  {...register("balconies", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Floor Number</Label>
                <Input
                  type="number"
                  {...register("floorNumber", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Year Built</Label>
                <Input
                  type="number"
                  {...register("yearBuilt", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Parking Slots</Label>
                <Input
                  type="number"
                  {...register("parkingSlots", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Roi Projection Percent</Label>
                <Input
                  type="number"
                  {...register("roiProjectionPercent", {
                    valueAsNumber: true,
                  })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Estimated RentalIncome</Label>
                <Input
                  type="number"
                  {...register("estimatedRentalIncome", {
                    valueAsNumber: true,
                  })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Value Approximate</Label>
                <Input
                  type="number"
                  {...register("valueApproximate", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Property Description"
                className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Existing Images section যোগ করা হয়েছে - API থেকে আসা পুরনো ছবি দেখাবে */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white">Current Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Existing ${index + 1}`}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      {/* ✅ পুরনো image delete করার button */}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-white">Upload New Photos</Label>
              <div
                className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-600 transition-colors"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <ImagePlus className="mx-auto h-6 w-10 text-gray-400 mb-3" />
                <p className="text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-800">
              <Button
                type="submit"
                className="cursor-pointer flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2"
              >
                <Edit className="h-4 w-4" />
                {editPropertyLoading && <FaSpinner />}
                Update Property
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}