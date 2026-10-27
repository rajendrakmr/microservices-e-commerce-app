'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const ref = useRef<AppStore>();
  if (!ref.current) ref.current = makeStore();
  return <Provider store={ref.current}>{children}</Provider>;
}
