import { baseApi } from "./baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: "/messages/conversations",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Messages"],
    }),
    getHistory: builder.query({
      query: (conversationId: string) => ({
        url: `/messages/history/${conversationId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "Messages", id }],
    }),
    startConversation: builder.mutation({
      query: (data: { participantId: string; propertyId?: string; initialMessage?: string }) => ({
        url: "/messages/conversation",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Messages"],
    }),
    updateMessage: builder.mutation({
      query: ({ id, content }: { id: string; content: string }) => ({
        url: `/messages/edit-message/${id}?v=${Date.now()}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation({
      query: (id: string) => ({
        url: `/messages/remove-message/${id}?v=${Date.now()}`,
        method: "POST",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetHistoryQuery,
  useStartConversationMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messageApi;
