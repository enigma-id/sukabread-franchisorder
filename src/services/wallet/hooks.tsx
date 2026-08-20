/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEnigmaUI } from "@/components";
import {
  useGetBalanceLogsQuery,
  useGetTopupRequestsQuery,
  useCreateTopupRequestMutation,
  useDeleteTopupRequestMutation,
  useGetWithdrawalRequestsQuery,
  useCreateWithdrawalRequestMutation,
  useDeleteWithdrawalRequestMutation,
} from "./api";
import { useFormActions } from "../form/hooks";

export const useBalanceLogs = (limit = 20) => {
  const query = useGetBalanceLogsQuery({ limit });
  return {
    balanceLogs: query.data?.data ?? [],
    query,
  };
};

export const useTopupRequests = () => {
  const query = useGetTopupRequestsQuery({ limit: 25 });
  return {
    requests: query.data?.data ?? [],
    query,
  };
};

export const useWithdrawalRequests = () => {
  const query = useGetWithdrawalRequestsQuery({ limit: 25 });
  return {
    requests: query.data?.data ?? [],
    query,
  };
};

export const useWalletActions = () => {
  const { showToast } = useEnigmaUI();
  const { failureWithTimeout } = useFormActions();

  const [createTopupRequest, createTopupResult] =
    useCreateTopupRequestMutation();
  const [deleteTopupRequest, deleteTopupResult] =
    useDeleteTopupRequestMutation();
  const [createWithdrawalRequest, createWithdrawalResult] =
    useCreateWithdrawalRequestMutation();
  const [deleteWithdrawalRequest, deleteWithdrawalResult] =
    useDeleteWithdrawalRequestMutation();

  const submitTopup = async (payload: {
    amount: number;
    note: string;
    payment_method_id: string;
  }) => {
    try {
      await createTopupRequest(payload).unwrap();
      showToast({
        message: "Topup request submitted",
        type: "success",
        position: "top-center",
      });
      return true;
    } catch (err: any) {
      failureWithTimeout(err);
      return false;
    }
  };

  const cancelTopup = async (id: string) => {
    try {
      await deleteTopupRequest(id).unwrap();
      showToast({
        message: "Request cancelled",
        type: "success",
        position: "top-center",
      });
      return true;
    } catch (err: any) {
      failureWithTimeout(err);
      return false;
    }
  };

  const submitWithdrawal = async (payload: {
    amount: number;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    notes: string;
  }) => {
    try {
      await createWithdrawalRequest(payload).unwrap();
      showToast({
        message: "Withdrawal request submitted",
        type: "success",
        position: "top-center",
      });
      return true;
    } catch (err: any) {
      failureWithTimeout(err);
      return false;
    }
  };

  const cancelWithdrawal = async (id: string) => {
    try {
      await deleteWithdrawalRequest(id).unwrap();
      showToast({ message: "Request cancelled", type: "success" });
      return true;
    } catch (err: any) {
      failureWithTimeout(err);
      return false;
    }
  };

  return {
    submitTopup,
    createTopupResult,
    cancelTopup,
    deleteTopupResult,
    submitWithdrawal,
    createWithdrawalResult,
    cancelWithdrawal,
    deleteWithdrawalResult,
  };
};
