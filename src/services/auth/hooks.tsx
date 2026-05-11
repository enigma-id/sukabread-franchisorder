import { useDispatch, useSelector } from "react-redux";
import { useEnigmaUI } from "@/components";
import {
  useSigninMutation,
  useSeamlessMutation,
  useLazyGetMeQuery,
  useUpdateMeMutation,
} from "./api";
import { $signout } from "./slice";
import { useFormActions } from "../form/hooks";
import type { RootState } from "../store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, outlet, franchise, authenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { showToast } = useEnigmaUI();
  const { failureWithTimeout } = useFormActions();

  const [signinMutation, signinResult] = useSigninMutation();
  const [seamlessMutation, seamlessResult] = useSeamlessMutation();
  const [updateMeMutation, updateMeResult] = useUpdateMeMutation();
  const [triggerGetMe, getMeResult] = useLazyGetMeQuery();

  const doSignin = async (credentials: any) => {
    try {
      const result = await signinMutation(credentials).unwrap();
      showToast({
        message: "Logged in successfully!",
        type: "success",
      });
      return result;
    } catch (err: any) {
      failureWithTimeout(err);
    }
  };

  const doSeamless = async (data: any) => {
    try {
      return await seamlessMutation(data).unwrap();
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const doGetMe = async () => {
    try {
      return await triggerGetMe().unwrap();
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const doUpdateMe = async (data: any) => {
    try {
      const result = await updateMeMutation(data).unwrap();
      showToast({
        message: "Profile updated successfully!",
        type: "success",
      });
      return result;
    } catch (err: any) {
      failureWithTimeout(err);
    }
  };

  const doLogout = () => {
    dispatch($signout());
    showToast({
      message: "Logged out",
      type: "info",
    });
  };

  return {
    user,
    outlet,
    franchise,
    authenticated,
    doSignin,
    signinResult,
    doSeamless,
    seamlessResult,
    doGetMe,
    getMeResult,
    doUpdateMe,
    updateMeResult,
    doLogout,
  };
};
