import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import cart from './cartSlice';
import toast from './toastSlice';

// A factory (not a singleton) so each server render gets its own store.
export const makeStore = () => {
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer, cart, toast },
    middleware: (getDefault) => getDefault().concat(api.middleware),
  });
  setupListeners(store.dispatch); // refetch on window focus / reconnect
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
