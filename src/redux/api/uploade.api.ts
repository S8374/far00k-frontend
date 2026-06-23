// src/redux/api/uploadApi.ts
import { baseApi } from "./baseApi";

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    data: any;
    urls: string[];
  };
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload/images",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
  }),
});

export const { useUploadImagesMutation } = uploadApi;