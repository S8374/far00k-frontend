"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/api/authApi";

type FormData = {
    newPassword: string;
    confirmPassword: string;
};

function ResetPasswordClient() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();
  const exchangeToken = searchParams.get("exchangeToken");
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({});

    const onSubmit = async (data: FormData) => {
        const password = data.newPassword
        const confirmPassword = data.confirmPassword

        if (password !== confirmPassword) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }
        const payload = {
            exchangeToken,
            newPassword: password
        }

        try {
            const res = await resetPassword(payload).unwrap();
            console.log("reset-password", res);
            if (res.success) {
                toast.success(res.message)
                router.push(`/login`);
                setIsSuccess(true)
            }
        } catch (error: any) {
            console.log("error", error?.data?.message);
            toast.warning(error?.data?.message || "Registration failed!");
        }
    };
    return (

        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4">
                <div className="relative h-full overflow-hidden rounded-2xl">
                    {/* Background Image*/}
                    <Image
                        src="/signup.jpg"
                        alt="Saudi Vision 2030 Mega Projects Luxury Architecture"
                        fill
                        className="object-cover brightness-[0.85]"
                        priority
                        quality={85}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                        {/* Small tagline */}
                        <p className="mb-4 text-lg font-medium tracking-wider text-orange-400 uppercase md:text-xl">
                            Investment Starts Here
                        </p>

                        {/* Main Heading */}
                        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                            The Future of Saudi
                            <br className="sm:hidden" />
                            <span className="text-orange-400"> Investment</span>
                            <br />
                            Starts Here
                        </h1>

                        {/* Description */}
                        <p className="mb-4 max-w-3xl text-base leading-relaxed text-gray-200 md:text-lg lg:text-xl">
                            Access exclusive <strong>Vision 2030</strong> mega-projects
                            through a trusted,
                            <br className="hidden sm:inline" />
                            REGA-verified platform built for discerning investors and licensed
                            professionals.
                        </p>

                        {/* Security Badges - glassmorphism + shadcn-like style */}
                        <div className="flex flex-col gap-4 md:flex-row sm:gap-6">
                            <div className="flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 backdrop-blur-md border border-white/10 shadow-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800">
                                    <Image
                                        src={"/verify.svg"}
                                        alt="derify"
                                        height={20}
                                        width={20}
                                    />
                                </div>
                                <span className="text-sm font-semibold md:text-base">
                                    Secured by 256-bit Encryption
                                </span>
                            </div>

                            <div className="flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 backdrop-blur-md border border-white/10 shadow-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800">
                                    <Image
                                        src={"/verify-2.svg"}
                                        alt="derify"
                                        height={20}
                                        width={20}
                                    />
                                </div>
                                <span className="text-sm font-semibold md:text-base">
                                    Verified by REGA Authority
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 border p-4 rounded-2xl">
                    <div>
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800">
                                    <Image
                                        src={"/vision.svg"}
                                        alt="derify"
                                        height={20}
                                        width={20}
                                    />
                                </div>
                                <h1 className="text-3xl font-light text-white">VisionEstate</h1>
                            </div>
                            <p className="text-gray-300 text-base">
                                Exclusive access to Saudi Arabia's premier properties
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* New Password */}
                            <div className="space-y-2">
                                <Label className="text-white">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="pl-12 pr-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                                        {...register("newPassword", {
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
                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label className="text-white">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        className="pl-12 pr-12 bg-transparent border-white/50 text-white placeholder:text-gray-400 rounded-xl h-12"
                                        {...register("confirmPassword", {
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

                            {/* Submit Button */}
                            <LoadingButton
                                type="submit"
                                isLoading={isLoading}
                                isSuccess={isSuccess}
                                className="bg-emerald-600 hover:bg-emerald-500"
                            >
                                Reset Password
                            </LoadingButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );

}
export default ResetPasswordClient
