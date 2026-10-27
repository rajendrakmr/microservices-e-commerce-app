'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { hideToast } from '@/lib/toastSlice';

export default function Toast() {
  const dispatch = useAppDispatch();
  const { message, kind } = useAppSelector((s) => s.toast);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => dispatch(hideToast()), 3500);
    return () => clearTimeout(t);
  }, [message, dispatch]);

  if (!message) return null;
  return <div id="toast" className={kind} role="status">{message}</div>;
}
