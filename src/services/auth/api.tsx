import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    seamless: builder.mutation({
      query: (data) => ({
        url: "/auth/seamless",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSigninMutation, useSeamlessMutation } = authApi;
