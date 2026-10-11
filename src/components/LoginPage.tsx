import React, { useEffect, useRef, useState } from 'react';
import { authApi, AuthUser } from '../api/auth';

interface LoginPageProps {
  onAuthenticated: (user: AuthUser) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null | undefined>(undefined);
  const googleBtn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authApi.config().then((c) => setGoogleClientId(c.googleClientId)).catch(() => setGoogleClientId(null));
  }, []);

  // Load Google Identity Services and render the SSO button when configured
  useEffect(() => {
    if (!googleClientId) return;
    const init = () => {
      if (!window.google || !googleBtn.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (resp: { credential: string }) => {
          setError('');
          setBusy(true);
          try {
            const { user } = await authApi.google(resp.credential);
            onAuthenticated(user);
          } catch (e: any) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtn.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 320,
      });
    };
    if (window.google) return init();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = init;
    document.head.appendChild(s);
  }, [googleClientId, mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { user } =
        mode === 'login'
          ? await authApi.login(email, password)
          : await authApi.register({ name, email, number, password });
      onAuthenticated(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full border border-[#e7bcb9] bg-white px-4 py-3 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bc001f] placeholder:text-[#5f5e5e]/50';
  const label = 'font-mono-caps text-[11px] text-[#5f5e5e] block mb-1.5';

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4 font-body text-[#1a1c1c]">
      <div className="w-full max-w-md bg-white border border-[#e7bcb9] shadow-xl">
        <div className="bg-[#1a1c1c] text-white px-8 py-7">
          <h1 className="font-display text-3xl font-extrabold text-[#bc001f] tracking-tight">Moori Sushi</h1>
          <p className="font-mono-caps text-xs text-white/70 mt-1">
            {mode === 'login' ? 'SIGN IN TO CONTINUE' : 'CREATE YOUR ACCOUNT'}
          </p>
        </div>

        <div className="grid grid-cols-2 border-b border-[#e7bcb9]">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError('');
              }}
              className={`font-mono-caps text-xs py-3 transition-colors ${
                mode === m ? 'text-[#bc001f] border-b-2 border-[#bc001f] font-semibold' : 'text-[#5f5e5e] hover:text-[#bc001f]'
              }`}
            >
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="p-8 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className={label}>FULL NAME</label>
                <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </div>
              <div>
                <label className={label}>PHONE NUMBER</label>
                <input className={input} value={number} onChange={(e) => setNumber(e.target.value)} autoComplete="tel" placeholder="123 456 7890" required />
              </div>
            </>
          )}
          <div>
            <label className={label}>EMAIL</label>
            <input type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label className={label}>PASSWORD</label>
            <input
              type="password"
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : undefined}
              required
            />
            {mode === 'register' && <p className="text-[11px] text-[#5f5e5e] mt-1">At least 8 characters.</p>}
          </div>

          {error && (
            <p role="alert" className="text-xs text-[#bc001f] bg-[#bc001f]/5 border border-[#bc001f]/30 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#bc001f] text-white font-mono-caps text-xs py-3.5 hover:bg-[#e6192e] disabled:opacity-60 transition-colors"
          >
            {busy ? 'PLEASE WAIT…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>

          <div className="flex items-center gap-3 py-1">
            <span className="flex-1 h-px bg-[#e7bcb9]" />
            <span className="font-mono-caps text-[10px] text-[#5f5e5e]">OR</span>
            <span className="flex-1 h-px bg-[#e7bcb9]" />
          </div>

          {googleClientId ? (
            <div className="flex justify-center">
              <div ref={googleBtn} />
            </div>
          ) : (
            <button
              type="button"
              disabled
              title="Set GOOGLE_CLIENT_ID in .env to enable Google single sign-on"
              className="w-full border border-[#e7bcb9] text-[#5f5e5e] font-mono-caps text-xs py-3 opacity-60 cursor-not-allowed"
            >
              {googleClientId === undefined ? 'LOADING…' : 'CONTINUE WITH GOOGLE (NOT CONFIGURED)'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
