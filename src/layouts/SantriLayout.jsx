import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { QrCode, UtensilsCrossed, LogOut } from 'lucide-react';
import { getSession, clearSession } from '../lib/authStore';

export default function SantriLayout() {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">Absensi Makan</p>
              <p className="text-[10px] text-slate-400">Halo, {session?.nama}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </header>

      {/* Nav tab */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 flex">
          <NavLink
            to="/kartu-saya"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors
              ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`
            }
          >
            <QrCode className="w-4 h-4" />
            Kartu Saya
          </NavLink>
          <NavLink
            to="/menu-santri"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors
              ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`
            }
          >
            <UtensilsCrossed className="w-4 h-4" />
            Menu Hari Ini
          </NavLink>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
