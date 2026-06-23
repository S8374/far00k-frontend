import { baseApi } from "./baseApi";

const agentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentPerformance: builder.query({
      query: ({ agentId }) => ({
        url: `/agent/milestone-payments/${agentId}/performance`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useGetAgentPerformanceQuery
} = agentApi;