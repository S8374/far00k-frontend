import { baseApi } from "./baseApi";

const paymentPlanAcceptanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // accept payment plan
    acceptPaymentPlan: builder.mutation({
      query: (data) => ({
        url: "/payment-plan/accept",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["paymentPlanAcceptance"],
    }),

    // toggle acceptance
    togglePaymentPlanAcceptance: builder.mutation({
      query: (data) => ({
        url: "/payment-plan/toggle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["paymentPlanAcceptance"],
    }),

    // check acceptance
    checkPaymentPlanAcceptance: builder.query({
      query: ({ buyerId, propertyId, paymentPlanId }) => ({
        url: "/payment-plan/check",
        method: "GET",
        params: {
          buyerId: String(buyerId),
          propertyId: String(propertyId),
          paymentPlanId: String(paymentPlanId),
        },
      }),
      providesTags: ["paymentPlanAcceptance"],
    }),

    // get acceptance by id
    getPaymentPlanAcceptanceById: builder.query({
      query: (id) => ({
        url: `/payment-plan/${id}`,
        method: "GET",
      }),
      providesTags: ["paymentPlanAcceptance"],
    }),

    // get all accepted plans by buyer
    getBuyerPaymentPlanAcceptance: builder.query({
      query: ({ buyerId, ...filters }) => ({
        url: `/payment-plan/buyer/${buyerId}`,
        method: "GET",
        params: filters,
      }),
      providesTags: ["paymentPlanAcceptance"],
    }),

  }),
});

export const {
  useAcceptPaymentPlanMutation,
  useTogglePaymentPlanAcceptanceMutation,
  useCheckPaymentPlanAcceptanceQuery,
  useGetPaymentPlanAcceptanceByIdQuery,
  useGetBuyerPaymentPlanAcceptanceQuery,
} = paymentPlanAcceptanceApi;