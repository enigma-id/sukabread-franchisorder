import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CatalogItem } from "../types/api";

interface CartStateItem extends CatalogItem {
  quantity: number;
}

interface CartState {
  items: CartStateItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartStateItem[]) => {
  return items.reduce((sum, item) => sum + item.catalog.unit_price * item.quantity, 0);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    $addItem: (state, action: PayloadAction<CatalogItem & { quantity?: number }>) => {
      const qty = action.payload.quantity || 1;
      const existing = state.items.find((i) => i.catalog.id === action.payload.catalog.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({ ...action.payload, quantity: qty } as any);
      }
      state.total = calculateTotal(state.items);
    },
    $removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.catalog.id !== action.payload);
      state.total = calculateTotal(state.items);
    },
    $updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const item = state.items.find((i) => i.catalog.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.catalog.id !== action.payload.id);
        }
      }
      state.total = calculateTotal(state.items);
    },
    $clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { $addItem, $removeItem, $updateQuantity, $clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
