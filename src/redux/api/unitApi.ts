import { baseApi } from "./baseApi";

export const unitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createPropertyUnits: builder.mutation({
      query: (formData) => ({
        url: "/units/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),
    updatePropertyUnits: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/units/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),
    getPropertyUnitById: builder.query({
      query: (id) => ({
        url: `/units/${id}`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),
    deletePropertyUnits: builder.mutation({
      query: (id) => ({
        url: `/units/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Properties"],
    }),
  }),
});

export const {
  useCreatePropertyUnitsMutation,
  useDeletePropertyUnitsMutation,
  useUpdatePropertyUnitsMutation,
  useGetPropertyUnitByIdQuery
} = unitApi;