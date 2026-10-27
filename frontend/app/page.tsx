'use client';
import { useGetProductsQuery } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import OrdersTable from '@/components/OrdersTable';
import Toast from '@/components/Toast';

export default function Home() {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();

  return (
    <>
      <header>
        <h1>DevShop</h1>
        <span className="muted">{isError ? 'backend unavailable' : isLoading ? 'connecting…' : 'connected'}</span>
      </header>
      <main>
        <div className="layout">
          <section>
            <h2>Products</h2>
            {isError && (
              <p className="muted">
                Could not load products. <button className="link" onClick={refetch}>Retry</button>
              </p>
            )}
            <div className="grid">
              {products?.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
          <aside><Cart /></aside>
        </div>
        <h2>Orders</h2>
        <OrdersTable />
      </main>
      <Toast />
    </>
  );
}
