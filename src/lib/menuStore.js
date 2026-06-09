/**
 * Menu store — baca/tulis ke Supabase.
 * Tabel: menu
 * Kolom: id, tanggal (date), sesi (text), menu_utama, lauk, sayur, minuman, buah
 */

import { supabase } from './supabase';

export const EMPTY_MENU = { menuUtama: '', lauk: '', sayur: '', minuman: '', buah: '' };

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Tentukan sesi aktif berdasarkan jam sekarang.
 * pagi: 08–11, siang: 12–15, sore: 16–18, lainnya: tutup
 */
export function getSesiAktif() {
  const h = new Date().getHours();
  if (h >= 8 && h < 11) return 'pagi';
  if (h >= 12 && h < 15) return 'siang';
  if (h >= 16 && h < 18) return 'sore';
  return 'tutup';
}

export const SESI_CONFIG = {
  pagi:  { label: 'Makan Pagi',  jam: '08.00 – 11.00', color: 'amber'   },
  siang: { label: 'Makan Siang', jam: '12.00 – 15.00', color: 'primary' },
  sore:  { label: 'Makan Sore',  jam: '16.00 – 18.00', color: 'sky'     },
};

/** Konversi row Supabase → format internal */
function rowToMenu(row) {
  if (!row) return { ...EMPTY_MENU };
  return {
    menuUtama: row.menu_utama ?? '',
    lauk:      row.lauk      ?? '',
    sayur:     row.sayur     ?? '',
    minuman:   row.minuman   ?? '',
    buah:      row.buah      ?? '',
  };
}

/** Ambil menu dari Supabase untuk tanggal & sesi tertentu */
export async function getMenu(dateObj, sesi) {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('tanggal', dateKey(dateObj))
    .eq('sesi', sesi)
    .maybeSingle();

  if (error) {
    console.error('getMenu error:', error.message);
    return { ...EMPTY_MENU };
  }
  return rowToMenu(data);
}

/** Simpan menu ke Supabase (upsert berdasarkan tanggal+sesi) */
export async function saveMenu(dateObj, sesi, menuData) {
  const tanggal = dateKey(dateObj);

  // Cek apakah sudah ada row untuk tanggal+sesi ini
  const { data: existing } = await supabase
    .from('menu')
    .select('id')
    .eq('tanggal', tanggal)
    .eq('sesi', sesi)
    .maybeSingle();

  const payload = {
    tanggal,
    sesi,
    menu_utama: menuData.menuUtama || '',
    lauk:       menuData.lauk      || '',
    sayur:      menuData.sayur     || '',
    minuman:    menuData.minuman   || '',
    buah:       menuData.buah      || '',
  };

  if (existing?.id) {
    // Update
    const { error } = await supabase
      .from('menu')
      .update(payload)
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    // Insert
    const { error } = await supabase
      .from('menu')
      .insert(payload);
    if (error) throw error;
  }
}

/** Parse lauk string ke array */
export function laukToArray(lauk = '') {
  return lauk
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
