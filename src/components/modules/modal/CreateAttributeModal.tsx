"use client";

import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreatePropertyAttributesMutation } from "@/redux/api/attributeApi";

// -------------------- Zod Schema --------------------
const attributeSchema = z.object({
  key: z.string().min(1, "Attribute Key is required"),
  value: z.boolean().optional(), // checkbox, true or false
});

type AttributeFormValues = z.infer<typeof attributeSchema>;

// -------------------- Component --------------------
interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
}

export default function CreateAttributeModal({
  open,
  onClose,
  propertyId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeSchema),
    defaultValues: { value: false },
  });

  const [createAttribute, { isLoading: attributeCreateLoading }] =
    useCreatePropertyAttributesMutation();

  const onSubmit = async (data: AttributeFormValues) => {
    try {
      const payload = {
        propertyId,
        ...data,
        value: data.value ?? false,
      };

      const res = await createAttribute(payload).unwrap();
      if (res.success) {
        toast.success("Attribute created successfully");
        reset();
        onClose();
      }
    } catch (error:any) {
      console.log("error",error)
      toast.error(error?.data?.message ||"Failed to create attribute");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2E2E2E] text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Create Property Attribute</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mt-2">
          {/* Key */}
          <div className="space-y-1">
            <Label>Attribute Key</Label>
            <Input
              {...register("key")}
              placeholder="Example: Parking"
              className="bg-[#1E1E1E] border-gray-700"
            />
            {errors.key && (
              <p className="text-red-500 text-sm">{errors.key.message}</p>
            )}
          </div>

          {/* Value Type (Checkbox) */}
          <div className="flex items-center gap-2 my-3">
            <input
              type="checkbox"
              {...register("value")}
              className="cursor-pointer w-4 h-4 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500"
            />
            <Label>Attribute Available/Unavailable</Label>
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
            disabled={attributeCreateLoading}
          >
            {attributeCreateLoading && (
              <Loader2 className="animate-spin h-4 w-4 text-white" />
            )}
            Create Attribute
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}