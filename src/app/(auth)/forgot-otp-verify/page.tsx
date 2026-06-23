import ForgotVerifyOTPPage from "@/components/modules/auth/ForgotVerifyOTPPage";
import { Suspense } from "react";

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading Verify Email...</div>}>
      <ForgotVerifyOTPPage />
    </Suspense>
  );
}