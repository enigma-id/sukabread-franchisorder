import { useEnigmaUI } from "@/components";
import { useFormActions } from "../form/hooks";
import {
  useGetRetursQuery,
  useCreateReturMutation,
  useShowReturQuery,
  useDeleteReturMutation,
} from "./api";
import type { CreateReturPayload } from "./api";

export const useRetur = ({ id, params }: { id?: string; params?: Record<string, unknown> } = {}) => {
  const { showToast } = useEnigmaUI();
  const { failureWithTimeout } = useFormActions();

  const listQuery = useGetRetursQuery(params);
  const detailQuery = useShowReturQuery(id!, { skip: !id });
  const [createReturMutation, createReturResult] = useCreateReturMutation();
  const [deleteReturMutation, deleteReturResult] = useDeleteReturMutation();

  const doCreateRetur = async (payload: CreateReturPayload) => {
    try {
      const result = await createReturMutation(payload).unwrap();
      showToast({
        message: "Return request created successfully",
        type: "success",
      });
      return result;
    } catch (err: unknown) {
      failureWithTimeout(err);
    }
  };

  const doDeleteRetur = async (deleteId: string) => {
    try {
      await deleteReturMutation(deleteId).unwrap();
      showToast({
        message: "Return request cancelled successfully",
        type: "success",
      });
    } catch (err: unknown) {
      failureWithTimeout(err);
    }
  };

  return {
    listQuery,
    detailQuery,
    doCreateRetur,
    createReturResult,
    doDeleteRetur,
    deleteReturResult,
  };
};
