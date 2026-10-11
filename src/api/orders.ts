import { Order, OrderStatus } from '../types';

async function call<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
  return data as T;
}

export const ordersApi = {
  list: () => call<{ orders: Order[] }>('/api/orders', 'GET').then((r) => r.orders),
  create: (order: Order & { discount: number }) => call<{ order: Order }>('/api/orders', 'POST', order).then((r) => r.order),
  setStatus: (id: string, status: OrderStatus) => call<{ ok: true }>(`/api/orders/${encodeURIComponent(id)}/status`, 'PATCH', { status }),
};
