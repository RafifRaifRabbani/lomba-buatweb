import { QRCodeSVG } from 'qrcode.react';
import { getSession } from '../lib/authStore';
import { UtensilsCrossed } from 'lucide-react';

export default function KartuSaya() {
  const session = getSession();
  const qrValue = JSON.stringify({ nik: session?.nik, nama: session?.nama });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kartu Saya</h1>
        <p className="text-sm text-slate-500 mt-1">QR Code untuk scan absensi makan</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-50 p-8 flex flex-col items-center gap-6 w-full max-w-sm">
          {/* Header kartu */}
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kartu Santri</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Absensi Makan Pondok Pesantren</p>
          </div>

          {/* QR Code */}
          <div className="p-4 bg-white rounded-2xl border-2 border-blue-100 shadow-inner">
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="M"
              includeMargin={false}
            />
          </div>

          {/* Info santri */}
          <div className="w-full text-center space-y-1 pt-2 border-t border-slate-100">
            <p className="text-lg font-bold text-slate-800">{session?.nama}</p>
            <p className="text-sm font-mono text-slate-500">{session?.nik}</p>
          </div>

          {/* Petunjuk */}
          <div className="w-full bg-blue-50 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Tunjukkan QR Code ini saat mengambil makan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
