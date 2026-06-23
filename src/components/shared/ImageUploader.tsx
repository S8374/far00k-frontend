"use client";

import { useState, useEffect, useId } from "react";
import { ImagePlus, X } from "lucide-react";
import { Label } from "../ui/label";

interface ImageUploaderProps {
  onChange: (files: File[], existingUrls?: string[]) => void; // call back with files and URLs
  initialFiles?: File[]; // optional prefilled files
  existingImages?: string[]; // server URLs for existing images
  label?: string;
  maxFiles?: number;
  accept?: string;
}

export default function ImageUploader({
  onChange,
  initialFiles = [],
  existingImages = [],
  label = "Upload Photos",
  maxFiles = 10,
  accept = "image/png,image/jpeg",
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [existingUrls, setExistingUrls] = useState<string[]>(existingImages);

  const [previews, setPreviews] = useState<string[]>([]);
  const inputId = useId();

  // Generate previews for both files and existing URLs
  useEffect(() => {
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    const combinedPreviews = [...existingUrls, ...filePreviews];
    setPreviews(combinedPreviews);

    // Clean up old object URLs
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, existingUrls]);

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const updated = [...prev, ...newFiles].slice(0, maxFiles - existingUrls.length);
        onChange(updated, existingUrls);
        return updated;
      });
      e.target.value = "";
    }
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onChange(updated, existingUrls);
      return updated;
    });
  };

  // Remove existing image URL
  const removeExistingUrl = (index: number) => {
    setExistingUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onChange(files, updated);
      return updated;
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <div
        className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-600 transition-colors"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <ImagePlus className="mx-auto h-6 w-10 text-gray-400 mb-3" />
        <p className="text-gray-400">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {/* Existing URLs */}
          {existingUrls.map((url, idx) => (
            <div key={`url-${idx}`} className="relative group">
              <img
                src={url}
                alt={`Existing ${idx + 1}`}
                className="rounded-lg object-cover w-full h-32"
              />
              <button
                type="button"
                onClick={() => removeExistingUrl(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New Files */}
          {files.map((file, idx) => (
            <div key={`file-${idx}`} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx + 1}`}
                className="rounded-lg object-cover w-full h-32"
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}