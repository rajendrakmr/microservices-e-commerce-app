'use client';
import { useGetOrdersQuery, useGetProductsQuery } from '@/lib/api';

export default function OrdersTable() {
  // Poll every 10s so orders from other users/tabs show up.
  const { data: orders = [], isError } = useGetOrdersQuery(undefined, { pollingInterval: 10000 });
  const { data: products = [] } = useGetProductsQuery();
  const name = (id: string) => products.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="wrap">
      <table>
        <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Status</th></tr></thead>
        <tbody>
          {orders.length === 0 && <tr><td colSpan={4}>{isError ? 'Could not load orders' : 'No orders yet'}</td></tr>}
          {[...orders].reverse().map((o) => (
            <tr key={o.id}>
              <td>{o.id.slice(0, 8)}</td><td>{name(o.productId)}</td><td>{o.qty}</td><td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
