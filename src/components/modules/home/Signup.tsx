"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Building2,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { LicenseInput } from "@/components/modules/auth/LicenseInput";
import SignUpServices from "@/components/modules/auth/signup/SignupServices";
type FormData = {
  role: "buyer" | "agent";
  fullName?: string;
  email: string;
  password: string;
  nationality?: string;
  investmentInterest?: string;
  falLicense?: string;
  regaId?: string;
  agencyName?: string;
  terms?: boolean;
  rememberMe?: boolean;
};

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"buyer" | "agent">("agent");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { role },
  });

  const onSubmit = (data: FormData) => {
    console.log("signup-data", data);
  };
  return (
    <>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4">
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
              {/* Role Tabs: Investor/Buyer vs Licensed Agent */}
              <Tabs
                value={role}
                onValueChange={(v) => {
                  const newRole = v as "buyer" | "agent";
                  setRole(newRole);
                  setValue("role", newRole);
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-neutral-800 h-14 rounded-xl p-1">
                  <TabsTrigger
                    value="buyer"
                    className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg"
                  >
                    Investor/Buyer
                  </TabsTrigger>
                  <TabsTrigger
                    value="agent"
                    className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg"
                  >
                    Licensed Agent
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/*Sign Up + Licensed Agent */}
              {role === "agent" && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-400/90">
                  <ShieldCheck className="h-4 w-4" />
                  <span>REGA verification required for licensed agents</span>
                </div>
              )}

              <>
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

                {/* Buyer Specific Fields */}
                {role === "buyer" && (
                  <>
                    <div className="space-y-2 w-full">
                      <Label className="text-white">
                        Nationality/Residency
                      </Label>

                      <div className="relative w-full">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                        <Select>
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
                    </div>

                    <div className="space-y-2 w-full">
                      <Label className="text-white">Investment Interest</Label>

                      <div className="relative w-full">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                        <Select>
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
                    </div>
                  </>
                )}

                {/* Agent Specific Fields */}
                {role === "agent" && (
                  <>
                    {/* FAL License Number*/}
                    <LicenseInput
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

                    {/* REGA ID */}
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
                    />
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
                  </>
                )}
              </>

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

              <>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    {...register("terms", {
                      required: "You must agree to the terms",
                    })}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-white leading-tight"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-emerald-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-emerald-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm">{errors.terms.message}</p>
                )}
              </>

              {/* Security Card */}
              <SignUpServices/>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 h-12 text-base"
              >
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-400">
              <p>Protected by advanced security measures</p>
              <p className="mt-1">© 2025 VisionEstate. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
