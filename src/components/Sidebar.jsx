import { LayoutDashboard, ScanLine, ClipboardList, UtensilsCrossed, CreditCard, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/scan', label: 'Scan Kartu', icon: ScanLine },
  { path: '/absensi', label: 'Data Absensi', icon: ClipboardList },
  { path: '/menu', label: 'Menu Hari Ini', icon: UtensilsCrossed },
  { path: '/kartu', label: 'Kartu Santri', icon: CreditCard },
];

export default function Sidebar({ isOpen, onClose }) {
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
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
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

        <nav className="px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-primary-800">Pondok Pesantren</p>
            <p className="text-[10px] text-primary-600 mt-1">Sistem Absensi Makan Santri v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
