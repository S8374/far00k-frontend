import { baseApi } from "./baseApi";

export interface UploadKycDocumentPayload {
  userId: string;
  documentType: string;
  fileUrl: string;
  notes?: string;
}

export interface KycDocument {
  id?: string;
  _id?: string;
  uid?: string;
  documentUID?: string;
  documentType?: string;
  fileUrl?: string;
  status?: string;
  verificationStatus?: string;
  isVerified?: boolean;
  rejectionReason?: string;
  rejection_reason?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
  uploadedAt?: string;
  submittedAt?: string;
}

export interface UpdateKycDocumentPayload {
  documentUID: string;
  fileUrl: string;
}

function extractDocumentList(response: any): KycDocument[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.documents)) return response.data.documents;
  if (Array.isArray(response?.documents)) return response.documents;
  return [];
}

export const kycDocumentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKycDocumentsByUser: builder.query<KycDocument[], string>({
      query: (userId) => ({
        url: `/kyc-documents/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => extractDocumentList(response),
      providesTags: [{ type: "users", id: "KYC_DOCUMENTS" }],
    }),

    uploadKycDocument: builder.mutation({
      query: (payload: UploadKycDocumentPayload) => ({
        url: "/kyc-documents/upload",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "users", id: "KYC_DOCUMENTS" },
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),

    updateKycDocument: builder.mutation({
      query: ({ documentUID, fileUrl }: UpdateKycDocumentPayload) => ({
        url: `/kyc-documents/${documentUID}`,
        method: "PATCH",
        body: { fileUrl },
      }),
      invalidatesTags: [
        { type: "users", id: "KYC_DOCUMENTS" },
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),

    deleteKycDocument: builder.mutation({
      query: (documentUID: string) => ({
        url: `/kyc-documents/${documentUID}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "users", id: "KYC_DOCUMENTS" },
        { type: "users", id: "GOLDEN_VISA_PROGRESS" },
      ],
    }),
  }),
});

export const {
  useGetKycDocumentsByUserQuery,
  useUploadKycDocumentMutation,
  useUpdateKycDocumentMutation,
  useDeleteKycDocumentMutation,
} = kycDocumentApi;
