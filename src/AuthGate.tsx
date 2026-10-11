import React, { useEffect, useState } from 'react';
import App from './App';
import { LoginPage } from './components/LoginPage';
import { authApi, AuthUser } from './api/auth';

// Shows the login page first; the app only renders once someone is signed in.
export default function AuthGate() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  if (checking) return <div className="min-h-screen bg-[#f9f9f9]" />;
  if (!user) return <LoginPage onAuthenticated={setUser} />;
  // key => a fresh app state (cart, orders) for every login
  return <App key={`${user.role}-${user.id}`} user={user} onLogout={logout} />;
}
