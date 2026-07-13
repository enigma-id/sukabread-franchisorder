import { useEnigmaUI } from "@/components";
import {
  useGetOrdersQuery,
  useShowOrderQuery,
  useCancelOrderMutation,
} from "./api";
import { useFormActions } from "../form/hooks";

export const useOrder = ({ id, params }: { id?: string; params?: Record<string, unknown> } = {}) => {
  const { showToast } = useEnigmaUI();
  const { failureWithTimeout } = useFormActions();

  const listQuery = useGetOrdersQuery(params);
  const detailQuery = useShowOrderQuery(id as string, { skip: !id });
  const [cancelOrderMutation, cancelOrderResult] = useCancelOrderMutation();

  const doCancelOrder = async (note: string) => {
    if (!id) return;
    try {
      const result = await cancelOrderMutation({ id, note }).unwrap();
      showToast({
        message: "Order cancelled successfully",
        type: "success",
      });
      return result;
    } catch (err: unknown) {
      failureWithTimeout(err);
    }
  };

  return {
    listQuery,
    detailQuery,
    doCancelOrder,
    cancelOrderResult,
  };
};
