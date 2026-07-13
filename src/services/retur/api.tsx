import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface ReturItem {
  id: string;
  sales_order_item_id: string;
  item_id?: string;
  fraction_id?: string;
  quantity: number;
}

export interface CreateReturPayload {
  sales_order_id: string;
  notes?: string;
  items: Array<{
    sales_order_item_id: string;
    quantity: number;
  }>;
}

export interface Retur {
  id: string;
  franchisor_id: string;
  code: string;
  sales_order_id: string;
  warehouse_id: string;
  warehouse_name?: string;
  approved_by?: string;
  document_status: string;
  notes?: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  sales_order?: Record<string, unknown>;
  items?: ReturItem[];
}

export interface ReturResponse {
  data: Retur[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ReturParams {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
}

export const returApi = createApi({
  reducerPath: "returApi",
  baseQuery,
  tagTypes: ["Retur"],
  endpoints: (builder) => ({
    getReturs: builder.query<ReturResponse, ReturParams | void>({
      query: (params) => ({
        url: "/sales/return",
        params: params || {},
      }),
      providesTags: ["Retur"],
    }),
    createRetur: builder.mutation<Retur, CreateReturPayload>({
      query: (body) => ({
        url: "/sales/return",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Retur"],
    }),
    showRetur: builder.query<Retur, string>({
      query: (id) => `/sales/return/${id}`,
    }),
    deleteRetur: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sales/return/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Retur"],
    }),
  }),
});

export const {
  useGetRetursQuery,
  useCreateReturMutation,
  useShowReturQuery,
  useDeleteReturMutation,
} = returApi;
