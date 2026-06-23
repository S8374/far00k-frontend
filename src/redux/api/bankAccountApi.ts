import { baseApi } from "./baseApi";

export const bankAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // CREATE BANK ACCOUNT
    createPropertyBankAccounts: builder.mutation({
      query: (formData) => ({
        url: "/bank-accounts/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),

    // GET ALL BANK ACCOUNTS
    getBankAccounts: builder.query({
      query: (params) => ({
        url: "/bank-accounts",
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // GET BANK ACCOUNTS BY PROPERTY
    getBankAccountsByProperty: builder.query({
      query: ({ propertyId, ...params }) => ({
        url: `/bank-accounts/property/${propertyId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // GET BANK ACCOUNTS BY USER
    getBankAccountsByUser: builder.query({
      query: ({ userId, ...params }) => ({
        url: `/bank-accounts/user/${userId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // UPDATE BANK ACCOUNT
    updateBankAccount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bank-accounts/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Properties"],
    }),

    // DELETE BANK ACCOUNT
    deleteBankAccount: builder.mutation({
      query: (id) => ({
        url: `/bank-accounts/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Properties"],
    }),

  }),
});

export const {
  useCreatePropertyBankAccountsMutation,
  useGetBankAccountsQuery,
  useGetBankAccountsByPropertyQuery,
  useGetBankAccountsByUserQuery,
  useUpdateBankAccountMutation,
  useDeleteBankAccountMutation,
} = bankAccountApi;