/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1`,
  credentials: "include",
});

let isRedirecting = false;

const baseQueryWithAuth: any = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!isRedirecting) {
      isRedirecting = true;

      console.log("Token expired → logging out");

      await baseQuery(
        {
          url: "/auth/logout",
          method: "POST",
        },
        api,
        extraOptions
      );

      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        // Do not force-redirect visitors on public pages (home, property details, etc).
        // Only redirect to login for authenticated-only routes (e.g., dashboard/profile).
        const isPublicPage = path === "/" || path.startsWith("/property/") || path === "/signup" || path === "/login" || path.startsWith("/forgot-") || path.startsWith("/verify-") || path.startsWith("/reset-");
        if (path !== "/login" && !isPublicPage) {
          window.location.replace("/login");
        }
      }

      isRedirecting = false;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Properties",
    "users",
    "Developers",
    "paymentPlanAcceptance",
    "paymentPlans",
    "Messages",
  ],
  endpoints: () => ({}),
});