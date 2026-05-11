import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { CatalogItem } from "../types/api";

export interface CatalogResponse {
  data: CatalogItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CatalogParams {
  search?: string;
  page?: number;
  limit?: number;
  order_by?: string;
}

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery,
  endpoints: (builder) => ({
    getCatalog: builder.query<CatalogResponse, CatalogParams | void>({
      query: (params) => ({
        url: "/catalog",
        params: params || { limit: 13, order_by: "catalog_id__name" },
      }),
    }),
    showCatalog: builder.query<CatalogItem, string>({
      query: (id) => `/catalog/${id}`,
    }),
  }),
});

export const { useGetCatalogQuery, useShowCatalogQuery } = catalogApi;
