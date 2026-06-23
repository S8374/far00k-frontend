"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/shared/Loading";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isLoading && (isError || !user?.data)) {
      router.replace("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !user?.data) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;