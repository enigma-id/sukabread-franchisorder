import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, Outlet, Franchise } from "../types/api";
import { authApi } from "./api";

interface AuthState {
  token: string | null;
  user: User | null;
  outlet: Outlet | null;
  franchise: Franchise | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  outlet: null,
  franchise: null,
  authenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    $signout: (state) => {
      state.token = null;
      state.user = null;
      state.outlet = null;
      state.franchise = null;
      state.authenticated = false;
    },
    $seamless: (
      state,
      action: PayloadAction<{ username: string; token: string }>,
    ) => {
      state.token = action.payload.token;
      state.user = {
        username: action.payload.username,
      } as User;
      state.authenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.signin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        state.outlet = payload.outlet;
        state.franchise = payload.franchise;
        state.authenticated = true;
      },
    );
    builder.addMatcher(
      authApi.endpoints.seamless.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        state.outlet = payload.outlet;
        state.franchise = payload.franchise;
        state.authenticated = true;
      },
    );
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.authenticated = true;
      },
    );
  },
});

export const { $signout, $seamless } = authSlice.actions;
export default authSlice.reducer;
