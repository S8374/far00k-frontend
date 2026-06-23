import { baseApi } from "./baseApi";

export const paymentPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Payment Plan
    createPaymentPlan: builder.mutation({
      query: (formData) => ({
        url: "/payment-plans/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),

    // Edit Payment Plan
    editPaymentPlan: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/payment-plans/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),

    // Get Payment Plan by ID
    getPaymentPlanById: builder.query({
      query: ({ paymentPlanId }) => ({
        url: `/payment-plans/${paymentPlanId}`,
        method: "GET"
      }),
      providesTags: ["Properties"],
    }),

    // Delete Payment Plan by ID
    deletePaymentPlanById: builder.mutation({
      query: (id) => ({
        url: `/payment-plans/delete/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Properties"],
    }),

    // Get Offplan Payment Schedule (Property Stats)
    getOffplanPaymentSchedule: builder.query({
      query: (propertyId) => ({
        url: `/payment-plans/${propertyId}/stats`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),

    // NEW: Get Payment Plans by Creator ID
    // Get Payment Plans by Creator ID
    getPaymentPlansByCreator: builder.query({
      query: ({ creatorId, propertyId }) => ({
        url: `/payment-plans/my/${creatorId}`,
        method: "GET",
        params: propertyId ? { propertyId } : undefined,
      }),
      providesTags: ["Properties"],
    }),
    // NEW: Get Payment Plans by Buyer ID
    getPaymentPlansByBuyer: builder.query({
      query: ({ buyerId, propertyId }) => ({
        url: `/payment-plans/buyer/${buyerId}`,
        method: "GET",
        params: propertyId ? { propertyId } : undefined,
      }),
      providesTags: ["Properties"],
    }),

    // NEW: Get All Payment Plans with Filters
    getAllPaymentPlans: builder.query({
      query: (filterDto) => ({
        url: "/payment-plans/all",
        method: "GET",
        params: filterDto, // For query parameters like pagination, filters
      }),
      providesTags: ["Properties"],
    }),

    // NEW: Get Payment Plans by Property ID
    getPaymentPlansByProperty: builder.query({
      query: ({ propertyId, filterDto }) => ({
        url: `/payment-plans/property/${propertyId}`,
        method: "GET",
        params: filterDto,
      }),
      providesTags: ["Properties"],
    }),

    // NEW: Get Payment Plans Summary
    getPaymentPlansSummary: builder.query({
      query: () => ({
        url: "/payment-plans/summary",
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),

    // NEW: Get Property Payment Summary
    getPropertyPaymentSummary: builder.query({
      query: (propertyId) => ({
        url: `/payment-plans/property/${propertyId}/summary`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),
  }),
});

export const {
  useCreatePaymentPlanMutation,
  useGetPaymentPlanByIdQuery,
  useEditPaymentPlanMutation,
  useDeletePaymentPlanByIdMutation,
  useGetOffplanPaymentScheduleQuery,
  // New exports
  useGetPaymentPlansByCreatorQuery,
  useGetPaymentPlansByBuyerQuery,
  useGetAllPaymentPlansQuery,
  useGetPaymentPlansByPropertyQuery,
  useGetPaymentPlansSummaryQuery,
  useGetPropertyPaymentSummaryQuery,
} = paymentPlanApi;