import { useState } from 'react';
import { User, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import QRScannerSection from '../components/QRScannerSection';
import StatusBadge from '../components/StatusBadge';
import { santriList } from '../data/dummyData';
import { markSudahMakan, getAbsensi, getSesiAktif } from '../lib/attendanceStore';
import { SESI_CONFIG } from '../lib/menuStore';

export default function ScanKartu() {
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState('');

  const sesi = getSesiAktif();

  const handleScan = (rawText) => {
    setScanError('');
    setResult(null);

    if (sesi === 'tutup') {
      setScanError('Di luar jam makan. Scan tidak dapat dilakukan sekarang.');
      return;
    }

    let nik = rawText.trim();
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.nik) nik = parsed.nik;
    } catch { /* plain NIK */ }

    const santri = santriList.find((s) => s.nik === nik);
    if (!santri) {
      setScanError(`NIK "${nik}" tidak ditemukan dalam data santri.`);
      return;
    }

    const absensi = getAbsensi(sesi);
    if (absensi[nik]) {
      setResult({ ...santri, status: 'sudah', jam: absensi[nik].jam, tanggal: absensi[nik].tanggal, sudahSebelumnya: true });
      return;
    }

    const { jam, tanggal } = markSudahMakan(nik, sesi);
    setResult({ ...santri, status: 'sudah', jam, tanggal, sudahSebelumnya: false });
  };

  const sesiLabel = sesi === 'tutup' ? null : SESI_CONFIG[sesi]?.label;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Scan Kartu</h1>
        <p className="text-sm text-slate-500 mt-1">
          {sesiLabel ? `Sesi aktif: ${sesiLabel}` : 'Di luar jam makan'}
        </p>
      </div>

      {/* Notifikasi sukses baru */}
      {result && !result.sudahSebelumnya && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Absensi Tercatat!</p>
            <p className="text-xs text-emerald-600">{result.nama} berhasil dicatat pada {result.jam}</p>
          </div>
        </div>
      )}

      {/* Notifikasi sudah scan sebelumnya */}
      {result && result.sudahSebelumnya && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Sudah Tercatat Sebelumnya</p>
            <p className="text-xs text-amber-600">{result.nama} sudah mengambil makan pada {result.jam}</p>
          </div>
        </div>
      )}

      {/* Notifikasi error */}
      {scanError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Kartu Tidak Dikenali</p>
            <p className="text-xs text-red-600">{scanError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Scanner */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Area Pemindaian</h2>
            <QRScannerSection onScan={handleScan} />
          </div>
        </div>

        {/* Hasil scan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Hasil Scan</h2>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{result.nama}</p>
                    <p className="text-xs text-slate-500">Kelas {result.kelas}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">NIK</p>
                      <p className="text-sm font-mono text-slate-700">{result.nik}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Waktu Scan</p>
                      <p className="text-sm text-slate-700">{result.jam}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Status Pengambilan</p>
                      <div className="mt-1">
                        <StatusBadge status={result.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400">Belum ada data scan</p>
                <p className="text-xs text-slate-300 mt-1">Scan kartu untuk melihat hasil</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
