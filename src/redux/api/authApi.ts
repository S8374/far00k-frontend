import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET"
      }),
      providesTags: ["users"]
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["users"]
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    verifyOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    verifyResetOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["users"]
    }),
    resendOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    
  }),
});
export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useVerifyResetOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useGetMeQuery
} = authApi;