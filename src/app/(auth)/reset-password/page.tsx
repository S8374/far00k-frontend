import { Suspense } from "react";
import Loading from "@/components/shared/Loading";
import ResetPasswordClient from "@/components/modules/auth/ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
