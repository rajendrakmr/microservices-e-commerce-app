import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product { id: string; name: string; price: number }
export interface Stock { productId: string; stock: number }
export interface Order { id: string; productId: string; qty: number; status: string }

// RTK Query: caching, loading/error state and refetching come for free.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Stock', 'Order'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({ query: () => '/products' }),
    getStock: build.query<Stock, string>({
      query: (id) => `/stock/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Stock', id }],
    }),
    getOrders: build.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    createOrder: build.mutation<Order, { productId: string; qty: number }>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      // After an order, refetch the order list and that product's stock.
      invalidatesTags: (_r, _e, arg) => ['Order', { type: 'Stock', id: arg.productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetStockQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = api;
