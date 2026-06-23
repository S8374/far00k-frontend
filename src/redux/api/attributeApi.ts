import { baseApi } from "./baseApi";

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createPropertyAttributes: builder.mutation({
      query: (formData) => ({
        url: "/property-attributes/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),
    updatePropertyAttributes: builder.mutation({
      query: ({ id, data }) => ({
        url: `/property-attributes/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Properties"],
    }),
    deletePropertyAttributes: builder.mutation({
      query: (attributeId) => ({
        url: `/property-attributes/delete/${attributeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Properties"],
    }),





  }),
});

export const {
  useCreatePropertyAttributesMutation,
  useUpdatePropertyAttributesMutation,
  useDeletePropertyAttributesMutation,
} = attributeApi;
