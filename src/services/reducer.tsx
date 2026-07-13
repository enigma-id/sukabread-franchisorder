import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer, UnknownAction } from "redux";

import { authApi } from "./auth/api";
import { catalogApi } from "./catalog/api";
import { orderApi } from "./order/api";
import { cartApi } from "./cart/api";
import { profileApi } from "./profile/api";
import { returApi } from "./retur/api";
import cartReducer from "./cart/slice";
import { formReducer } from "./form/slice";
import { authReducer, logout } from "./auth/slice";

const appReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  cart: cartReducer,

  [authApi.reducerPath]: authApi.reducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [returApi.reducerPath]: returApi.reducer,
});

export type AppState = ReturnType<typeof appReducer>;

export const apiMiddlewares = [
  authApi.middleware,
  catalogApi.middleware,
  orderApi.middleware,
  cartApi.middleware,
  profileApi.middleware,
  returApi.middleware,
];

export const rootReducer: Reducer<AppState, UnknownAction> = (
  state,
  action,
) => {
  if (action.type === logout.type) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:root");
    }
    state = undefined;
  }
  return appReducer(state, action);
};
