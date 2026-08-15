/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useEnigmaUI } from "@/components";
import {
  useCheckoutMutation,
  useGetPaymentMethodsQuery,
  useLazyGetPaymentMethodsQuery,
  useGetWarehouseQuery,
  useLazyGetWarehouseQuery,
} from "./api";
import { $clearCart, $addItem, $removeItem, $updateQuantity } from "./slice";
import type { RootState } from "../store";
import { useFormActions } from "../form/hooks";

export const useCart = () => {
  const dispatch = useDispatch();
  const { showToast } = useEnigmaUI();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const [checkoutMutation, checkoutResult] = useCheckoutMutation();
  const [triggerPayment, paymentResult] = useLazyGetPaymentMethodsQuery();
  const [triggerWarehouse, warehouseResult] = useLazyGetWarehouseQuery();
  const { failureWithTimeout } = useFormActions();

  // Use query hook directly for payment methods as it's typically auto-fetched
  const paymentMethodsQuery = useGetPaymentMethodsQuery({});
  const warehouseQuery = useGetWarehouseQuery({});

  const addItem = (product: any, quantity: number) => {
    dispatch($addItem({ ...product, quantity }));
  };

  const removeItem = (id: string) => {
    dispatch($removeItem(id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch($updateQuantity({ id, quantity }));
  };

  const clearCart = () => {
    dispatch($clearCart());
  };

  const doCheckout = async (payload: any) => {
    try {
      const cartItems = items.map((i) => ({
        catalog_id: i.id,
        quantity_ordered: i.quantity,
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

  const getWarehouse = async (params: any) => {
    try {
      await triggerWarehouse(params).unwrap();
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const getPayment = async (params: any) => {
    try {
      await triggerPayment(params).unwrap();
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  return {
    // Actions
    doCheckout,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getWarehouse,
    getPayment,

    // Results/States
    checkoutResult,
    paymentResult,
    warehouseResult,
    paymentMethodsQuery,
    warehouseQuery,

    // State
    items,
    total,
  };
};
