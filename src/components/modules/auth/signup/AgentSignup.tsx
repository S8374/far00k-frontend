"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Lock,
    Mail,
    User,
    Building2,
    ShieldCheck,
    ArrowRight,
    Eye,
    EyeOff
} from "lucide-react";
import { LicenseInput } from "@/components/modules/auth/LicenseInput";
import SignUpServices from "@/components/modules/auth/signup/SignupServices";
import FormCheckbox from "../FormCheckbox";
import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/shared/LoadingButton";
type FormData = {
    fullName: string;
    falLicense: number;
    regaId: number;
    agencyName: string;
    email: string;
    password: string;
    terms: boolean;
};

function AgentSignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [registerUser, { isLoading }] = useRegisterMutation()
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        const payload = {
            fullName: data.fullName,
            licenseNumber: data.falLicense,
            ragaId: data.regaId,
            agencyName: data.agencyName,
            email: data.email,
            password: data.password,
            role: "AGENT",
            termsAndCondition: data.terms
        }
        console.log("agent-signup-payload", payload);
        try {
            const res = await registerUser(payload).unwrap()
            if (res) {
                toast.success("Registration successful! Verify your email.");
                router.push(`/verify-otp?email=${data.email}`);
                reset();
                setIsSuccess(true)
            }
        } catch (error: any) {
            console.log("error", error?.data?.message)
            toast.warning(error?.data?.message || "Registration failed!");
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> { /*overflow-y-auto max-h-[45vh] pr-2 scrollbar-hide*/}
                <div className="space-y-2">
                    <Label className="text-white">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Enter your full name"
                            className="pl-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                            {...register("fullName", {
                                required: "Full name is required",
                            })}
                        />
                    </div>
                    {errors.fullName && (
                        <p className="text-red-500 text-sm">
                            {errors.fullName.message}
                        </p>
                    )}
                </div>
                {/* FAL License */}
                <div className="space-y-2">
                    <Label className="text-white">License Number</Label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Enter your FAL License Number"
                            className="pl-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                            {...register("falLicense", {
                                required: "FAL License Number is required",
                            })}
                        />
                    </div>
                    {errors.falLicense && (
                        <p className="text-red-500 text-sm">
                            {errors.falLicense.message}
                        </p>
                    )}
                </div>
                {/* REGA ID */}
                <div className="space-y-2">
                    <Label className="text-white">REGA ID</Label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Enter your REGA ID"
                            className="pl-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                            {...register("regaId", {
                                required: "REGA ID is required",
                            })}
                        />
                    </div>
                    {errors.regaId && (
                        <p className="text-red-500 text-sm">
                            {errors.regaId.message}
                        </p>
                    )}
                </div>


                {/* <LicenseInput
                    label="FAL License Number"
                    placeholder="FAL-KSA-XXXX-XXXX"
                    register={register("falLicense", {
                        required: "FAL License Number is required",
                    })}
                    error={errors.falLicense?.message}
                    icon={
                        <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    }
                />

                <LicenseInput
                    label="REGA ID"
                    placeholder="REGA-XXXX-XXXX"
                    register={register("regaId", {
                        required: "REGA ID is required",
                    })}
                    error={errors.regaId?.message}
                    icon={
                        <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    }
                /> */}
                <div className="space-y-2">
                    <Label className="text-white">Agency Name</Label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Your real estate firm"
                            className="pl-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                            {...register("agencyName", {
                                required: "Agency Name is required",
                            })}
                        />
                    </div>
                    {errors.agencyName && (
                        <p className="text-red-500 text-sm">
                            {errors.agencyName.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label className="text-white">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                            {...register("email", { required: "Email is required" })}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label className="text-white">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-12 pr-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-gray-400"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                <FormCheckbox control={control} />
                <SignUpServices />

                {/* Submit Button */}
                <LoadingButton
                    type="submit"
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                    className="bg-emerald-600 hover:bg-emerald-500"
                >
                    Create Account
                </LoadingButton>
            </form>
        </div>

    );
}

export default AgentSignup;
