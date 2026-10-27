import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState { message: string | null; kind: 'ok' | 'err' }
const initialState: ToastState = { message: null, kind: 'ok' };

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(_state, action: PayloadAction<{ message: string; kind: 'ok' | 'err' }>) {
      return action.payload;
    },
    hideToast() {
      return initialState;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
