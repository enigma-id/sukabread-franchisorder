import { useDispatch, useSelector } from "react-redux";
import { useEnigmaUI } from "@/components";
import {
  useCheckoutMutation,
  useGetPaymentMethodsQuery,
  useGetScheduleMutation,
} from "./api";
import { $clearCart, $addItem, $removeItem, $updateQuantity } from "./slice";
import type { RootState } from "../store";
import type { CatalogItem } from "../types/api";
import { useFormActions } from "../form/hooks";

export const useCart = () => {
  const dispatch = useDispatch();
  const { showToast } = useEnigmaUI();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const [checkoutMutation, checkoutResult] = useCheckoutMutation();
  const [getScheduleMutation, getScheduleResult] = useGetScheduleMutation();
  const { failureWithTimeout } = useFormActions();

  // Use query hook directly for payment methods as it's typically auto-fetched
  const paymentMethodsQuery = useGetPaymentMethodsQuery();

  const addItem = (product: CatalogItem, quantity: number) => {
    dispatch($addItem({ ...product, quantity }));
  };

  const removeItem = (id: number) => {
    dispatch($removeItem(id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch($updateQuantity({ id, quantity }));
  };

  const clearCart = () => {
    dispatch($clearCart());
  };

  const doCheckout = async (payload: {
    payment_method: {
      bank_id: string;
      phone?: string;
    };
    shipping_at: string;
  }) => {
    try {
      const cartItems = items.map((i) => ({
        catalog_id: i.catalog.id,
        quantity: i.quantity,
      }));

      const result = await checkoutMutation({
        items: cartItems,
        ...payload,
      }).unwrap();

      dispatch($clearCart());
      showToast({
        message: "Order placed successfully!",
        type: "success",
      });
      return result;
    } catch (err: any) {
      failureWithTimeout(err);
    }
  };

  const doFetchSchedule = async () => {
    try {
      const cartItems = items.map((i) => ({
        catalog_id: i.catalog.id,
        quantity: i.quantity,
      }));
      return await getScheduleMutation({ items: cartItems }).unwrap();
    } catch (err) {
      failureWithTimeout(err);
      // We don't toast here as it's often called automatically
    }
  };

  return {
    // Actions
    doCheckout,
    doFetchSchedule,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,

    // Results/States
    checkoutResult,
    getScheduleResult,
    paymentMethodsQuery,

    // State
    items,
    total,
  };
};
