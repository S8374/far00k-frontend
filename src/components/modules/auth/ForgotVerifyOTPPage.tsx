"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
  useVerifyResetOtpMutation,
} from "@/redux/api/authApi";
import { LoadingButton } from "@/components/shared/LoadingButton";
import SignupBanner from "./signup/SignupBanner";
import SignupHeader from "./signup/SignupHeader";
import SignupFooter from "./signup/SignupFooter";

export default function ForgotVerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const pendingEmail = searchParams.get("email");
  const [isSuccess, setIsSuccess] = useState(false);

  const [verifyResetOtp, { isLoading: isverifyOtpLoading }] =
    useVerifyResetOtpMutation();
  const [resendOtp, { isLoading: isResendOtpLoading }] = useResendOtpMutation();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length && index + i < 6; i++) {
        newOtp[index + i] = pasteData[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(index + pasteData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    const payload = {
      email: pendingEmail,
      otp: enteredOtp,
    };
    console.log("verify-otp-payload", payload);
    try {
      const res = await verifyResetOtp(payload).unwrap();
      if (res.success) {
        toast.success(
          "OTP verified successfully! You can now reset your password.",
        );
        router.push(`/reset-password?exchangeToken=${res.data.exchangeToken}`);
        setIsSuccess(true);
      }
    } catch (error: any) {
      toast.error(error.data.message || "Verification failed! Try again.");
    }
  };

  const handleResend = async () => {
    await resendOtp({ email: pendingEmail });
    toast.info("OTP resent");
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div  className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <SignupBanner />

        {/*  OTP  */}
        <div className="flex items-center justify-center p-6 md:p-12 bg-neutral-950">
          <div className="w-full max-w-md space-y-8">
            {/* Logo+title */}
            <div className="text-center">
              <SignupHeader />
              <h2 className="text-3xl font-bold text-white">Enter Your OTP</h2>
              <p className="mt-3 text-gray-400">
                A 6-digit code has been sent to <br />
                <span className="text-white font-medium">{pendingEmail}</span>
              </p>
            </div>

            {/* OTP input field */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3 md:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="h-14 w-14 text-center text-2xl font-bold bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                ))}
              </div>

              {/* verify button */}
              <LoadingButton
                disabled={otp.join("").length !== 6}
                type="submit"
                isLoading={isverifyOtpLoading || isResendOtpLoading}
                isSuccess={isSuccess}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Verify
              </LoadingButton>

              {/* resend option */}
              <div className="text-center text-sm text-gray-400">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="text-emerald-400 hover:underline cursor-pointer"
                  onClick={handleResend}
                >
                  Resend Code
                </button>
              </div>
            </form>
            <SignupFooter/>
          </div>
        </div>
      </div>
    </div>
  );
}
