"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Lock,
    Mail,
    User,
    ShieldCheck,
    ArrowRight,
    Eye,
    EyeOff,
    Globe,
    Briefcase,
} from "lucide-react";
import SignUpServices from "@/components/modules/auth/signup/SignupServices";
import FormCheckbox from "../FormCheckbox";
import { useRegisterMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingButton } from "@/components/shared/LoadingButton";
type FormData = {
    fullName: string;
    nationality: string;
    investmentInterest: string;
    email: string;
    password: string;
    terms: boolean;
};

function BuyerSignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [registerUser, { isLoading }] = useRegisterMutation()
    const router = useRouter()
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<FormData>({
    });

    const onSubmit = async (data: FormData) => {
        console.log("buyer-signup-data", data);
        const payload = {
            fullName: data.fullName,
            nationality: data.nationality,
            investmentInterest: data.investmentInterest,
            email: data.email,
            password: data.password,
            termsAndCondition: data.terms,
        }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Full Name - Only in Signup */}
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



                <Controller
                    name="nationality"
                    control={control}
                    rules={{ required: "Nationality is required" }}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2 w-full">
                            <Label className="text-white">Nationality/Residency</Label>

                            <div className="relative w-full">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full pl-12 bg-transparent border-white/50 text-white rounded-xl h-12">
                                        <SelectValue placeholder="Select your Nationality" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="saudi">Saudi Arabia</SelectItem>
                                        <SelectItem value="gcc">GCC Resident</SelectItem>
                                        <SelectItem value="international">
                                            International
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {fieldState.error && (
                                <p className="text-red-500 text-sm">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />


                <Controller
                    name="investmentInterest"
                    control={control}
                    rules={{ required: "Investment type is required" }}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2 w-full">
                            <Label className="text-white">Investment Interest</Label>

                            <div className="relative w-full">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full pl-12 bg-transparent border-white/50 text-white rounded-xl h-12">
                                        <SelectValue placeholder="Select investment type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="residential">
                                            Residential
                                        </SelectItem>
                                        <SelectItem value="commercial">
                                            Commercial
                                        </SelectItem>
                                        <SelectItem value="offplan">
                                            Off-Plan Projects
                                        </SelectItem>
                                        <SelectItem value="vision2030">
                                            Vision 2030 Mega Projects
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {fieldState.error && (
                                <p className="text-red-500 text-sm">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />


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

export default BuyerSignup;
