import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState { items: Record<string, number> } // productId -> qty
const initialState: CartState = { items: {} };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      state.items[id] = (state.items[id] ?? 0) + qty;
    },
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      if (qty <= 0) delete state.items[id];
      else state.items[id] = qty;
    },
    removeItem(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    clearCart(state) {
      state.items = {};
    },
  },
});

export const { addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
