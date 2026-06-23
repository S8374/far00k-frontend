import { baseApi } from "./baseApi";

export const invisitorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // CREATE PROPERTY INVISITOR
    createPropertyInvisitors: builder.mutation({
      query: (formData) => ({
        url: "/property-invisitors/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),

    // GET ALL INVISITORS
    getPropertyInvisitors: builder.query({
      query: (params) => ({
        url: "/property-invisitors",
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // GET INVISITORS BY PROPERTY
    getPropertyInvisitorsByProperty: builder.query({
      query: ({ propertyId, ...params }) => ({
        url: `/property-invisitors/property/${propertyId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // GET INVISITORS BY USER
    getPropertyInvisitorsByUser: builder.query({
      query: ({ userId, ...params }) => ({
        url: `/property-invisitors/user/${userId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Properties"],
    }),

    // UPDATE INVISITOR
    updatePropertyInvisitor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/property-invisitors/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Properties"],
    }),

    // DELETE INVISITOR
    deletePropertyInvisitor: builder.mutation({
      query: (id) => ({
        url: `/property-invisitors/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Properties"],
    }),

  }),
});

export const {
  useCreatePropertyInvisitorsMutation,
  useGetPropertyInvisitorsQuery,
  useGetPropertyInvisitorsByPropertyQuery,
  useGetPropertyInvisitorsByUserQuery,
  useUpdatePropertyInvisitorMutation,
  useDeletePropertyInvisitorMutation,
} = invisitorApi;