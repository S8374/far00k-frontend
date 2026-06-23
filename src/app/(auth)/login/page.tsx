/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingButton } from "@/components/shared/LoadingButton";
import SignupBanner from "@/components/modules/auth/signup/SignupBanner";
import SignUpServices from "@/components/modules/auth/signup/SignupServices";
import SignupFooter from "@/components/modules/auth/signup/SignupFooter";
import SignupHeader from "@/components/modules/auth/signup/SignupHeader";

// Key for localStorage
const REMEMBER_ME_KEY = "remembered_user";

type FormData = {
  email: string;
  password: string;
};

type RememberedUser = {
  email: string;
  password: string;
  remember: boolean;
};

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({});

  // Load remembered credentials on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedUser) {
      try {
        const userData: RememberedUser = JSON.parse(savedUser);
        if (userData.remember) {
          setValue("email", userData.email);
          setValue("password", userData.password);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Failed to parse remembered user:", error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    
    try {
      const res = await login(payload).unwrap();
      console.log("Login response:", res);
      // Handle remember me
      if (rememberMe) {
        // Save credentials
        const userToRemember: RememberedUser = {
          email: data.email,
          password: data.password,
          remember: true,
        };
        localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(userToRemember));
      } else {
        // Clear saved credentials if remember me is unchecked
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
      
      if (res.success) {
        router.push("/");
        toast.success("Login successful!");
        setIsSuccess(true);
      } else {
        router.push(`/verify-otp?email=${data.email}`);
      }
    } catch (error: any) {
      toast.warning("Something went wrong");
      return;
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    
    // If unchecked, remove saved credentials
    if (!checked) {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4">
        <SignupBanner />
        <div className="col-span-1 border p-4 rounded-2xl">
          <div>
            {/* Header */}
            <SignupHeader />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-white">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
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

              {/* Sign In Extra Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="remember" 
                    className="text-emerald-700"
                    checked={rememberMe}
                    onCheckedChange={(checked) => 
                      handleRememberMeChange(checked as boolean)
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-white">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-orange-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Security Card */}
              <SignUpServices />

              {/* Submit Button */}
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                isSuccess={isSuccess}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Sign In
              </LoadingButton>

              {/* Register Option */}
              <p className="text-center mt-2 text-sm text-gray-400">
                No Account?{" "}
                <Link href={"/signup"} className="text-emerald-400 hover:underline">
                  Register
                </Link>
              </p>

          
             
            </form>
            {/* Footer */}
            <SignupFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
