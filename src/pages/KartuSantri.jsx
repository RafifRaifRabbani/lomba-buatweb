import { QRCodeSVG } from 'qrcode.react';
import { santriList } from '../data/dummyData';
import { Printer } from 'lucide-react';

export default function KartuSantri() {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kartu Santri</h1>
          <p className="text-sm text-slate-500">
            QR Code untuk scan absensi makan — satu kartu per santri
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700
            text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/20"
        >
          <Printer className="w-4 h-4" />
          Cetak Semua
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 print:grid-cols-4">
        {santriList.map((santri) => (
          <KartuItem key={santri.nik} santri={santri} />
        ))}
      </div>

      {/* CSS print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}

function KartuItem({ santri }) {
  // QR berisi JSON dengan nik dan nama
  const qrValue = JSON.stringify({ nik: santri.nik, nama: santri.nama });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-3
      shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:rounded-lg">
      {/* Header kartu */}
      <div className="w-full text-center pb-2 border-b border-slate-100">
        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Kartu Santri</p>
        <p className="text-[9px] text-slate-400">Absensi Makan</p>
      </div>

      {/* QR Code */}
      <div className="p-2 bg-white rounded-xl border border-slate-100">
        <QRCodeSVG
          value={qrValue}
          size={110}
          level="M"
          includeMargin={false}
        />
      </div>

      {/* Info santri */}
      <div className="w-full text-center space-y-0.5">
        <p className="text-sm font-bold text-slate-800 leading-tight">{santri.nama}</p>
        <p className="text-xs text-slate-500">Kelas {santri.kelas}</p>
        <p className="text-[10px] font-mono text-slate-400 mt-1">{santri.nik}</p>
      </div>
    </div>
  );
}
