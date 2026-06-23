import { baseApi } from "./baseApi";

const paymentPlanApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // get my plans
        getMyPaymentPlans: builder.query({
            query: (myId) => ({
                url: `/payment-plans/my/${myId}`,
                method: "GET",
            }),
            providesTags: ["paymentPlans"],
        }),

        // get all plans
        getAllPaymentPlans: builder.query({
            query: (filters) => ({
                url: "/payment-plans/all",
                method: "GET",
                params: filters,
            }),
            providesTags: ["paymentPlans"],
        }),

        // get property payment plans
        getPropertyPaymentPlans: builder.query({
            query: ({ propertyId, ...filters }) => ({
                url: `/payment-plans/property/${propertyId}`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["paymentPlans"],
        }),

        // property stats
        getPropertyPaymentPlanStats: builder.query({
            query: (propertyId) => ({
                url: `/payment-plans/${propertyId}/stats`,
                method: "GET",
            }),
            providesTags: ["paymentPlans"],
        }),

        // global summary
        getPaymentPlanSummary: builder.query({
            query: () => ({
                url: "/payment-plans/summary",
                method: "GET",
            }),
            providesTags: ["paymentPlans"],
        }),

        // property summary
        getPropertyPaymentPlanSummary: builder.query({
            query: (propertyId) => ({
                url: `/payment-plans/property/${propertyId}/summary`,
                method: "GET",
            }),
            providesTags: ["paymentPlans"],
        }),

        // get plan by id
        getPaymentPlanById: builder.query({
            query: (id) => ({
                url: `/payment-plans/${id}`,
                method: "GET",
            }),
            providesTags: ["paymentPlans"],
        }),

        // update plan
        updatePaymentPlan: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/payment-plans/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["paymentPlans"],
        }),

        // delete plan
        deletePaymentPlan: builder.mutation({
            query: (id) => ({
                url: `/payment-plans/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["paymentPlans"],
        }),

    }),
});

export const {
    useGetMyPaymentPlansQuery,
    useGetAllPaymentPlansQuery,
    useGetPropertyPaymentPlansQuery,
    useGetPropertyPaymentPlanStatsQuery,
    useGetPaymentPlanSummaryQuery,
    useGetPropertyPaymentPlanSummaryQuery,
    useGetPaymentPlanByIdQuery,
    useUpdatePaymentPlanMutation,
    useDeletePaymentPlanMutation,
} = paymentPlanApi;