'use client';
import { useCreateOrderMutation, useGetProductsQuery } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearCart, removeItem } from '@/lib/cartSlice';
import { showToast } from '@/lib/toastSlice';

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const { data: products } = useGetProductsQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const lines = Object.entries(items)
    .map(([id, qty]) => ({ id, qty, product: products?.find((p) => p.id === id) }))
    .filter((l) => l.product);
  const total = lines.reduce((sum, l) => sum + l.qty * l.product!.price, 0);

  async function checkout() {
    let placed = 0;
    const failures: string[] = [];
    for (const l of lines) {
      try {
        await createOrder({ productId: l.id, qty: l.qty }).unwrap();
        dispatch(removeItem(l.id));
        placed++;
      } catch (e: any) {
        failures.push(`${l.product!.name}: ${e?.data?.error ?? 'failed'}`);
      }
    }
    dispatch(showToast(failures.length
      ? { message: failures.join('; '), kind: 'err' }
      : { message: `Placed ${placed} order${placed === 1 ? '' : 's'}`, kind: 'ok' }));
  }

  return (
    <div className="card">
      <h2 style={{ margin: 0 }}>Cart</h2>
      {lines.length === 0 && <p className="muted">Your cart is empty.</p>}
      {lines.map((l) => (
        <div key={l.id} className="line">
          <span>{l.qty} × {l.product!.name}</span>
          <span>
            ${(l.qty * l.product!.price).toFixed(2)}{' '}
            <button className="link" onClick={() => dispatch(removeItem(l.id))}>remove</button>
          </span>
        </div>
      ))}
      {lines.length > 0 && (
        <>
          <div className="line total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button disabled={isLoading} onClick={checkout}>{isLoading ? 'Placing…' : 'Checkout'}</button>
          <button className="link" onClick={() => dispatch(clearCart())}>Clear cart</button>
        </>
      )}
    </div>
  );
}
