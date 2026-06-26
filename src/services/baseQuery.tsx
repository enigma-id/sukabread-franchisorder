import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { saveAs } from "file-saver";
import { logger } from "@/utils/logger";
import { isAuthError } from "@/utils/errors";
import type { ApiError } from "./types/api";
import { logout } from "./auth/slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state?.auth?.session?.access_token;

    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    logger.apiHeaders(headers);

    return headers;
  },

  responseHandler: async (response) => {
    const contentType = response.headers.get("content-type");

    if (contentType === "application/octet-stream") {
      const contentDisp = response.headers.get("Content-Disposition");
      const fileName = contentDisp?.split("filename=")[1] || "receipt.pdf";
      const ctx = response.blob();
      return ctx.then((payload) => {
        saveAs(payload, fileName);
        return { success: true };
      });
    }

    const payload = await response.json();

    // Legacy parity: unwrap data if status is success
    if (payload && payload.status === "success") {
      // If it's a paginated response (has meta or total), return the whole payload
      if (payload.meta !== undefined || payload.total !== undefined) {
        return payload;
      }
      // Otherwise return just the data
      if (payload.data !== undefined) {
        return payload.data;
      }
    }

    return payload;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;
  const method = typeof args === "object" ? args.method : "GET";
  const body = typeof args === "object" ? args.body : undefined;
  const params = typeof args === "object" ? args.params : undefined;

  // Log request
  logger.apiRequest(url, method, params, body);

  const result = await rawBaseQuery(args, api, extraOptions);

  // Log response
  logger.apiResponse(result);

  // Handle authentication errors (401/403)
  if (result.error) {
    const error = result.error as ApiError;
    if (isAuthError(error)) {
      logger.warn("Authentication error detected, signing out user");
      // Dispatch signout action to clear auth state
      api.dispatch(logout());
    }
  }

  // Handle network errors
  if (
    result.error &&
    "status" in result.error &&
    result.error.status === "FETCH_ERROR"
  ) {
    logger.error("Network error occurred", result.error);
  }

  return result;
};
