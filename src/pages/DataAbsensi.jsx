import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AttendanceTable from '../components/AttendanceTable';
import { getAbsensi, resetAbsensiSesi, getSesiAktif } from '../lib/attendanceStore';
import { SESI_CONFIG } from '../lib/menuStore';
import { fetchStudents } from '../lib/studentStore';

function buildTableData(students, sesi) {
  const absensi = sesi === 'tutup' ? {} : getAbsensi(sesi);
  const today = new Date().toLocaleDateString('id-ID', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  return students.map((s) => {
    const record = absensi[s.nik];
    return {
      id: s.id,
      nama: s.nama,
      nik: s.nik,
      tanggal: record ? record.tanggal : today,
      jam: record ? record.jam : '-',
      status: record ? 'sudah' : 'belum',
    };
  });
}

export default function DataAbsensi() {
  const [search, setSearch] = useState('');
  const [tableData, setTableData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const sesi = getSesiAktif();
  const sesiLabel = sesi === 'tutup' ? 'Di luar jam makan' : SESI_CONFIG[sesi]?.label;

  // Fetch santri dari Supabase sekali saat mount
  useEffect(() => {
    setLoading(true);
    setLoadError('');
    fetchStudents()
      .then((data) => {
        setStudents(data);
        setTableData(buildTableData(data, sesi));
      })
      .catch(() => setLoadError('Gagal memuat data santri.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh absensi tiap 3 detik (tanpa fetch ulang ke Supabase)
  useEffect(() => {
    if (students.length === 0) return;
    const interval = setInterval(() => {
      setTableData(buildTableData(students, sesi));
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchStudents()
      .then((data) => {
        setStudents(data);
        setTableData(buildTableData(data, sesi));
      })
      .finally(() => setLoading(false));
  }, [sesi]);

  const handleReset = () => {
    if (sesi === 'tutup') return;
    if (window.confirm(`Reset absensi sesi ${sesiLabel}?`)) {
      resetAbsensiSesi(sesi);
      setTableData(buildTableData(students, sesi));
    }
  };

  const filtered = tableData.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search)
  );

  const sudahCount = tableData.filter((d) => d.status === 'sudah').length;
  const belumCount = tableData.filter((d) => d.status === 'belum').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Absensi</h1>
          <p className="text-sm text-slate-500">
            {sesiLabel} &bull; {sudahCount} sudah &bull; {belumCount} belum
          </p>
        </div>
        <div className="flex gap-2">
          {sesi !== 'tutup' && (
            <button onClick={handleReset} title="Reset absensi sesi ini"
              className="p-2 border rounded-xl bg-white shadow-sm text-red-400 hover:text-red-600 hover:border-red-300 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={refresh} title="Refresh data dari Supabase"
            className="p-2 border rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border rounded-xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari nama atau NIK..." />
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Memuat data santri...</div>
      ) : loadError ? (
        <div className="text-center py-10 text-red-400 text-sm">{loadError}</div>
      ) : (
        <AttendanceTable data={filtered} />
      )}
    </div>
  );
}
