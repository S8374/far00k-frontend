import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Get Agent Stats
    getAgentStat: builder.query({
      query: ({ agentId }) => ({
        url: `/agent/milestone-payments/agent/${agentId}/dashboard-stats`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    // Update Profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/auth/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    // Edit Profile
    editProfile: builder.mutation({
      query: (data) => ({
        url: `/auth/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

  }),
});

export const {
  useGetAgentStatQuery,
  useUpdateProfileMutation,
  useEditProfileMutation
} = authApi;