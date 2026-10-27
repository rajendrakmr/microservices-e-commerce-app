'use client';
import { useState } from 'react';
import { Product, useGetStockQuery } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addItem } from '@/lib/cartSlice';

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { data: stock, isFetching } = useGetStockQuery(product.id);
  const inCart = useAppSelector((s) => s.cart.items[product.id] ?? 0);
  const [qty, setQty] = useState(1);

  const available = (stock?.stock ?? 0) - inCart;
  const soldOut = stock !== undefined && available <= 0;

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <div className="price">${product.price.toFixed(2)}</div>
      <div className="muted">
        {stock === undefined ? (isFetching ? 'checking stock…' : 'stock unknown') : `${stock.stock} in stock`}
      </div>
      <div className="row">
        <input
          type="number" min={1} max={Math.max(available, 1)} value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          aria-label={`Quantity for ${product.name}`}
        />
        <button
          disabled={soldOut || qty > available}
          onClick={() => { dispatch(addItem({ id: product.id, qty })); setQty(1); }}
        >
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
