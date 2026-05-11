import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Order } from "../types/api";

export interface OrderResponse {
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface OrderParams {
  status?: string;
  page?: number;
  limit?: number;
  order_by?: string;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  endpoints: (builder) => ({
    getOrders: builder.query<OrderResponse, OrderParams | void>({
      query: (params) => {
        const queryParams: any = {
          ...(params || { limit: 10, order_by: "-id" }),
        };
        if (queryParams.status === "") {
          delete queryParams.status;
        }
        return {
          url: "/order",
          params: queryParams,
        };
      },
    }),
    showOrder: builder.query<Order, string>({
      query: (id) => `/order/${id}`,
    }),
    cancelOrder: builder.mutation<void, { id: string; void_note: string }>({
      query: ({ id, void_note }) => ({
        url: `/order/${id}/cancel`,
        method: "PUT",
        body: { void_note },
      }),
    }),
    getOrderPaymentMethod: builder.query<any, string>({
      query: (id) => `/order/${id}/payment-method`,
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useShowOrderQuery,
  useCancelOrderMutation,
  useGetOrderPaymentMethodQuery,
} = orderApi;
