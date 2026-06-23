




// "use client";

// import { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Upload, X, ImagePlus, CircleCheckBig } from "lucide-react";
// import Image from "next/image";
// import { Controller } from "react-hook-form";
// import { Textarea } from "@/components/ui/textarea";
// import { useRouter } from "next/navigation";
// import { useCreatePropertyMutation } from "@/redux/api/propertyApi";
// import { toast } from "sonner";

// // form validation schema (zod)
// const formSchema = z.object({
    
//     title: z.string().min(3, "Property title is required"),
//     propertyType: z.string().optional(),
//     unitNumber: z.string().min(1, "Unit number is required"),
//     location: z.string().min(3, "Location is required"),
//     price: z.string().min(1, "Price is required"),
//     size: z.string().min(1, "Size is required"),
//     expectedROI: z.string().min(1, "Expected ROI is required"),
//     description: z.string().min(1, "Description is required!"),
//     categories: z.array(z.string()).optional(),
// });


// type FormData = z.infer<typeof formSchema>;

// export default function AddPropertyModal({ onClose }: { onClose: () => void }) {
//     const [images, setImages] = useState<File[]>([]);
//     const [previews, setPreviews] = useState<string[]>([]);
//     const modalRef = useRef<HTMLDivElement>(null);
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [formData, setFormData] = useState<FormData | null>(null);
//     const router = useRouter()
//     const [createProperty] = useCreatePropertyMutation()

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         control,
//         watch
//     } = useForm<FormData>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             categories: [],
//         },
//     });

//     // handle multiple image
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             const filesArray = Array.from(e.target.files);
//             setImages((prev) => [...prev, ...filesArray]);
//             //generate preview
//             const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
//             setPreviews((prev) => [...prev, ...newPreviews]);
//         }
//     };

//     const removeImage = (index: number) => {
//         setImages((prev) => prev.filter((_, i) => i !== index));
//         setPreviews((prev) => {
//             URL.revokeObjectURL(prev[index]);
//             return prev.filter((_, i) => i !== index);
//         });
//     };

//     const onSubmit = (data: FormData) => {
//         console.log(data)
//         setFormData(data);
//         setShowConfirmModal(true);
//     };

//     const handlePublish = async() => {
//         if (formData) {
//             console.log("final-data",formData)
//             // const formData = new FormData();
//             // const payload = {
//             //     ...formData
//             // }
//             // formData.append("data", JSON.stringify(payload));
//             // images.forEach((file) => formData.append("images", file));
//             // try {
//             //     const response = await createProperty(formData).unwrap();
//             //     if(response.success){
//             //         toast.success("Property created successfully!")
//             //     }
                
//             // } catch (error) {
//             //     toast.error("Failed to create property")
//             // }
//             reset();
//             setImages([]);
//             setPreviews([]);
//             setShowConfirmModal(false);
//             onClose();
//         }
//     };

//     return (
//         <>
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//                 <div
//                     ref={modalRef}
//                     className="bg-stone-950 border border-white/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
//                 >
//                     {/* cross button---top right */}
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
//                     >
//                         <X className="h-6 w-6" />
//                     </button>

//                     <div className="p-4 lg:px-6 space-y-4">
//                         <h2 className="text-xl font-bold text-white mb-4">
//                             Smart Property Listing (Sak)
//                         </h2>

//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                             {/* Property Title */}
//                             <div className="space-y-2">
//                                 <Label className="text-white">Property Title</Label>
//                                 <Input
//                                     {...register("title")}
//                                     placeholder="Luxury Villa in Al Malqa"
//                                     className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                 />
//                                 {errors.title && (
//                                     <p className="text-red-500 text-sm">{errors.title.message}</p>
//                                 )}
//                             </div>

