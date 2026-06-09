import { useState, useEffect } from 'react';
import {
  UtensilsCrossed, Beef, Leaf, CupSoda, Apple,
  CalendarDays, Clock, ChevronLeft, ChevronRight,
  Pencil, Check, X, Moon,
} from 'lucide-react';
import { getMenu, saveMenu, getSesiAktif, SESI_CONFIG, laukToArray } from '../lib/menuStore';

// Field-field menu yang bisa diisi
const FIELDS = [
  { key: 'menuUtama', label: 'Menu Utama', icon: UtensilsCrossed, color: 'primary', placeholder: 'Nasi putih, bubur, ...' },
  { key: 'lauk',      label: 'Lauk Pauk',  icon: Beef,           color: 'amber',   placeholder: 'Ayam goreng, tempe, ... (pisah dengan koma)' },
  { key: 'sayur',     label: 'Sayur',       icon: Leaf,           color: 'emerald', placeholder: 'Sayur sop, tumis kangkung, ...' },
  { key: 'minuman',   label: 'Minuman',     icon: CupSoda,        color: 'sky',     placeholder: 'Es teh, air putih, ...' },
  { key: 'buah',      label: 'Buah',        icon: Apple,          color: 'rose',    placeholder: 'Pisang, semangka, ...' },
];

