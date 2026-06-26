import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser } from "./types";

interface AuthSession {
  access_token: string;
  user: AuthUser;
}

interface AuthState {
  authenticated: boolean;
  session: AuthSession | null;
}

const initialState: AuthState = {
  authenticated: false,
  session: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.session = action.payload;
      state.authenticated = true;
    },
    logout: (state) => {
      state.session = null;
      state.authenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
