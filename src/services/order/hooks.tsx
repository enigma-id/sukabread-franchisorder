import { useEnigmaUI } from "@/components";
import {
  useGetOrdersQuery,
  useShowOrderQuery,
  useCancelOrderMutation,
  useGetOrderPaymentMethodQuery,
} from "./api";
import { useFormActions } from "../form/hooks";

export const useOrder = (params?: any) => {
  const query = useGetOrdersQuery(params);

  return {
    query,
  };
};

export const useOrderDetail = (id: string) => {
  const { showToast } = useEnigmaUI();
  const query = useShowOrderQuery(id);
  const paymentMethodQuery = useGetOrderPaymentMethodQuery(id);
  const [cancelOrderMutation, cancelOrderResult] = useCancelOrderMutation();
  const { failureWithTimeout } = useFormActions();

  const doCancelOrder = async (void_note: string) => {
    try {
      const result = await cancelOrderMutation({ id, void_note }).unwrap();
      showToast({
        message: "Order cancelled successfully",
        type: "success",
      });
      return result;
    } catch (err: any) {
      failureWithTimeout(err);
    }
  };

  return {
    query,
    paymentMethodQuery,
    doCancelOrder,
    cancelOrderResult,
  };
};
