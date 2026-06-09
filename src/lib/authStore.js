/**
 * Auth store — simpan session login di localStorage.
 * Session: { role: 'admin' | 'santri', nama, nik (kalau santri), id }
 */

const KEY = 'auth_session';

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return getSession() !== null;
}

export function isAdmin() {
  return getSession()?.role === 'admin';
}

export function isSantri() {
  return getSession()?.role === 'santri';
}

// Kredensial admin — hardcoded untuk project lomba
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};
