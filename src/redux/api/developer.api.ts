// redux/api/developerApi.ts
import { baseApi } from "./baseApi";

const developerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createDeveloper: builder.mutation({
      query: (payload) => ({
        url: `/developers/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Developers"],
    }),

    updateDeveloper: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/developers/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Developers"],
    }),

    getDeveloper: builder.query({
      query: () => ({
        url: `/developers/get`,
        method: "GET",
      }),
      providesTags: ["Developers"],
    }),
    getDeveloperById: builder.query({
      query: (id) => ({
        url: `/developers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Developers", id }],
    }),
    deleteDeveloper: builder.mutation({
      query: (id) => ({
        url: `/developers/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Developers"],
    }),
  }),
});

export const {
  useCreateDeveloperMutation,
  useUpdateDeveloperMutation,
  useGetDeveloperByIdQuery,
  useGetDeveloperQuery,
  useDeleteDeveloperMutation,
} = developerApi;