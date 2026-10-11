import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// node:sqlite ships with Node >= 22.13 (no extra install needed)
let DatabaseSync: typeof import('node:sqlite').DatabaseSync;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch {
  console.error('This server needs Node.js 22.13 or newer (built-in node:sqlite). Run "node -v" to check.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const IS_PROD = process.env.NODE_ENV === 'production';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const COOKIE_NAME = 'moori_session';

/* -------------------------------------------------------------------------- */
/*  Database                                                                   */
/* -------------------------------------------------------------------------- */
const dataDir = path.join(__dirname, 'data-store');
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'moori.db'));

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  -- Customer accounts
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    number        TEXT,
    password_hash TEXT,              -- NULL for accounts created through SSO
    sso_provider  TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ADMIN accounts (separate table/"database" from customers)
  CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    number        TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    role       TEXT NOT NULL CHECK (role IN ('user', 'admin')),
    account_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

/* -------------------------------------------------------------------------- */
/*  Password encryption (scrypt: salted, slow, one-way hash)                   */
/* -------------------------------------------------------------------------- */
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function verifyPassword(password: string, stored: string | null): boolean {
  if (!stored) return false;
  const [scheme, N, r, p, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'scrypt') return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return crypto.timingSafeEqual(actual, expected);
}

/* -------------------------------------------------------------------------- */
/*  Seed: the ONE admin                                                        */
/* -------------------------------------------------------------------------- */
const ADMIN_SEED = { name: 'buzz', email: 'buzz@email.com', number: '123 456 7890', password: 'buzzbee' };

function seedAdmin() {
  // Enforce "only admin": remove any other rows, keep/create the seeded one.
  db.prepare('DELETE FROM admins WHERE email != ?').run(ADMIN_SEED.email);
  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(ADMIN_SEED.email);
  if (!existing) {
    db.prepare('INSERT INTO admins (name, email, number, password_hash) VALUES (?, ?, ?, ?)').run(
      ADMIN_SEED.name,
      ADMIN_SEED.email,
      ADMIN_SEED.number,
      hashPassword(ADMIN_SEED.password),
    );
  }
}
seedAdmin();

/* -------------------------------------------------------------------------- */
/*  Sessions                                                                   */
/* -------------------------------------------------------------------------- */
type Role = 'user' | 'admin';
interface SessionUser { id: number; name: string; email: string; number: string; role: Role }

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

function createSession(res: Response, role: Role, accountId: number) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash, role, account_id, expires_at) VALUES (?, ?, ?, ?)').run(
    sha256(token),
    role,
    accountId,
    Date.now() + SESSION_TTL_MS,
  );
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD,
    maxAge: SESSION_TTL_MS,
    path: '/',
  });
}

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function getSessionUser(req: Request): SessionUser | null {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  const row = db
    .prepare('SELECT role, account_id, expires_at FROM sessions WHERE token_hash = ?')
    .get(sha256(token)) as { role: Role; account_id: number; expires_at: number } | undefined;
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
    return null;
  }
  const table = row.role === 'admin' ? 'admins' : 'users';
  const acct = db.prepare(`SELECT id, name, email, number FROM ${table} WHERE id = ?`).get(row.account_id) as
    | { id: number; name: string; email: string; number: string | null }
    | undefined;
  if (!acct) return null;
  return { id: acct.id, name: acct.name, email: acct.email, number: acct.number ?? '', role: row.role };
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normEmail = (e: unknown) => String(e ?? '').trim().toLowerCase();
const str = (v: unknown) => String(v ?? '').trim();

