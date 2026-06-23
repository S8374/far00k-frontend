"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import SignupBanner from "@/components/modules/auth/signup/SignupBanner";
import SignupHeader from "@/components/modules/auth/signup/SignupHeader";


type FormData = {
    email: string;
};

function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    });
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data: FormData) => {
        try {
            const res = await forgotPassword({ email: data.email }).unwrap();
            if (res.success) {
                router.push(`/forgot-otp-verify?email=${data.email}`);
                toast.success(res.message || "OTP sent to your email");
                setIsSuccess(true)
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send OTP. Please try again.");
        }
    };
    return (<>
        <div  className="container mx-auto min-h-screen flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4">
            <SignupBanner/>
            <div className="col-span-1 border p-4 rounded-2xl">
                <div>
                    {/* Header */}
                    <SignupHeader/>
                    <div className="mb-6 space-y-6 text-center">
                        <h1 className="text-xl font-semibold text-white">Forgot Password</h1>
                        <p className="text-gray-300 text-base px-4 md:px-12">
                            Access a comprehensive hub of materials tailored for exam success.
                            Gain instant mastery over all mandatory school-leaving exam topics
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


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
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <LoadingButton
                            type="submit"
                            isLoading={isLoading}
                            isSuccess={isSuccess}
                            className="bg-emerald-600 hover:bg-emerald-500"
                        >
                            Submit
                        </LoadingButton>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-500"></div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center text-sm text-gray-400">
                        <p>Protected by advanced security measures</p>
                        <p className="mt-1">© 2025 VisionEstate. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </>);
}

export default ForgotPassword;