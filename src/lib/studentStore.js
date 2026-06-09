/**
 * studentStore.js
 * Fetch daftar santri dari Supabase.
 * Fallback ke dummyData kalau Supabase error / tabel kosong.
 */
import { supabase } from './supabase';
import { santriList as fallbackList } from '../data/dummyData';

let cachedStudents = null;

/**
 * Ambil list santri dari Supabase.
 * Return array: [{ id, nama, nik, kelas }]
 */
export async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Tabel kosong');

    // Normalize kolom — tabel hanya punya id, nama, nik
    const normalized = data.map((row, idx) => ({
      id: row.id ?? idx + 1,
      nama: row.nama ?? '',
      nik: row.nik ?? String(row.id ?? ''),
      kelas: '',
    }));

    cachedStudents = normalized;
    return normalized;
  } catch {
    // Fallback ke dummy data kalau Supabase gagal
    return fallbackList;
  }
}

/** Ambil dari cache kalau sudah pernah di-fetch */
export function getCachedStudents() {
  return cachedStudents ?? fallbackList;
}
