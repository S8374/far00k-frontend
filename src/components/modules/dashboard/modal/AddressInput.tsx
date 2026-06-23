// Address Input

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { UseFormRegister, UseFormSetValue, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";
import { LocateFixed } from "lucide-react";

interface AddressInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  addressLineFieldName: Path<T>;
  latitudeFieldName: Path<T>;
  longitudeFieldName: Path<T>;
  mapEmbedUrlFieldName: Path<T>;
  locationFieldName: Path<T>; // e.g., Downtown Riyadh
  placeholder?: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export default function AddressInput<T extends FieldValues>({
  register,
  setValue,
  addressLineFieldName,
  latitudeFieldName,
  longitudeFieldName,
  mapEmbedUrlFieldName,
  locationFieldName,
  placeholder = "Search for your address",
}: AddressInputProps<T>) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Fetch suggestions from OpenStreetMap
  useEffect(() => {
    if (!query) return setSuggestions([]);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSuggestion = (s: Suggestion) => {
    const latitude = parseFloat(s.lat);
    const longitude = parseFloat(s.lon);
    const addressLine = s.display_name;
    const location = s.address?.suburb || s.address?.city || s.address?.state || "";

    setValue(addressLineFieldName, addressLine as any);
    setValue(latitudeFieldName, latitude as any);
    setValue(longitudeFieldName, longitude as any);
    setValue(locationFieldName, location as any);
    setValue(
      mapEmbedUrlFieldName,
      `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed` as any
    );

    setQuery(addressLine);
    setSuggestions([]);
  };

  const handleSetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          const addressLine = data.display_name || "Current location";
          const location =
            data.address.suburb || data.address.city || data.address.state || "";

          setValue(addressLineFieldName, addressLine as any);
          setValue(latitudeFieldName, latitude as any);
          setValue(longitudeFieldName, longitude as any);
          setValue(locationFieldName, location as any);
          setValue(
            mapEmbedUrlFieldName,
            `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed` as any
          );

          setQuery(addressLine);
          toast.success("Current location set!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch address from location.");
        }
      }
    );
  };

  return (
    <div className="relative">
      <Label className="text-sm">Location</Label>
      <div className="relative">
        <Input
          {...register(addressLineFieldName)}
          className="mt-1.5 h-11 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSetCurrentLocation}
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-700"
        >
          <LocateFixed className="w-5 h-5 mr-2 mt-1" />
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-black  border rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-emerald-700 cursor-pointer text-sm"
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}