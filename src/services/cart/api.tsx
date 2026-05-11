import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { CartItem } from "../types/api";

export interface CheckoutRequest {
  items: CartItem[];
  payment_method: {
    bank_id: string;
    phone?: string;
  };
  shipping_at: string; // YYYY-MM-DD
}

export interface PaymentMethod {
  id: string;
  name: string;
  is_payment_gateway?: number;
}

export interface ScheduleItem {
  date: string;
  date_string: string;
  cost: number;
}

export interface ScheduleResponse {
  schedules: ScheduleItem[];
  vendor_name: string;
  estimated_arrival: number;
  default_cost: number;
  total_weight: number;
}

export interface ScheduleParams {
  items: CartItem[];
}

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery,
  endpoints: (builder) => ({
    checkout: builder.mutation<any, CheckoutRequest>({
      query: (body) => ({
        url: "/cart/checkout",
        method: "POST",
        body,
      }),
    }),
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => "/cart/payment-method",
    }),
    getSchedule: builder.mutation<ScheduleResponse, ScheduleParams>({
      query: (body) => ({
        url: "/cart/schedule",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetPaymentMethodsQuery,
  useGetScheduleMutation,
} = cartApi;