//                             {/* Property Type */}
//                             <div className="space-y-2">
//                                 <Label className="text-white">Property Type</Label>
//                                 <Controller
//                                     name="propertyType"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <Select onValueChange={field.onChange} value={field.value}>
//                                             <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
//                                                 <SelectValue placeholder="Select your property type" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="villa">Villa</SelectItem>
//                                                 <SelectItem value="apartment">Apartment</SelectItem>
//                                                 <SelectItem value="land">Land</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     )}
//                                 />

//                             </div>

//                             {/* Unit Number + Location */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                 <div className="space-y-2">
//                                     <Label className="text-white">Unit Number</Label>
//                                     <Input
//                                         {...register("unitNumber")}
//                                         placeholder="Unit Number"
//                                         className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                     />
//                                     {errors.unitNumber && (
//                                         <p className="text-red-500 text-sm">{errors.unitNumber.message}</p>
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label className="text-white">Location</Label>
//                                     <Input
//                                         {...register("location")}
//                                         placeholder="Al Malqa, North Riyadh"
//                                         className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                     />
//                                     {errors.location && (
//                                         <p className="text-red-500 text-sm">{errors.location.message}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Price, Size, ROI */}
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                                 <div className="space-y-2">
//                                     <Label className="text-white">Price (SAR)</Label>
//                                     <Input
//                                         {...register("price")}
//                                         placeholder="4200000"
//                                         className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                     />
//                                     {errors.price && (
//                                         <p className="text-red-500 text-sm">{errors.price.message}</p>
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label className="text-white">Size (m²)</Label>
//                                     <Input
//                                         {...register("size")}
//                                         placeholder="350"
//                                         className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                     />
//                                     {errors.size && (
//                                         <p className="text-red-500 text-sm">{errors.size.message}</p>
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label className="text-white">Expected ROI (%)</Label>
//                                     <Input
//                                         {...register("expectedROI")}
//                                         placeholder="8.4"
//                                         className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                     />
//                                     {errors.expectedROI && (
//                                         <p className="text-red-500 text-sm">{errors.expectedROI.message}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label className="text-white">Description</Label>
//                                 <Textarea
//                                     {...register("description")}
//                                     placeholder="Property Description"
//                                     className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
//                                 />
//                                 {errors.description && (
//                                     <p className="text-red-500 text-sm">{errors.description.message}</p>
//                                 )}
//                             </div>

//                             {/* Upload Photos */}
//                             <div className="space-y-2">
//                                 <Label className="text-white">Upload Photos</Label>
//                                 <div
//                                     className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-600 transition-colors"
//                                     onClick={() => document.getElementById("image-upload")?.click()}
//                                 >
//                                     <input
//                                         id="image-upload"
//                                         type="file"
//                                         accept="image/png,image/jpeg"
//                                         multiple
//                                         className="hidden"
//                                         onChange={handleImageChange}
//                                     />
//                                     <ImagePlus className="mx-auto h-6 w-10 text-gray-400 mb-3" />
//                                     <p className="text-gray-400">
//                                         Click to upload or drag and drop
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         PNG, JPG up to 10MB
//                                     </p>
//                                 </div>

//                                 {/* Image Previews */}
//                                 {previews.length > 0 && (
//                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
//                                         {previews.map((preview, index) => (
//                                             <div key={index} className="relative group">
//                                                 <Image
//                                                     src={preview}
//                                                     alt={`Preview ${index + 1}`}
//                                                     width={200}
//                                                     height={150}
//                                                     className="rounded-lg object-cover w-full h-32"
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeImage(index)}
//                                                     className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 >
//                                                     <X className="h-4 w-4" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Categories */}
//                             <div className="space-y-2">
//                                 <Label className="text-white">Property Categories</Label>
//                                 <Controller
//                                     name="categories"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="flex flex-wrap gap-4">
//                                             {["Golden Visa", "High Yield", "Giga-Projects", "Off-Plan"].map(
//                                                 (cat) => {
//                                                     const isChecked = field.value?.includes(cat);

