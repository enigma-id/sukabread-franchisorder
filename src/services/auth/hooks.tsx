/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useSigninMutation, useSeamlessMutation } from "./api";
import { logout, setCredentials } from "./slice";
import { useFormActions } from "../form/hooks";
import type { RootState } from "../store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { authenticated, session } = useSelector(
    (state: RootState) => state.auth,
  );
  const { failureWithTimeout } = useFormActions();

  const [signinMutation, signinResult] = useSigninMutation();
  const [seamlessMutation, seamlessResult] = useSeamlessMutation();

  const doSignin = async (credentials: any) => {
    try {
      const res = await signinMutation(credentials).unwrap();
      if (res?.message === "success") {
        dispatch(setCredentials(res.data));
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const doSeamless = async (data: any) => {
    try {
      const res = await seamlessMutation(data).unwrap();
      if (res?.message === "success") {
        dispatch(setCredentials(res.data));
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const doLogout = () => {
    dispatch(logout());
  };

  return {
    session,
    authenticated,
    doSignin,
    signinResult,
    doSeamless,
    seamlessResult,
    doLogout,
  };
};
