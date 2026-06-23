import { baseApi } from "./baseApi";

export type ListingPurposeFilter = "SELL" | "RENT";
export type TimeFilter = "today" | "this_week" | "this_month" | "this_year";

export interface PropertySearchParams {
  type?: string;
  location?: string;
  search?: string;
  listingPurpose?: ListingPurposeFilter;
  minPrice?: number;
  maxPrice?: number;
  timeFilter?: TimeFilter;
  sortBy?: "price" | "createdAt" | "views" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const extractPropertyList = (response: any): any[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.properties)) return response.data.properties;
  if (Array.isArray(response?.properties)) return response.properties;
  return [];
};

type SaveTogglePayload = {
  propertyId?: string | number;
  id?: string | number;
  userId?: string | number;
  property?: Record<string, any>;
  [key: string]: unknown;
};

const extractPropertyId = (payload?: SaveTogglePayload) =>
  payload?.propertyId ?? payload?.id;

const resolvePropertyIdentity = (property: Record<string, any> | undefined) =>
  property?.id ?? property?._id ?? property?.propertyId;

const applySavedStateToProperty = (
  property: Record<string, any>,
  isSaved: boolean,
) => ({
  ...property,
  isSaved,
  isSavedByCurrentUser: isSaved,
  saved: isSaved,
  favourite: isSaved,
  favorite: isSaved,
});

const updateSavedPropertiesCache = (
  draft: any,
  propertyId: string | number | undefined,
  isSaved: boolean,
  propertySnapshot?: Record<string, any>,
) => {
  if (propertyId === undefined || propertyId === null) return;

  const matchesProperty = (item: Record<string, any>) =>
    String(resolvePropertyIdentity(item)) === String(propertyId);

  if (!Array.isArray(draft)) return;

  const existingIndex = draft.findIndex(matchesProperty);

  if (isSaved) {
    if (existingIndex >= 0) {
      draft[existingIndex] = applySavedStateToProperty(draft[existingIndex], true);
      return;
    }

    if (propertySnapshot) {
      draft.unshift(applySavedStateToProperty(propertySnapshot, true));
    }
    return;
  }

  if (existingIndex >= 0) {
    draft.splice(existingIndex, 1);
  }
};

const buildPropertySearchParams = (params?: PropertySearchParams) => {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProperty: builder.mutation({
      query: (formData) => ({
        url: "/property/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),
    saveProperty: builder.mutation({
      query: (payload: SaveTogglePayload) => ({
        url: "/property/saved",
        method: "POST",
        body: {
          userId: payload?.userId,
          propertyId: extractPropertyId(payload),
        },
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const propertyId = extractPropertyId(payload);
        const userId = payload?.userId;

        if (!propertyId || !userId) return;

        const patches = [
          dispatch(
            propertyApi.util.updateQueryData(
              "checkPropertySaved",
              { userId, propertyId },
              (draft) => {
                draft.isSaved = true;
                draft.resolved = true;
              },
            ),
          ),
          dispatch(
            propertyApi.util.updateQueryData(
              "getSavedPropertiesByUser",
              String(userId),
              (draft) => {
                updateSavedPropertiesCache(
                  draft,
                  propertyId,
                  true,
                  payload?.property,
                );
              },
            ),
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          patches.reverse().forEach((patch) => patch.undo());
        }
      },
    }),
    unsaveProperty: builder.mutation({
      query: (payload: SaveTogglePayload) => ({
        url: "/property/unsaved",
        method: "POST",
        body: {
          userId: payload?.userId,
          propertyId: extractPropertyId(payload),
        },
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const propertyId = extractPropertyId(payload);
        const userId = payload?.userId;

        if (!propertyId || !userId) return;

        const patches = [
          dispatch(
            propertyApi.util.updateQueryData(
              "checkPropertySaved",
              { userId, propertyId },
              (draft) => {
                draft.isSaved = false;
                draft.resolved = true;
              },
            ),
          ),
          dispatch(
            propertyApi.util.updateQueryData(
              "getSavedPropertiesByUser",
              String(userId),
              (draft) => {
                updateSavedPropertiesCache(draft, propertyId, false);
              },
            ),
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          patches.reverse().forEach((patch) => patch.undo());
        }
      },
    }),
    Property: builder.mutation({
      query: (formData) => ({
        url: "/property/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),

    editProperty: builder.mutation({
      query: ({ formData, propertyId }) => ({
        url: `/property/update/${propertyId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Properties"],
    }),
    deleteProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/property/delete/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Properties"],
    }),
    getAllProperty: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: string }) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: "/property/all",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Properties"],
    }),



    getPropertyById: builder.query({
      query: (propertyId) => ({
        url: `/property/${propertyId}`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),
    getMyProperty: builder.query({
      query: (agentId) => ({
        url: `/agent/milestone-payments/my/${agentId}`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),
    getSavedPropertiesByUser: builder.query<any[], string>({
      query: (userId) => ({
        url: `/property/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => extractPropertyList(response),
      providesTags: ["Properties"],
    }),
    getAllProperties: builder.query({
      query: (params?: PropertySearchParams) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              queryParams.set(key, String(value));
            }
          });
        }
        return {
          url: "/property/all",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Properties"],
    }),
    getPropertyCategories: builder.query({
      query: () => ({
        url: "/property/categories",
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),
    checkPropertySaved: builder.query<{ isSaved: boolean; resolved: boolean }, SaveTogglePayload>({
      query: (payload) => ({
        url: "/property/check",
        method: "GET",
        params: {
          userId: payload?.userId,
          propertyId: extractPropertyId(payload),
        },
      }),
      transformResponse: (response: any) => {
        const isSaved =
          response?.data?.data?.isSaved ??
          response?.data?.isSaved ??
          response?.isSaved ??
          false;

        return {
          isSaved: Boolean(isSaved),
          resolved: true,
        };
      },
      providesTags: ["Properties"],
    }),
    trackPropertyView: builder.mutation({
      query: (dto) => ({
        url: "/property-views/create",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Properties"],
    }),
    getTrendingProperties: builder.query({
      query: () => ({
        url: "/property-views/trending",
        method: "GET",
      }),
      transformResponse: (response: any) => extractPropertyList(response),
      providesTags: ["Properties"],
    }),
    getPropertyStats: builder.query({
      query: (propertyId) => ({
        url: `/property-views/property/${propertyId}/stats`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),

  }),
});

export const {
  useCreatePropertyMutation,
  useGetMyPropertyQuery,
  useGetSavedPropertiesByUserQuery,
  useEditPropertyMutation,
  useDeletePropertyMutation,
  useGetPropertyByIdQuery,
  useGetAllPropertiesQuery,
  useGetPropertyCategoriesQuery,
  useSavePropertyMutation,
  useUnsavePropertyMutation,
  useCheckPropertySavedQuery,
  useTrackPropertyViewMutation,
  useGetTrendingPropertiesQuery,
  useGetPropertyStatsQuery,
} = propertyApi;
