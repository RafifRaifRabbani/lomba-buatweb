/**
 * Attendance store menggunakan localStorage.
 * Struktur:
 * {
 *   "2026-06-10": {
 *     pagi:  { "NIK": { jam, tanggal }, ... },
 *     siang: { ... },
 *     sore:  { ... },
 *   },
 * }
 */

const STORAGE_KEY = 'absensi_makan_v3';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

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

/** Tentukan sesi berdasarkan jam */
export function getSesiAktif() {
  const h = new Date().getHours();
  if (h >= 8 && h < 11) return 'pagi';
  if (h >= 12 && h < 15) return 'siang';
  if (h >= 16 && h < 18) return 'sore';
  return 'tutup';
}

/** Ambil absensi sesi aktif hari ini — { [nik]: { jam, tanggal } } */
export function getAbsensi(sesi) {
  const store = getStore();
  const todayData = store[getTodayKey()] || {};
  return todayData[sesi] || {};
}

/** Catat santri sudah makan pada sesi tertentu */
export function markSudahMakan(nik, sesi) {
  const now = new Date();
  const jam = now.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const tanggal = now.toLocaleDateString('id-ID', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });

  const store = getStore();
  const todayKey = getTodayKey();
  if (!store[todayKey]) store[todayKey] = {};
  if (!store[todayKey][sesi]) store[todayKey][sesi] = {};
  store[todayKey][sesi][nik] = { jam, tanggal };
  saveStore(store);
  return { jam, tanggal };
}

/** Reset absensi sesi tertentu hari ini */
export function resetAbsensiSesi(sesi) {
  const store = getStore();
  const todayKey = getTodayKey();
  if (store[todayKey]?.[sesi]) {
    delete store[todayKey][sesi];
    saveStore(store);
  }
}

/** Reset semua absensi hari ini */
export function resetAbsensiHariIni() {
  const store = getStore();
  delete store[getTodayKey()];
  saveStore(store);
}

/** Stats hari ini untuk sesi tertentu */
export function getTodayStats(totalSantri, sesi) {
  const absensi = getAbsensi(sesi);
  const sudah = Object.keys(absensi).length;
  return {
    totalSantri,
    sudahMengambil: sudah,
    belumMengambil: totalSantri - sudah,
  };
}

/** Statistik mingguan — gabungan semua sesi per hari */
export function getWeeklyStats(totalSantri) {
  const store = getStore();
  const hariSingkat = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const isToday = i === 0;
    const hariNama = hariSingkat[d.getDay()];
    const dayData = store[key];

    if (dayData) {
      // Hitung unik NIK yang scan di hari itu (dari semua sesi, tapi per sesi terpisah = ambil max)
      const allNiks = new Set();
      for (const sesi of ['pagi', 'siang', 'sore']) {
        if (dayData[sesi]) Object.keys(dayData[sesi]).forEach((n) => allNiks.add(n));
      }
      const sudah = allNiks.size;
      days.push({ hari: hariNama, key, sudah, belum: Math.max(0, totalSantri - sudah), isToday });
    } else {
      days.push({ hari: hariNama, key, sudah: isToday ? 0 : null, belum: isToday ? totalSantri : null, isToday });
    }
  }

  return days;
}
