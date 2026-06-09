import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, Camera, CheckCircle2, XCircle } from 'lucide-react';

QRScannerSection.propTypes = {
  onScan: PropTypes.func.isRequired,
};

export default function QRScannerSection({ onScan }) {
  const [status, setStatus] = useState('idle'); // idle | starting | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);

  const startScanner = async () => {
    setStatus('starting');
    setErrorMsg('');
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          // Matikan border bawaan library agar tidak dobel dengan overlay kita
          aspectRatio: 1.777,
        },
        (decodedText) => {
          stopScanner();
          setStatus('success');
          if (onScan) onScan(decodedText);
        },
        () => { /* frame tanpa QR, abaikan */ }
      );
      setStatus('scanning');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err.message?.toLowerCase().includes('permission')
          ? 'Akses kamera ditolak. Izinkan akses kamera di browser kamu.'
          : err.message || 'Gagal menyalakan kamera.'
      );
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
      scannerRef.current = null;
    }
  };

  useEffect(() => () => stopScanner(), []);

  const handleReset = () => {
    stopScanner();
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      {/* Wrapper posisi relatif — video akan mengisi area ini */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900" style={{ minHeight: '240px' }}>

        {/* 
          Container html5-qrcode. HARUS selalu ada di DOM dan visible 
          supaya library bisa inject <video> ke dalamnya.
          Kita sembunyikan dengan opacity/pointer-events saat tidak aktif,
          bukan dengan display:none atau hidden (yang bikin library gagal).
        */}
        <div
          id="qr-reader"
          className="w-full"
          style={{
            opacity: status === 'scanning' ? 1 : 0,
            pointerEvents: status === 'scanning' ? 'auto' : 'none',
          }}
        />

        {/* Overlay state: tampil di atas video saat idle/starting/success/error */}
        {status !== 'scanning' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
            {status === 'idle' && (
              <>
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">Kamera belum aktif</p>
                <p className="text-slate-500 text-xs text-center">Klik tombol di bawah untuk mulai scan</p>
              </>
            )}

            {status === 'starting' && (
              <>
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center animate-pulse">
                  <Camera className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-slate-400 text-sm">Menyalakan kamera...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-emerald-900/50 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-emerald-400 text-sm font-medium">QR Code Terbaca!</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-400 text-sm font-medium">Kamera Error</p>
                <p className="text-slate-400 text-xs text-center">{errorMsg}</p>
              </>
            )}
          </div>
        )}

        {/* Overlay frame scanner (di atas video, pointer-events:none biar tidak ganggu kamera) */}
        {status === 'scanning' && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-48 h-48 relative">
                <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-primary-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-primary-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-primary-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-primary-400 rounded-br-lg" />
                <div className="absolute left-1 right-1 h-0.5 bg-primary-400/70 animate-bounce top-1/2" />
              </div>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1 z-20">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-white/70 font-medium">LIVE</span>
            </div>
          </>
        )}
      </div>

      {/* Tombol */}
      {(status === 'idle' || status === 'error') && (
        <button
          onClick={startScanner}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-primary-600 hover:bg-primary-700
            text-white font-semibold rounded-xl transition-all duration-200
            shadow-lg shadow-primary-600/20 active:scale-[0.98]"
        >
          <ScanLine className="w-5 h-5" />
          Mulai Scan Kartu
        </button>
      )}

      {status === 'scanning' && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-600 hover:bg-slate-700
            text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          Hentikan Kamera
        </button>
      )}

      {status === 'success' && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-primary-600 hover:bg-primary-700
            text-white font-semibold rounded-xl transition-all duration-200
            shadow-lg shadow-primary-600/20 active:scale-[0.98]"
        >
          <ScanLine className="w-5 h-5" />
          Scan Kartu Berikutnya
        </button>
      )}
    </div>
  );
}
