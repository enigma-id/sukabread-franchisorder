import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery,
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    getCatalog: builder.query({
      query: (params) => ({
        url: "/catalog",
        method: "GET",
        params,
      }),
    }),
    showCatalog: builder.query({
      query: ({ id, ...params }) => ({
        url: `/catalog/${id}`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetCatalogQuery, useShowCatalogQuery } = catalogApi;