const COLOR_MAP = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', ring: 'ring-primary-100', dot: 'bg-primary-400', border: 'border-primary-300', header: 'bg-primary-600' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   ring: 'ring-amber-100',   dot: 'bg-amber-400',   border: 'border-amber-300',   header: 'bg-amber-500'   },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100', dot: 'bg-emerald-400', border: 'border-emerald-300', header: 'bg-emerald-600' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-600',     ring: 'ring-sky-100',     dot: 'bg-sky-400',     border: 'border-sky-300',     header: 'bg-sky-600'     },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    ring: 'ring-rose-100',    dot: 'bg-rose-400',    border: 'border-rose-300',    header: 'bg-rose-600'    },
};

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export default function MenuHariIni() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(new Date(today));
  const [activeSesi, setActiveSesi] = useState(() => {
    const s = getSesiAktif();
    return s === 'tutup' ? 'pagi' : s;
  });
  const [editingSesi, setEditingSesi] = useState(null); // sesi yang sedang diedit
  const [draftMenu, setDraftMenu] = useState({});
  const [savedMenus, setSavedMenus] = useState({});
  const [now, setNow] = useState(new Date());

  // Jam real-time untuk deteksi sesi
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  // Load semua menu untuk tanggal yang ditampilkan
  useEffect(() => {
    const menus = {};
    for (const sesi of ['pagi', 'siang', 'sore']) {
      menus[sesi] = getMenu(viewDate, sesi);
    }
    setSavedMenus(menus);
  }, [viewDate]);

  const isToday = dateKey(viewDate) === dateKey(today);
  const isFuture = viewDate > today;
  const currentSesi = getSesiAktif(); // sesi jam sekarang (bisa tutup)

  const formattedDate = viewDate.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Mulai edit sesi
  const startEdit = (sesi) => {
    setDraftMenu({ ...(savedMenus[sesi] || {}) });
    setEditingSesi(sesi);
  };

  // Batalkan edit
  const cancelEdit = () => {
    setEditingSesi(null);
    setDraftMenu({});
  };

  // Simpan edit
  const saveEdit = (sesi) => {
    saveMenu(viewDate, sesi, draftMenu);
    setSavedMenus((prev) => ({ ...prev, [sesi]: { ...draftMenu } }));
    setEditingSesi(null);
    setDraftMenu({});
  };

  // Status sesi: aktif / selesai / akan datang
  const getSesiStatus = (sesi) => {
    if (!isToday) return isFuture ? 'akan-datang' : 'selesai';
    const sesiOrder = ['pagi', 'siang', 'sore'];
    const idx = sesiOrder.indexOf(sesi);
    const curIdx = sesiOrder.indexOf(currentSesi);
    if (currentSesi === 'tutup') {
      const h = now.getHours();
      if (h < 8) return 'akan-datang';
      return 'selesai'; // setelah jam 18
    }
    if (idx < curIdx) return 'selesai';
    if (idx === curIdx) return 'aktif';
    return 'akan-datang';
  };

  const menuIsEmpty = (sesi) => {
    const m = savedMenus[sesi] || {};
    return !m.menuUtama && !m.lauk && !m.sayur && !m.minuman && !m.buah;
  };

  // Apakah di luar semua jam makan hari ini
  const isOutsideAllMeals = isToday && currentSesi === 'tutup';
  const h = now.getHours();
  const afterAllMeals = isOutsideAllMeals && h >= 18;
  const beforeAllMeals = isOutsideAllMeals && h < 8;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Menu Hari Ini</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola menu makan pagi, siang, dan sore</p>
      </div>

      {/* Banner tutup */}
      {isToday && isOutsideAllMeals && (
        <div className="flex items-center gap-3 bg-slate-800 text-white rounded-2xl px-5 py-4">
          <Moon className="w-5 h-5 text-slate-300 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {afterAllMeals ? 'Makanan tersedia lagi besok' : beforeAllMeals ? 'Belum waktunya makan' : 'Di luar jam makan'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Pagi 08.00–11.00 · Siang 12.00–15.00 · Sore 16.00–18.00
            </p>
          </div>
        </div>
      )}

      {/* Navigasi hari */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewDate((d) => addDays(d, -1))}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">{formattedDate}</p>
            {isToday && (
              <span className="inline-block mt-1 text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                HARI INI
              </span>
            )}
          </div>

          <button
            onClick={() => setViewDate((d) => addDays(d, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tab sesi */}
        <div className="flex gap-2 mt-4">
          {['pagi', 'siang', 'sore'].map((sesi) => {
            const cfg = SESI_CONFIG[sesi];
            const status = getSesiStatus(sesi);
            return (
              <button
                key={sesi}
                onClick={() => setActiveSesi(sesi)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all border
                  ${activeSesi === sesi
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div>{cfg.label}</div>
                <div className={`text-[9px] mt-0.5 font-normal ${activeSesi === sesi ? 'text-slate-300' : 'text-slate-400'}`}>
                  {cfg.jam}
                </div>
                {status === 'aktif' && (
                  <div className="flex justify-center mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel menu per sesi */}
      {['pagi', 'siang', 'sore'].map((sesi) => {
        if (sesi !== activeSesi) return null;
        const cfg = SESI_CONFIG[sesi];
        const c = COLOR_MAP[cfg.color];
        const status = getSesiStatus(sesi);
        const isEmpty = menuIsEmpty(sesi);
        const isEditing = editingSesi === sesi;

        return (
          <div key={sesi} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header sesi */}
            <div className={`${c.header} px-5 py-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold">{cfg.label}</h2>
                    {status === 'aktif' && (
                      <span className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                        AKTIF
                      </span>
                    )}
                    {status === 'selesai' && (
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">SELESAI</span>
                    )}
                  </div>
                  <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {cfg.jam}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => startEdit(sesi)}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {isEmpty ? 'Isi Menu' : 'Edit Menu'}
                  </button>
                )}
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                /* Form edit */
                <div className="space-y-4">
                  {FIELDS.map(({ key, label, icon: Icon, color, placeholder }) => {
                    const fc = COLOR_MAP[color];
                    return (
                      <div key={key}>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5">
                          <div className={`w-6 h-6 ${fc.bg} rounded-md flex items-center justify-center ring-1 ${fc.ring}`}>
                            <Icon className={`w-3.5 h-3.5 ${fc.icon}`} />
                          </div>
                          {label}
                          {key === 'lauk' && <span className="text-slate-400 font-normal">(pisah dengan koma)</span>}
                        </label>
                        <input
                          type="text"
                          value={draftMenu[key] || ''}
                          onChange={(e) => setDraftMenu((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                            placeholder:text-slate-300 transition-all"
                        />
                      </div>
                    );
                  })}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveEdit(sesi)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700
                        text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Simpan
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200
                        text-slate-600 text-sm font-semibold rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </button>
                  </div>
                </div>
              ) : isEmpty ? (
                /* State kosong */
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <UtensilsCrossed className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Menu belum diisi</p>
                  <p className="text-xs text-slate-300 mt-1">Klik tombol &quot;Isi Menu&quot; di atas untuk menambahkan</p>
                </div>
              ) : (
                /* Tampilan menu */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FIELDS.map(({ key, label, icon: Icon, color }) => {
                    const fc = COLOR_MAP[color];
                    const val = savedMenus[sesi]?.[key] || '';
                    if (!val) return null;
                    const isLauk = key === 'lauk';
                    const items = isLauk ? laukToArray(val) : [val];

                    return (
                      <div key={key} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-9 h-9 ${fc.bg} rounded-xl flex items-center justify-center ring-1 ${fc.ring}`}>
                            <Icon className={`w-4 h-4 ${fc.icon}`} />
                          </div>
                          <h3 className="text-xs font-semibold text-slate-600">{label}</h3>
                        </div>
                        <ul className="space-y-1.5">
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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
