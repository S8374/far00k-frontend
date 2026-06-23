"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreatePropertyInvisitorsMutation } from "@/redux/api/invisitorApi";

type InvestorFormValues = {
  propertyId: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  idNumber: string;
  idType: string;
  additionalInfo?: string;
};

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  propertyId: string;
  userId: string;
}

export default function CreateInvisitorModal({
  open,
  setOpen,
  propertyId,
  userId,
}: Props) {
  const { register, handleSubmit, reset, setValue } =
    useForm<InvestorFormValues>();
  const [createInvisitor, { isLoading: invisitorCreateLoading }] =
    useCreatePropertyInvisitorsMutation();

  const onSubmit = async (data: InvestorFormValues) => {
    try {
      const payload = {
        ...data,
        propertyId,
        userId,
      };

      const res = await createInvisitor(payload).unwrap();
      if (res.success) {
        toast.success("Invisitor created successfully !");
        reset();
        setOpen(false);
      }
    } catch (error:any) {
      if (error?.data?.message) toast.error(error.data.errors[0].message);
      else toast.error("Failed to create invisitor!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Invisitor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="Ahmed Mohammed" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register("email")} placeholder="ahmed@example.com" />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input {...register("phoneNumber")} placeholder="+966501234567" />
          </div>

          <div className="space-y-2">
            <Label>Relationship</Label>
            <Select
              onValueChange={(value) => setValue("relationship", value)}
              defaultValue={"OWNER"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"OWNER"}>Owner</SelectItem>
                <SelectItem value={"TENANT"}>Tenant</SelectItem>
                <SelectItem value={"FAMILY_MEMBER"}>Family Member</SelectItem>
                <SelectItem value={"FRIEND"}>Friend</SelectItem>
                <SelectItem value={"COLLEAGUE"}>Colleague</SelectItem>
                <SelectItem value={"LEGAL_REPRESENTATIVE"}>
                  Legal Representative
                </SelectItem>
                <SelectItem value={"OTHER"}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ID Number</Label>
            <Input {...register("idNumber")} placeholder="1234567890" />
          </div>

          <div className="space-y-2">
            <Label>ID Type</Label>

            <Select
              onValueChange={(value) => setValue("idType", value)}
              defaultValue="NATIONAL_ID"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ID Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PASSPORT">Passport</SelectItem>
                <SelectItem value="NATIONAL_ID">National ID</SelectItem>
                <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                <SelectItem value="RESIDENT_ID">Resident ID</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Additional Info</Label>
            <Input
              {...register("additionalInfo")}
              placeholder="Primary contact for property"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
              disabled={invisitorCreateLoading}
            >
              {invisitorCreateLoading && (
                <Loader2 className="animate-spin h-4 w-4 text-white" />
              )}
              Create Invisitor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
