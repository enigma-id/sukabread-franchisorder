import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery,
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (body) => ({
        url: "/sales/order",
        method: "POST",
        body,
      }),
    }),
    getPaymentMethods: builder.query({
      query: (params) => ({
        url: "/payment/method",
        method: "GET",
        params,
      }),
    }),
    getWarehouse: builder.query({
      query: (params) => ({
        url: "/warehouse",
        method: "GET",
        params,
      }),
    }),
    getRegion: builder.query({
      query: (params) => ({
        url: "/regions/search",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetPaymentMethodsQuery,
  useLazyGetPaymentMethodsQuery,
  useGetWarehouseQuery,
  useLazyGetWarehouseQuery,
  useLazyGetRegionQuery,
} = cartApi;
