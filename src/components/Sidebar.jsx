import { LayoutDashboard, ScanLine, ClipboardList, UtensilsCrossed, CreditCard, X, LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../lib/authStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/scan', label: 'Scan Kartu', icon: ScanLine },
  { path: '/absensi', label: 'Data Absensi', icon: ClipboardList },
  { path: '/menu', label: 'Menu Hari Ini', icon: UtensilsCrossed },
  { path: '/kartu', label: 'Kartu Santri', icon: CreditCard },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">Absensi Makan</h1>
              <p className="text-[10px] text-slate-400 font-medium">Santri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="mx-3 mt-3 px-3 py-2 bg-blue-50 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-700 truncate">{session?.nama ?? 'Admin'}</p>
            <p className="text-[10px] text-blue-400">Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              end={path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 space-y-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-800">Pondok Pesantren</p>
            <p className="text-[10px] text-blue-500 mt-0.5">Sistem Absensi Makan Santri v1.0</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
