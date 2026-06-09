import { useState, useEffect } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AttendanceTable from '../components/AttendanceTable';
import { santriList } from '../data/dummyData';
import { getAbsensi, resetAbsensiSesi, getSesiAktif } from '../lib/attendanceStore';
import { SESI_CONFIG } from '../lib/menuStore';

function buildTableData(sesi) {
  const absensi = sesi === 'tutup' ? {} : getAbsensi(sesi);
  const today = new Date().toLocaleDateString('id-ID', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  return santriList.map((s) => {
    const record = absensi[s.nik];
    return {
      id: s.id,
      nama: s.nama,
      nik: s.nik,
      kelas: s.kelas,
      tanggal: record ? record.tanggal : today,
      jam: record ? record.jam : '-',
      status: record ? 'sudah' : 'belum',
    };
  });
}

export default function DataAbsensi() {
  const [search, setSearch] = useState('');
  const [tableData, setTableData] = useState([]);
  const sesi = getSesiAktif();
  const sesiLabel = sesi === 'tutup' ? 'Di luar jam makan' : SESI_CONFIG[sesi]?.label;

  const refresh = () => setTableData(buildTableData(sesi));

  useEffect(() => {
    const doRefresh = () => setTableData(buildTableData(sesi));
    doRefresh();
    const interval = setInterval(doRefresh, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    if (sesi === 'tutup') return;
    if (window.confirm(`Reset absensi sesi ${sesiLabel}?`)) {
      resetAbsensiSesi(sesi);
      refresh();
    }
  };

  const filtered = tableData.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search) ||
      item.kelas.toLowerCase().includes(search.toLowerCase())
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
          <button onClick={refresh} title="Refresh"
            className="p-2 border rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border rounded-xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari nama, NIK, atau kelas..." />
      </div>

      <AttendanceTable data={filtered} />
    </div>
  );
}
