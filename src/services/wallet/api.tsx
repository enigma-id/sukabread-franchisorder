import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type {
  BalanceLog,
  TopupRequest,
  WithdrawalRequest,
  PaginatedResponse,
} from "../types/wallet";

export interface BalanceLogParams {
  limit?: number;
  offset?: number;
  sort?: string;
  search?: string;
  filter?: string;
  start_date?: string;
  end_date?: string;
}

export interface TopupRequestParams {
  limit?: number;
  offset?: number;
  sort?: string;
  search?: string;
  filter?: string;
}

export interface WithdrawalRequestParams {
  limit?: number;
  offset?: number;
  sort?: string;
  search?: string;
  filter?: string;
}

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery,
  tagTypes: [
    "BalanceLog",
    "TopupRequest",
    "WithdrawalRequest",
    "PaymentMethod",
  ],
  endpoints: (builder) => ({
    getBalanceLogs: builder.query<
      PaginatedResponse<BalanceLog>,
      BalanceLogParams | void
    >({
      query: (params) => ({
        url: "/balance/log",
        params: params || { limit: 25 },
      }),
      providesTags: ["BalanceLog"],
    }),
    getTopupRequestDetail: builder.query<{ data: TopupRequest }, string>({
      query: (id) => ({
        url: `/outlet-topup-request/${id}`,
      }),
      providesTags: ["TopupRequest"],
    }),
    getTopupRequests: builder.query<
      PaginatedResponse<TopupRequest>,
      TopupRequestParams | void
    >({
      query: (params) => ({
        url: "/outlet-topup-request",
        params: params || { limit: 25 },
      }),
      providesTags: ["TopupRequest"],
    }),
    getWithdrawalRequestDetail: builder.query<
      { data: WithdrawalRequest },
      string
    >({
      query: (id) => ({
        url: `/withdrawal-request/${id}`,
      }),
      providesTags: ["WithdrawalRequest"],
    }),
    createTopupRequest: builder.mutation<
      TopupRequest,
      { amount: number; note: string; payment_method_id: string }
    >({
      query: (body) => ({
        url: "/outlet-topup-request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TopupRequest"],
    }),
    deleteTopupRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/outlet-topup-request/${id}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["TopupRequest"],
    }),
    getWithdrawalRequests: builder.query<
      PaginatedResponse<WithdrawalRequest>,
      WithdrawalRequestParams | void
    >({
      query: (params) => ({
        url: "/withdrawal-request",
        params: params || { limit: 25 },
      }),
      providesTags: ["WithdrawalRequest"],
    }),
    createWithdrawalRequest: builder.mutation<
      WithdrawalRequest,
      {
        amount: number;
        bank_name: string;
        bank_account_name: string;
        bank_account_number: string;
        notes: string;
      }
    >({
      query: (body) => ({
        url: "/withdrawal-request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WithdrawalRequest"],
    }),
    deleteWithdrawalRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/withdrawal-request/${id}/cancel`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["WithdrawalRequest"],
    }),
  }),
});

export const {
  useGetBalanceLogsQuery,
  useGetTopupRequestsQuery,
  useGetTopupRequestDetailQuery,
  useLazyGetTopupRequestDetailQuery,
  useCreateTopupRequestMutation,
  useDeleteTopupRequestMutation,
  useGetWithdrawalRequestsQuery,
  useGetWithdrawalRequestDetailQuery,
  useLazyGetWithdrawalRequestDetailQuery,
  useCreateWithdrawalRequestMutation,
  useDeleteWithdrawalRequestMutation,
} = walletApi;
