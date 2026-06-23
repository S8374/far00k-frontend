"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";

interface ImageUploadProps {
  onImagesUploaded: (urls: string[], files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function ImageUpload({ 
  onImagesUploaded, 
  maxFiles = 10,
  className = "" 
}: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const filesArray = Array.from(e.target.files);
    
    // Check file types
    const invalidFiles = filesArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) are not images`);
      return;
    }

    // Check file size (max 5MB)
    const oversizedFiles = filesArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`${oversizedFiles.length} file(s) exceed 5MB limit`);
      return;
    }
    
    // Check if adding these files would exceed maxFiles
    if (images.length + filesArray.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }
    
    setImages((prev) => [...prev, ...filesArray]);
    
    // Create previews
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Auto-upload when files are selected
    setTimeout(() => handleUpload([...images, ...filesArray]), 100);
  }, [images.length, maxFiles]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    const formData = new FormData();
    
    // Append each file with the field name 'files' (matches your backend)
    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await uploadImages(formData).unwrap();
      console.log("Upload Response:", response);
      
      if (response.success && response.data?.urls) {
        console.log("Uploaded URLs:", response.data.urls);
        toast.success(`${response.data.urls.length} image(s) uploaded successfully!`);
        onImagesUploaded(response.data.urls, filesToUpload);
        
        // Clear previews after successful upload
        previews.forEach((preview) => URL.revokeObjectURL(preview));
        setImages([]);
        setPreviews([]);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Failed to upload images");
    }
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-600 transition-colors"
          onClick={() => !isUploading && images.length < maxFiles && document.getElementById("image-upload-input")?.click()}
        >
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading || images.length >= maxFiles}
          />
          <ImagePlus className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-400">
            {isUploading 
              ? "Uploading..." 
              : images.length >= maxFiles 
                ? `Maximum ${maxFiles} images reached` 
                : "Click or drag images here"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Max 5MB per image • JPG, PNG, WebP
          </p>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-square">
                <Image
                  src={src}
                  alt={`Preview ${i + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  disabled={isUploading}
                  className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Status */}
        {isUploading && (
          <div className="flex items-center justify-center gap-2 text-emerald-400 mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading images...</span>
          </div>
        )}
      </div>
    </div>
  );
}