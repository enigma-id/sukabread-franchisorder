import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Order, OrderResponse } from "../types/api";

export interface OrderParams {
  document_status?: string;
  page?: number;
  limit?: number;
  order_by?: string;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query<OrderResponse, OrderParams | void>({
      query: (params) => {
        const queryParams: Record<string, unknown> = {
          ...(params || { limit: 10, order_by: "-sales_order:created_at" }),
        };
        if (queryParams.document_status === "") {
          delete queryParams.document_status;
        }
        return {
          url: "/sales/order",
          params: queryParams,
        };
      },
      providesTags: ["Order"],
    }),
    showOrder: builder.query<Order, string>({
      query: (id) => `/sales/order/${id}`,
      transformResponse: (res: { success: boolean; message: string; data: Order }) => res.data,
      providesTags: ["Order"],
    }),
    cancelOrder: builder.mutation<void, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: `/sales/order/${id}/cancel`,
        method: "PUT",
        body: { note },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useShowOrderQuery,
  useCancelOrderMutation,
} = orderApi;
