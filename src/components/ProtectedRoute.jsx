import { Navigate } from 'react-router-dom';
import { getSession } from '../lib/authStore';

/** Hanya bisa diakses kalau sudah login */
export function RequireAuth({ children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

/** Hanya bisa diakses oleh admin */
export function RequireAdmin({ children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== 'admin') return <Navigate to="/kartu-saya" replace />;
  return children;
}

/** Hanya bisa diakses oleh santri */
export function RequireSantri({ children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== 'santri') return <Navigate to="/" replace />;
  return children;
}
