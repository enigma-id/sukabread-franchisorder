import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { SigninRequest, SigninResponse, SeamlessRequest } from "./types";
import type { User } from "../types/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    seamless: builder.mutation<SigninResponse, SeamlessRequest>({
      query: (data) => ({
        url: "/auth/seamless",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
    }),
    updateMe: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSeamlessMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
} = authApi;
