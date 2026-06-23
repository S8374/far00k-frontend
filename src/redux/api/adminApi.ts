import { baseApi } from "./baseApi";

const toArray = (response: any): any[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.data?.documents)) return response.data.data.documents;
  if (Array.isArray(response?.data?.data?.kycDocuments)) return response.data.data.kycDocuments;
  if (Array.isArray(response?.data?.users)) return response.data.users;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.data?.documents)) return response.data.documents;
  if (Array.isArray(response?.documents)) return response.documents;
  if (Array.isArray(response?.data?.properties)) return response.data.properties;
  if (Array.isArray(response?.properties)) return response.properties;
  return [];
};

const toPaymentRequests = (response: any): any[] => {
  if (Array.isArray(response?.data?.data?.payments)) return response.data.data.payments;
  if (Array.isArray(response?.data?.payments)) return response.data.payments;
  if (Array.isArray(response?.payments)) return response.payments;
  return toArray(response);
};

export const adminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminUsers: builder.query<any[], { page?: number; limit?: number; search?: string; role?: string; status?: string } | void>({
      query: (params = {}) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => toArray(response),
      providesTags: ["users"],
    }),

    getUsersList: builder.query<any, { adminId: string; page?: number; limit?: number; search?: string; role?: string; status?: string }>({
      query: ({ adminId, ...params }) => ({
        url: `/admin/users/${adminId}`,
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),

    getAdminUserDetails: builder.query<any, string>({
      query: (userId) => ({
        url: `/admin/users/details/${userId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    updateAdminUserStatus: builder.mutation<any, { userId: string; status: string }>({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["users"],
    }),

    deleteUserByAdmin: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    createAdminUser: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),

    updateAdminUser: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),

    deleteAdminUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    blockToggleUser: builder.mutation({
      async queryFn(arg: { userId: string; isBlocked: boolean; reason?: string }, _api, _extraOptions, fetchWithBQ) {
        const attempts = [
          {
            url: `/users/${arg.userId}/block`,
            method: "PATCH" as const,
            body: { isBlocked: arg.isBlocked, reason: arg.reason },
          },
          {
            url: `/users/block/${arg.userId}`,
            method: "PATCH" as const,
            body: { isBlocked: arg.isBlocked, reason: arg.reason },
          },
          {
            url: `/users/${arg.userId}`,
            method: "PATCH" as const,
            body: { isBlocked: arg.isBlocked, reason: arg.reason },
          },
        ];

        let lastError: any = null;

        for (const attempt of attempts) {
          const result = await fetchWithBQ(attempt);
          if (!result.error) {
            return { data: result.data };
          }
          lastError = result.error;
        }

        return { error: lastError || { status: "CUSTOM_ERROR", error: "User block toggle failed" } };
      },
      invalidatesTags: ["users"],
    }),

    getPendingProperties: builder.query<any[], void>({
      query: () => ({
        url: "/verified/properties/pending",
        method: "GET",
      }),
      transformResponse: (response: any) => toArray(response),
      providesTags: ["Properties"],
    }),

    getVerifiedProperties: builder.query<any[], void>({
      query: () => ({
        url: "/verified/all",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const fromNestedProperties = response?.data?.data?.properties;
        if (Array.isArray(fromNestedProperties)) return fromNestedProperties;

        const fromDataProperties = response?.data?.properties;
        if (Array.isArray(fromDataProperties)) return fromDataProperties;

        return toArray(response);
      },
      providesTags: ["Properties"],
    }),

    verifyPropertyByAdmin: builder.mutation({
      query: (payload) => ({
        url: "/verified/properties/verify",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Properties"],
    }),

    getPendingAgents: builder.query<any[], void>({
      query: () => ({
        url: "/verified/agents/pending",
        method: "GET",
      }),
      transformResponse: (response: any) => toArray(response),
      providesTags: ["users"],
    }),

    verifyAgentByAdmin: builder.mutation({
      query: (payload) => ({
        url: "/verified/agents/verify",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),

    getPendingKycDocuments: builder.query<any[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const attempts = ["/kyc-documents/pending", "/kyc-documents/admin/pending"];

        let lastError: any = null;
        for (const url of attempts) {
          const result = await fetchWithBQ({ url, method: "GET" });
          if (!result.error) {
            return { data: toArray(result.data) };
          }
          lastError = result.error;
        }

        return { error: lastError || { status: "CUSTOM_ERROR", error: "Pending KYC load failed" } };
      },
      providesTags: ["users"],
    }),

    getAllKycDocumentsByAdmin: builder.query<any[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const attempts = ["/kyc-documents", "/admin/kyc-documents", "/kyc-documents/pending", "/kyc-documents/admin/pending"];

        let lastError: any = null;
        for (const url of attempts) {
          const result = await fetchWithBQ({ url, method: "GET" });
          if (!result.error) {
            return { data: toArray(result.data) };
          }
          lastError = result.error;
        }

        return { error: lastError || { status: "CUSTOM_ERROR", error: "KYC documents load failed" } };
      },
      providesTags: ["users"],
    }),

    verifyKycDocumentByAdmin: builder.mutation({
      async queryFn(
        arg: {
          documentId?: string;
          kycDocumentId?: string;
          documentUID?: string;
          id?: string;
          adminId: string;
          isApproved?: boolean;
          status?: "VERIFIED" | "REJECTED";
          notes?: string;
          rejectionReason?: string;
        },
        _api,
        _extraOptions,
        fetchWithBQ
      ) {
        const documentId = arg.documentId || arg.kycDocumentId || arg.documentUID || arg.id;
        const status = arg.status || (arg.isApproved ? "VERIFIED" : "REJECTED");

        if (!documentId) {
          return { error: { status: "CUSTOM_ERROR", error: "KYC document id is missing" } };
        }

        const attempts = [
          {
            url: "/kyc-documents/verify",
            method: "POST" as const,
            body: {
              documentId,
              adminId: arg.adminId,
              status,
              notes: arg.notes,
              rejectionReason: arg.rejectionReason,
            },
          },
          {
            url: "/kyc-documents/admin/verify",
            method: "POST" as const,
            body: {
              documentId,
              adminId: arg.adminId,
              status,
              notes: arg.notes,
              rejectionReason: arg.rejectionReason,
            },
          },
          {
            url: "/kyc-documents/verify",
            method: "POST" as const,
            body: arg,
          },
          {
            url: "/kyc-documents/admin/verify",
            method: "POST" as const,
            body: arg,
          },
          {
            url: `/kyc-documents/${documentId}`,
            method: "PATCH" as const,
            body: { status, notes: arg.notes, adminId: arg.adminId, rejectionReason: arg.rejectionReason },
          },
        ];

        let lastError: any = null;
        for (const attempt of attempts) {
          const result = await fetchWithBQ(attempt);
          if (!result.error) {
            return { data: result.data };
          }
          lastError = result.error;
        }

        return { error: lastError || { status: "CUSTOM_ERROR", error: "KYC verification failed" } };
      },
      invalidatesTags: [
        "users",
        { type: "users", id: "KYC_DOCUMENTS" },
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),
    getPendingMilestonePaymentsByAdmin: builder.query<any[], any>({
      async queryFn(arg, _api, _extraOptions, fetchWithBQ) {
        const { adminId, ...params } = arg;
        const attempts = [
          `/admin/milestone-payments/pending/${adminId}`,
          "/admin/milestone-payments/pending",
          `/milestone-payments/pending/${adminId}`,
          "/milestone-payments/pending",
        ];

        let lastError: any = null;
        for (const url of attempts) {
          const result = await fetchWithBQ({ url, method: "GET", params });
          if (!result.error) {
            return { data: toPaymentRequests(result.data) };
          }
          lastError = result.error;
        }

        return { error: lastError || { status: "CUSTOM_ERROR", error: "Pending payment requests load failed" } };
      },
      providesTags: ["paymentPlans", "users"],
    }),

    verifyMilestonePaymentByAdmin: builder.mutation({
      async queryFn(
        arg: {
          paymentId: string;
          adminId: string;
          approve: boolean;
          notes?: string;
          rejectionReason?: string;
        },
        _api,
        _extraOptions,
        fetchWithBQ
      ) {
        const attempts = [
          {
            url: "/admin/milestone-payments/verify",
            method: "POST" as const,
            body: arg,
          },
          {
            url: "/milestone-payments/verify",
            method: "POST" as const,
            body: arg,
          },
        ];

        let lastError: any = null;
        for (const attempt of attempts) {
          const result = await fetchWithBQ(attempt);
          if (!result.error) {
            return { data: result.data };
          }
          lastError = result.error;
        }

        return { error: lastError || { status: "CUSTOM_ERROR", error: "Payment verification failed" } };
      },
      invalidatesTags: [
        "paymentPlans",
        "users",
        { type: "paymentPlans", id: "GOLDEN_VISA_PROGRESS" },
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),

    getVerifiedStats: builder.query({
      query: () => ({
        url: "/verified/stats",
        method: "GET",
      }),
      providesTags: ["users", "Properties"],
    }),

    getAgentStats: builder.query<any, { adminId: string }>({
      query: ({ adminId }) => ({
        url: `/admin/agents/stats/${adminId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getAllAgentsByAdmin: builder.query<any, { adminId: string; page?: number; limit?: number; search?: string }>({
      query: ({ adminId, ...params }) => ({
        url: `/admin/agents/${adminId}`,
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useGetUsersListQuery,
  useGetAdminUserDetailsQuery,
  useUpdateAdminUserStatusMutation,
  useDeleteUserByAdminMutation,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useBlockToggleUserMutation,
  useGetPendingPropertiesQuery,
  useGetVerifiedPropertiesQuery,
  useVerifyPropertyByAdminMutation,
  useGetPendingAgentsQuery,
  useVerifyAgentByAdminMutation,
  useGetPendingKycDocumentsQuery,
  useGetAllKycDocumentsByAdminQuery,
  useVerifyKycDocumentByAdminMutation,
  useGetPendingMilestonePaymentsByAdminQuery,
  useVerifyMilestonePaymentByAdminMutation,
  useGetVerifiedStatsQuery,
  useGetAgentStatsQuery,
  useGetAllAgentsByAdminQuery,
} = adminApi;
