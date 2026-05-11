import type { User, Outlet, Franchise } from "../types/api";

export interface SigninRequest {
  username: string;
  password?: string;
}

export interface SigninResponse {
  token: string;
  user: User;
  outlet: Outlet;
  franchise: Franchise;
}

export interface SeamlessRequest {
  username: string;
  token: string;
}
