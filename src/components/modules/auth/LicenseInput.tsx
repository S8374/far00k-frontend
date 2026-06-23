"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface LicenseInputProps {
  label: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  icon?: React.ReactNode;
}

export function LicenseInput({
  label,
  placeholder,
  register,
  error,
  icon,
}: LicenseInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const formatLicense = (input: string, type: "fal" | "rega") => {
    const digits = input.replace(/\D/g, "");
    let formatted = "";

    if (type === "fal") {
      // FAL-KSA-XXXX-XXXX → 12 ডিজিট
      if (digits.length > 0) formatted = "FAL-KSA-";
      if (digits.length > 0) formatted += digits.slice(0, 4);
      if (digits.length > 4) formatted += "-" + digits.slice(4, 8);
      if (digits.length > 8) formatted += "-" + digits.slice(8, 12);
      return formatted.slice(0, 17);
    } else {
      // REGA-XXXX-XXXX → 8 ডিজিট
      if (digits.length > 0) formatted = "REGA-";
      if (digits.length > 0) formatted += digits.slice(0, 4);
      if (digits.length > 4) formatted += "-" + digits.slice(4, 8);
      return formatted.slice(0, 14);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = formatLicense(raw, label.includes("FAL") ? "fal" : "rega");
    setDisplayValue(formatted);

    // react-hook-form এ শুধুমাত্র ডিজিট পাঠানো হচ্ছে
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: raw },
    } as ChangeEvent<HTMLInputElement>;

    register.onChange(syntheticEvent);
  };

  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <div className="relative">
        {icon}
        <Input
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
          maxLength={label.includes("FAL") ? 17 : 14}
          name={register.name}
          ref={register.ref}
          onBlur={register.onBlur}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}