/**
 * Menu store menggunakan localStorage.
 * Struktur:
 * {
 *   "2026-06-10": {
 *     pagi:  { menuUtama, lauk, sayur, minuman, buah },
 *     siang: { menuUtama, lauk, sayur, minuman, buah },
 *     sore:  { menuUtama, lauk, sayur, minuman, buah },
 *   },
 *   ...
 * }
 *
 * lauk disimpan sebagai string (koma-separated) supaya mudah diedit via <input>
 */

const STORAGE_KEY = 'menu_makan';

const EMPTY_MENU = { menuUtama: '', lauk: '', sayur: '', minuman: '', buah: '' };

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Ambil menu untuk tanggal & sesi tertentu */
export function getMenu(dateObj, sesi) {
  const store = getStore();
  return store[dateKey(dateObj)]?.[sesi] ?? { ...EMPTY_MENU };
}

/** Simpan menu untuk tanggal & sesi tertentu */
export function saveMenu(dateObj, sesi, menuData) {
  const store = getStore();
  const key = dateKey(dateObj);
  if (!store[key]) store[key] = {};
  store[key][sesi] = menuData;
  saveStore(store);
}

/**
 * Tentukan sesi aktif berdasarkan jam sekarang.
 * Return: 'pagi' | 'siang' | 'sore' | 'tutup'
 * Pagi:  08:00 – 10:59
 * Siang: 12:00 – 14:59
 * Sore:  16:00 – 17:59
 * Lainnya: tutup
 */
export function getSesiAktif() {
  const now = new Date();
  const h = now.getHours();
  if (h >= 8 && h < 11) return 'pagi';
  if (h >= 12 && h < 15) return 'siang';
  if (h >= 16 && h < 18) return 'sore';
  return 'tutup';
}

export const SESI_CONFIG = {
  pagi:  { label: 'Makan Pagi',  jam: '08.00 – 11.00', color: 'amber' },
  siang: { label: 'Makan Siang', jam: '12.00 – 15.00', color: 'primary' },
  sore:  { label: 'Makan Sore',  jam: '16.00 – 18.00', color: 'sky' },
};

/** Parse lauk string ke array */
export function laukToArray(lauk = '') {
  return lauk
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
