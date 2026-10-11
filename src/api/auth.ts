export interface AuthUser {
  id: number;
  name: string;
  email: string;
  number: string;
  role: 'user' | 'admin';
}

async function request<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
  return data as T;
}

export const authApi = {
  config: () => request<{ googleClientId: string | null }>('/api/auth/config'),
  me: () => request<{ user: AuthUser | null }>('/api/auth/me'),
  login: (email: string, password: string) => request<{ user: AuthUser }>('/api/auth/login', { email, password }),
  register: (d: { name: string; email: string; number: string; password: string }) =>
    request<{ user: AuthUser }>('/api/auth/register', d),
  google: (credential: string) => request<{ user: AuthUser }>('/api/auth/google', { credential }),
  logout: () => request<{ ok: true }>('/api/auth/logout', {}),
};
