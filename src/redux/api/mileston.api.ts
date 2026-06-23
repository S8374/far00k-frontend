// redux/api/milestoneApi.ts
import { baseApi } from "./baseApi";

const toBuyerPerformanceStats = (response: any) => {
  const raw =
    response?.data?.data?.data ||
    response?.data?.data ||
    response?.data ||
    response ||
    {};

  return {
    propertiesViewed: Number(raw?.propertiesViewed || 0),
    propertiesSaved: Number(raw?.propertiesSaved || 0),
    propertiesOwned: Number(raw?.propertiesOwned || 0),
  };
};

const milestoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentMilestone: builder.mutation({
      query: (formData) => ({
        url: "/milestones/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),

    // GET all milestones
    getMilestones: builder.query({
      query: (params) => ({
        url: `/milestones`,
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // GET milestone by ID
    getMilestoneById: builder.query({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Properties", id }],
    }),

    // GET milestones by plan
    getMilestonesByPlan: builder.query({
      query: ({ planId, ...params }) => ({
        url: `/milestones/plan/${planId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // GET upcoming milestones
    getUpcomingMilestones: builder.query({
      query: (days) => ({
        url: `/milestones/upcoming`,
        method: "GET",
        params: { days },
      }),
      providesTags: ["Properties"],
    }),

    // GET plan summary
    getPlanMilestoneSummary: builder.query({
      query: (planId) => ({
        url: `/milestones/plan/${planId}/summary`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),

    // Buyer: Upload Payment
    uploadBuyerPayment: builder.mutation({
      query: ({ dto, buyerId }) => ({
        url: `/buyer/milestone-payments/upload`,
        method: "POST",
        body: dto,
        params: { buyerId },
      }),
      invalidatesTags: ["Properties"],
    }),

    // Agent: Upload Document
    uploadAgentDocument: builder.mutation({
      query: (dto) => ({
        url: `/agent/milestone-payments/upload`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Properties"],
    }),

    // Agent: Review Payment
    reviewPayment: builder.mutation({
      query: (dto) => ({
        url: `/agent/milestone-payments/review`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Properties"],
    }),

    // Admin: Verify Payment
    verifyPayment: builder.mutation({
      query: (dto) => ({
        url: `/admin/milestone-payments/verify`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [
        "Properties",
        { type: "paymentPlans", id: "GOLDEN_VISA_PROGRESS" },
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),

    // Universal: Mark Payment as Read
    markAsRead: builder.mutation({
      query: (dto) => ({
        url: `/${dto.userRole.toLowerCase()}/milestone-payments/mark-read`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Properties"],
    }),

    getBuyerPerformanceStats: builder.query({
      query: (buyerId) => ({
        url: `/buyer/milestone-payments/performance-stats`,
        method: "GET",
        params: { buyerId },
      }),
      transformResponse: (response: any) => toBuyerPerformanceStats(response),
      providesTags: ["Properties"],
    }),
    getGoldenVisaProgress: builder.query({
      query: () => ({
        url: `/buyer/milestone-payments/golden-visa-progress`,
        method: "GET",
      }),
      transformResponse: (response: any) => ({
        totalProgress: Number(
          response?.data?.data?.totalProgress ??
            response?.data?.totalProgress ??
            response?.totalProgress ??
            0,
        ),
      }),
      providesTags: [
        "Properties",
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
        { type: "paymentPlans", id: "GOLDEN_VISA_PROGRESS" },
        { type: "paymentPlanAcceptance", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),

  }),
});

export const {
  useCreatePaymentMilestoneMutation,
  useGetMilestonesQuery,
  useGetMilestoneByIdQuery,
  useGetMilestonesByPlanQuery,
  useGetUpcomingMilestonesQuery,
  useGetPlanMilestoneSummaryQuery,
  useUploadBuyerPaymentMutation,
  useUploadAgentDocumentMutation,
  useReviewPaymentMutation,
  useVerifyPaymentMutation,
  useMarkAsReadMutation,
  useGetBuyerPerformanceStatsQuery,
  useGetGoldenVisaProgressQuery,
} = milestoneApi;
