import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ScanKartu from './pages/ScanKartu';
import DataAbsensi from './pages/DataAbsensi';
import MenuHariIni from './pages/MenuHariIni';
import KartuSantri from './pages/KartuSantri';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<ScanKartu />} />
          <Route path="absensi" element={<DataAbsensi />} />
          <Route path="menu" element={<MenuHariIni />} />
          <Route path="kartu" element={<KartuSantri />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
