import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface ProfileUser {
  id: string;
  franchisor_id: string;
  usergroup_id: string;
  outlet_id: string;
  username: string;
  name: string;
  is_active: boolean;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
  outlet?: {
    id: string;
    name?: string;
    address?: string;
    city?: string;
    province?: string;
    saldo?: number;
  };
  region?: Record<string, unknown>;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileUser;
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileUser, void>({
      query: () => "/profile/me",
      transformResponse: (res: ProfileResponse) => res.data,
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;
