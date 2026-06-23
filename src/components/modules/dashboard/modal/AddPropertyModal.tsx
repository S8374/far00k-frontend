// Add Property Modal

"use client";

import { useRef, useState } from "react";
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
import { Upload, X, ImagePlus, CircleCheckBig } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCreatePropertyMutation } from "@/redux/api/propertyApi";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import AddressInput from "./AddressInput";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// form validation schema (zod)
const formSchema = z.object({
  title: z.string().min(3, "Property title is required"),
  sakNumber: z.string().min(3, "Sak number is required"),
  description: z.string().min(1, "Description is required!"),
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

  addressLine: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  mapEmbedUrl: z.string(),
  location: z.string().optional(),

  developerId: z.string(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  yearBuilt: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 1800, {
      message: "Year must be 1800 or later",
    }),
  parkingSlots: z.number().optional(),
  roiProjectionPercent: z.number().optional(),
  estimatedRentalIncome: z.number().optional(),
  valueApproximate: z.number().optional(),
  featuredUntil: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AddPropertyModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const router = useRouter();
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [uploadImages] = useUploadImagesMutation();
  const { data: developerData } = useGetDeveloperQuery({});
  const developersRaw =
    developerData?.data?.data?.data ||
    developerData?.data?.data ||
    developerData?.data ||
    [];
  const developers = Array.isArray(developersRaw) ? developersRaw : [];
  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data || userData;
  const userId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.uid ||
    currentUser?.userId;
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
  });

  // handle multiple image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      //generate preview
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

  const onSubmit = (data: FormData) => {
    console.log(data);
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handlePublish = async () => {
    if (!formData) return;

    if (!userId) {
      toast.error("User session not ready. Please refresh and try again.");
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append("files", file);
        });

        const uploadResponse = await uploadImages(imageFormData).unwrap();
        imageUrls =
          uploadResponse?.data?.urls ||
          uploadResponse?.data?.data?.urls ||
          [];

        if (images.length > 0 && imageUrls.length === 0) {
          toast.error("Failed to upload property images");
          return;
        }
      }

      const payload = {
        ...formData,
        images: imageUrls,
        currency: "SAR",
        estimatedRentalCurrency: "SAR",
        valueApproximateCurrency: "SAR",
        listingAgentId: userId,
        status: "PENDING",
      };
      const response = await createProperty(payload).unwrap();
      if (response?.success) {
        toast.success("Property created successfully!");
      } else {
        toast.success("Property created successfully!");
      }

      reset();
      setImages([]);
      setPreviews([]);
      setShowConfirmModal(false);
      onSuccess?.();
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create property");
    }
  };
  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="bg-stone-950 border border-white/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-4 lg:px-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Smart Property Listing (Sak)
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Property Title */}
              <div className="space-y-2">
                <Label className="text-white">Property Title</Label>
                <Input
                  {...register("title")}
                  placeholder="Luxury Villa in Al Malqa"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-white">Sak Number</Label>
                <Input
                  {...register("sakNumber")}
                  placeholder="Enter Sak Number"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
                {errors.sakNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.sakNumber.message}
                  </p>
                )}
              </div>

              {/* Property Type */}
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

              {errors.addressLine && (
                <p className="text-red-500 text-sm">
                  {errors.addressLine.message}
                </p>
              )}
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
                        <SelectItem value="GIGA_PROJECT">
                          Giga-Project
                        </SelectItem>
                        {/* <SelectItem value="OFF_PLAN">Off-Plan</SelectItem> */}
                        <SelectItem value="LUXURY">Luxury</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                        <SelectItem value="KAFD_ELITE">KAFD Elite</SelectItem>
                        {/* <SelectItem value="MADINAH">Madinah</SelectItem>
                        <SelectItem value="MAKKAH">Makkah</SelectItem> */}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Unit Number + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Total Units</Label>
                  <Input
                    {...register("totalUnits", { valueAsNumber: true })}
                    placeholder="Total Units"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.totalUnits && (
                    <p className="text-red-500 text-sm">
                      {errors.totalUnits.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Available Units</Label>
                  <Input
                    type="number"
                    {...register("availableUnits", { valueAsNumber: true })}
                    placeholder="Available Units"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.availableUnits && (
                    <p className="text-red-500 text-sm">
                      {errors.availableUnits.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Price, Size, ROI */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Price (SAR)</Label>
                  <Input
                    {...register("price", { valueAsNumber: true })}
                    placeholder="4200000"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Area (Sqm)</Label>
                  <Input
                    {...register("areaSqm", { valueAsNumber: true })}
                    placeholder="35"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.areaSqm && (
                    <p className="text-red-500 text-sm">
                      {errors.areaSqm.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Area (Sqft)</Label>
                  <Input
                    {...register("areaSqFt", { valueAsNumber: true })}
                    placeholder="25"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.areaSqFt && (
                    <p className="text-red-500 text-sm">
                      {errors.areaSqFt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Bedrooms</Label>
                  <Input
                    {...register("bedrooms", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.bedrooms && (
                    <p className="text-red-500 text-sm">
                      {errors.bedrooms.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Bathrooms</Label>
                  <Input
                    {...register("bathrooms", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm">
                      {errors.bathrooms.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Balconies</Label>
                  <Input
                    {...register("balconies", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.balconies && (
                    <p className="text-red-500 text-sm">
                      {errors.balconies.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Floor Number</Label>
                  <Input
                    type="number"
                    {...register("floorNumber", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.floorNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.floorNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Year Built</Label>
                  <Input
                    {...register("yearBuilt", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.yearBuilt && (
                    <p className="text-red-500 text-sm">
                      {errors.yearBuilt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Parking Slots</Label>
                  <Input
                    {...register("parkingSlots", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.parkingSlots && (
                    <p className="text-red-500 text-sm">
                      {errors.parkingSlots.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Roi Projection Percent</Label>
                  <Input
                    {...register("roiProjectionPercent", {
                      valueAsNumber: true,
                    })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.roiProjectionPercent && (
                    <p className="text-red-500 text-sm">
                      {errors.roiProjectionPercent.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Estimated RentalIncome</Label>
                  <Input
                    {...register("estimatedRentalIncome", {
                      valueAsNumber: true,
                    })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.estimatedRentalIncome && (
                    <p className="text-red-500 text-sm">
                      {errors.estimatedRentalIncome.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Value Approximate</Label>
                  <Input
                    {...register("valueApproximate", { valueAsNumber: true })}
                    placeholder="4"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                  />
                  {errors.valueApproximate && (
                    <p className="text-red-500 text-sm">
                      {errors.valueApproximate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Property Description"
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Upload Photos */}
              <div className="space-y-2">
                <Label className="text-white">Upload Photos</Label>
                <div
                  className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-600 transition-colors"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
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

                {/* Image Previews */}
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

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-800">
                {/* <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                  onClick={() => {
                    const previewData = {
                      ...watch(),
                      images: previews,
                    };

                    router.push(
                      `/dashboard/property-preview?previewData=${encodeURIComponent(
                        JSON.stringify(previewData),
                      )}`,
                    );
                  }}
                >
                  Preview Listing
                </Button> */}
                <Button
                  type="submit"
                  className="cursor-pointer flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Submit Listing
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {formData && (
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md p-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                  <Image
                    src={"/turbo.svg"}
                    alt="turbo"
                    height={20}
                    width={20}
                  />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Publish Property Listing?
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="bg-stone-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Property:</p>

                <p className="text-white font-medium">
                  {formData.title || "Untitled Property"}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Once published, this property will:
                </p>

                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Visible to all buyers on the interactive map
                  </li>

                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Searchable through filters and categories
                  </li>

                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Open for direct buyer inquiries
                  </li>

                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Tracked for performance analytics
                  </li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 italic">
                Note: You can edit or unpublish this listing anytime from your
                dashboard.
              </p>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-700 flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-stone-800"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2 cursor-pointer flex items-center justify-center"
                onClick={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <Image
                      src={"/turbo.svg"}
                      alt="turbo"
                      height={16}
                      width={16}
                    />
                    Publish Now
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
