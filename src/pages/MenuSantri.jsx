import { useState, useEffect } from 'react';
import { UtensilsCrossed, Beef, Leaf, CupSoda, Apple, Clock, Moon } from 'lucide-react';
import { getMenu, getSesiAktif, SESI_CONFIG, laukToArray } from '../lib/menuStore';

const FIELDS = [
  { key: 'menuUtama', label: 'Menu Utama', icon: UtensilsCrossed, color: 'blue'    },
  { key: 'lauk',      label: 'Lauk Pauk',  icon: Beef,           color: 'amber'   },
  { key: 'sayur',     label: 'Sayur',       icon: Leaf,           color: 'emerald' },
  { key: 'minuman',   label: 'Minuman',     icon: CupSoda,        color: 'sky'     },
  { key: 'buah',      label: 'Buah',        icon: Apple,          color: 'rose'    },
];

const COLOR_MAP = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    ring: 'ring-blue-100',    dot: 'bg-blue-400'    },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   ring: 'ring-amber-100',   dot: 'bg-amber-400'   },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100', dot: 'bg-emerald-400' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-600',     ring: 'ring-sky-100',     dot: 'bg-sky-400'     },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    ring: 'ring-rose-100',    dot: 'bg-rose-400'    },
};

export default function MenuSantri() {
  const [now] = useState(new Date());
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const sesi = getSesiAktif();
  const cfg = sesi !== 'tutup' ? SESI_CONFIG[sesi] : null;
  const h = now.getHours();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    if (sesi === 'tutup') { setLoading(false); return; }
    setLoading(true);
    getMenu(new Date(), sesi)
      .then(setMenu)
      .finally(() => setLoading(false));
  }, [sesi]);

  const menuIsEmpty = !menu || (!menu.menuUtama && !menu.lauk && !menu.sayur && !menu.minuman && !menu.buah);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Menu Hari Ini</h1>
        <p className="text-sm text-slate-500 mt-0.5">{formattedDate}</p>
      </div>

      {/* Di luar jam makan */}
      {sesi === 'tutup' && (
        <div className="flex items-center gap-3 bg-slate-800 text-white rounded-2xl px-5 py-4">
          <Moon className="w-5 h-5 text-slate-300 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {h >= 18 ? 'Makanan tersedia lagi besok' : h < 8 ? 'Belum waktunya makan' : 'Di luar jam makan'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Pagi 08.00–11.00 · Siang 12.00–15.00 · Sore 16.00–18.00</p>
          </div>
        </div>
      )}

      {/* Header sesi aktif */}
      {cfg && (
        <div className="bg-blue-600 rounded-2xl px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">{cfg.label}</h2>
            <span className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
              AKTIF
            </span>
          </div>
          <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {cfg.jam}
          </p>
        </div>
      )}

      {/* Loading */}
      {sesi !== 'tutup' && loading && (
        <div className="text-center py-10 text-slate-400 text-sm">Memuat menu...</div>
      )}

      {/* Menu */}
      {sesi !== 'tutup' && !loading && (
        menuIsEmpty ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UtensilsCrossed className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">Menu belum tersedia</p>
            <p className="text-xs text-slate-300 mt-1">Admin belum mengisi menu untuk sesi ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.map(({ key, label, icon: Icon, color }) => {
              const fc = COLOR_MAP[color];
              const val = menu[key] || '';
              if (!val) return null;
              const items = key === 'lauk' ? laukToArray(val) : [val];
              return (
                <div key={key} className="bg-white rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${fc.bg} rounded-lg flex items-center justify-center ring-1 ${fc.ring}`}>
                      <Icon className={`w-4 h-4 ${fc.icon}`} />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{label}</p>
                  </div>
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${fc.dot}`} />
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