// Very small in-memory throttle against password guessing
const attempts = new Map<string, { count: number; resetAt: number }>();
function throttled(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

/* -------------------------------------------------------------------------- */
/*  API                                                                        */
/* -------------------------------------------------------------------------- */
const app = express();
app.use(express.json({ limit: '50kb' }));

app.get('/api/auth/config', (_req, res) => {
  res.json({ googleClientId: GOOGLE_CLIENT_ID || null });
});

app.get('/api/auth/me', (req, res) => {
  const user = getSessionUser(req);
  res.json({ user });
});

app.post('/api/auth/register', (req, res) => {
  const name = str(req.body?.name);
  const email = normEmail(req.body?.email);
  const number = str(req.body?.number);
  const password = String(req.body?.password ?? '');

  if (!name || !email || !number || !password) return res.status(400).json({ error: 'All fields are required.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (!/^[+\d][\d\s()-]{5,19}$/.test(number)) return res.status(400).json({ error: 'Please enter a valid phone number.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const isAdminEmail = db.prepare('SELECT 1 FROM admins WHERE email = ?').get(email);
  const taken = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
  if (isAdminEmail || taken) return res.status(409).json({ error: 'An account with this email already exists.' });

  const info = db
    .prepare('INSERT INTO users (name, email, number, password_hash) VALUES (?, ?, ?, ?)')
    .run(name, email, number, hashPassword(password));
  const id = Number(info.lastInsertRowid);
  createSession(res, 'user', id);
  res.status(201).json({ user: { id, name, email, number, role: 'user' } });
});

app.post('/api/auth/login', (req, res) => {
  const email = normEmail(req.body?.email);
  const password = String(req.body?.password ?? '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  if (throttled(`${req.ip}|${email}`)) {
    return res.status(429).json({ error: 'Too many attempts. Please try again in 15 minutes.' });
  }

  const invalid = () => res.status(401).json({ error: 'Incorrect email or password.' });

  // 1) Admin database
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as any;
  if (admin) {
    if (!verifyPassword(password, admin.password_hash)) return invalid();
    createSession(res, 'admin', admin.id);
    return res.json({ user: { id: admin.id, name: admin.name, email: admin.email, number: admin.number, role: 'admin' } });
  }

  // 2) Customer database
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !verifyPassword(password, user.password_hash)) return invalid();
  createSession(res, 'user', user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, number: user.number ?? '', role: 'user' } });
});

// Single sign-on with Google. The browser sends us a Google ID token ("credential");
// we verify it with Google and then sign the person in (creating a customer account if new).
app.post('/api/auth/google', async (req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.status(501).json({ error: 'Google SSO is not configured on this server.' });
  const credential = str(req.body?.credential);
  if (!credential) return res.status(400).json({ error: 'Missing credential.' });

  try {
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!r.ok) return res.status(401).json({ error: 'Google sign-in could not be verified.' });
    const info = (await r.json()) as {
      aud: string; email?: string; email_verified?: string | boolean; name?: string; exp?: string;
    };
    const verified = info.email_verified === true || info.email_verified === 'true';
    if (info.aud !== GOOGLE_CLIENT_ID || !info.email || !verified) {
      return res.status(401).json({ error: 'Google sign-in could not be verified.' });
    }
    const email = normEmail(info.email);

    // SSO can never be used to become an admin
    if (db.prepare('SELECT 1 FROM admins WHERE email = ?').get(email)) {
      return res.status(403).json({ error: 'This account must sign in with email and password.' });
    }

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      const info2 = db
        .prepare('INSERT INTO users (name, email, number, password_hash, sso_provider) VALUES (?, ?, ?, NULL, ?)')
        .run(info.name || email.split('@')[0], email, '', 'google');
      user = { id: Number(info2.lastInsertRowid), name: info.name || email.split('@')[0], email, number: '' };
    }
    createSession(res, 'user', user.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email, number: user.number ?? '', role: 'user' } });
  } catch {
    res.status(502).json({ error: 'Could not reach Google to verify sign-in.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const token = readCookie(req, COOKIE_NAME);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

/* -------------------------------------------------------------------------- */
/*  Frontend (Vite in dev, static build in production)                         */
/* -------------------------------------------------------------------------- */
if (!IS_PROD) {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const dist = path.join(__dirname, 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Moori Sushi running on http://localhost:${PORT}`);
  if (!GOOGLE_CLIENT_ID) console.log('Google SSO disabled: set GOOGLE_CLIENT_ID in .env to enable it.');
});
