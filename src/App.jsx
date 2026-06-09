import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import SantriLayout from './layouts/SantriLayout';
import { RequireAdmin, RequireSantri } from './components/ProtectedRoute';
import { getSession } from './lib/authStore';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanKartu from './pages/ScanKartu';
import DataAbsensi from './pages/DataAbsensi';
import MenuHariIni from './pages/MenuHariIni';
import KartuSantri from './pages/KartuSantri';
import KartuSaya from './pages/KartuSaya';
import MenuSantri from './pages/MenuSantri';

function RootRedirect() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role === 'santri') return <Navigate to="/kartu-saya" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<RootRedirect />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/dashboard"
          element={<RequireAdmin><DashboardLayout /></RequireAdmin>}
        >
          <Route index element={<Dashboard />} />
        </Route>
        <Route
          path="/scan"
          element={<RequireAdmin><DashboardLayout /></RequireAdmin>}
        >
          <Route index element={<ScanKartu />} />
        </Route>
        <Route
          path="/absensi"
          element={<RequireAdmin><DashboardLayout /></RequireAdmin>}
        >
          <Route index element={<DataAbsensi />} />
        </Route>
        <Route
          path="/menu"
          element={<RequireAdmin><DashboardLayout /></RequireAdmin>}
        >
          <Route index element={<MenuHariIni />} />
        </Route>
        <Route
          path="/kartu"
          element={<RequireAdmin><DashboardLayout /></RequireAdmin>}
        >
          <Route index element={<KartuSantri />} />
        </Route>

        {/* Santri routes */}
        <Route
          path="/"
          element={<RequireSantri><SantriLayout /></RequireSantri>}
        >
          <Route path="kartu-saya" element={<KartuSaya />} />
          <Route path="menu-santri" element={<MenuSantri />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