//                                                     return (
//                                                         <div key={cat} className="flex items-center gap-2">
//                                                             <Checkbox
//                                                                 checked={isChecked}
//                                                                 onCheckedChange={(checked) => {
//                                                                     if (checked) {
//                                                                         field.onChange([...(field.value || []), cat]);
//                                                                     } else {
//                                                                         field.onChange(
//                                                                             field.value?.filter((v: string) => v !== cat)
//                                                                         );
//                                                                     }
//                                                                 }}
//                                                             />
//                                                             <label className="text-sm text-white">{cat}</label>
//                                                         </div>
//                                                     );
//                                                 }
//                                             )}
//                                         </div>
//                                     )}
//                                 />
//                                 <p className="text-xs text-gray-400">
//                                     Auto-detected based on price/ROI
//                                 </p>
//                             </div>

//                             {/* Buttons */}
//                             <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-800">
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
//                                     onClick={() => {
//                                         const previewData = {
//                                             ...watch(),
//                                             images: previews,
//                                         };

//                                         router.push(
//                                             `/dashboard/property-preview?previewData=${encodeURIComponent(
//                                                 JSON.stringify(previewData)
//                                             )}`
//                                         );
//                                     }}
//                                 >
//                                     Preview Listing
//                                 </Button>
//                                 <Button
//                                     type="submit"
//                                     className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2"
//                                 >
//                                     <Upload className="h-4 w-4" />
//                                     Submit Listing
//                                 </Button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>

//             {showConfirmModal && formData && (
//                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
//                     <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md overflow-hidden">
//                         {/* Header */}
//                         <div className="p-6 border-b border-stone-700 flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
//                                     <Image
//                                         src={'/turbo.svg'}
//                                         alt="turbo"
//                                         height={20}
//                                         width={20}
//                                     />
//                                 </div>
//                                 <h3 className="text-xl font-bold text-white">
//                                     Publish Property Listing?
//                                 </h3>
//                             </div>
//                             <button
//                                 onClick={() => setShowConfirmModal(false)}
//                                 className="text-gray-400 hover:text-white"
//                             >
//                                 <X className="h-6 w-6" />
//                             </button>
//                         </div>

//                         {/* Body */}
//                         <div className="p-6 space-y-6">
//                             <div className="bg-stone-800/50 p-4 rounded-lg">
//                                 <p className="text-sm text-gray-300 mb-2">Property:</p>
//                                 <p className="text-white font-medium">
//                                     {formData.title || "Untitled Property"}
//                                 </p>
//                             </div>

//                             <div className="space-y-3">
//                                 <p className="text-sm text-gray-300">
//                                     Once published, this property will:
//                                 </p>
//                                 <ul className="space-y-2 text-sm text-gray-300">
//                                     <li className="flex items-center gap-2">
//                                         <CircleCheckBig className="h-4 w-4 text-emerald-500" />
//                                         Visible to all buyers on the interactive map
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <CircleCheckBig className="h-4 w-4 text-emerald-500" />
//                                         Searchable through filters and categories
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <CircleCheckBig className="h-4 w-4 text-emerald-500" />
//                                         Open for direct buyer inquiries
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <CircleCheckBig className="h-4 w-4 text-emerald-500" />
//                                         Tracked for performance analytics
//                                     </li>
//                                 </ul>
//                             </div>

//                             <p className="text-xs text-gray-500 italic">
//                                 Note: You can edit or unpublish this listing anytime from your dashboard.
//                             </p>
//                         </div>

//                         {/* Footer Buttons */}
//                         <div className="p-6 border-t border-stone-700 flex gap-4">
//                             <Button
//                                 variant="outline"
//                                 className="flex-1 border-gray-600 text-gray-300 hover:bg-stone-800"
//                                 onClick={() => setShowConfirmModal(false)}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2"
//                                 onClick={handlePublish}
//                             >
//                                 <Image
//                                     src={'/turbo.svg'}
//                                     alt="turbo"
//                                     height={16}
//                                     width={16}
//                                 />
//                                 Publish Now
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }