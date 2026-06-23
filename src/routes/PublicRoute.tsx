"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/shared/Loading";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: userData, isLoading, isFetching, isError } = useGetMeQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const user = isError ? null : (userData?.data?.data || userData?.data);
  const isUserLoading = isLoading || isFetching;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <Loading />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
};

export default PublicRoute;