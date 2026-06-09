import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff, LogIn, ShieldCheck, User } from 'lucide-react';
import { setSession, ADMIN_CREDENTIALS } from '../lib/authStore';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('admin'); // 'admin' | 'santri'

  // Admin state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Santri state
  const [santriNama, setSantriNama] = useState('');
  const [santriNik, setSantriNik] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (
      adminUser.trim() === ADMIN_CREDENTIALS.username &&
      adminPass === ADMIN_CREDENTIALS.password
    ) {
      setSession({ role: 'admin', nama: 'Admin', nik: null });
      navigate('/');
    } else {
      setError('Username atau password salah.');
    }
  };

  const handleSantriLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!santriNama.trim() || !santriNik.trim()) {
      setError('Nama dan NIK wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('students')
        .select('*')
        .ilike('nama', santriNama.trim())
        .eq('nik', santriNik.trim())
        .single();

      if (err || !data) {
        setError('Nama atau NIK tidak ditemukan. Periksa kembali.');
        return;
      }

      setSession({ role: 'santri', nama: data.nama, nik: data.nik, id: data.id });
      navigate('/kartu-saya');
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Absensi Makan Santri</h1>
          <p className="text-sm text-slate-500 mt-1">Silakan masuk untuk melanjutkan</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
          {/* Tab */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => { setTab('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors
                ${tab === 'admin'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => { setTab('santri'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors
                ${tab === 'santri'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <User className="w-4 h-4" />
              Santri
            </button>
          </div>

          <div className="p-6">
            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form Admin */}
            {tab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                      placeholder:text-slate-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                        placeholder:text-slate-300 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700
                    text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk sebagai Admin
                </button>
              </form>
            )}

            {/* Form Santri */}
            {tab === 'santri' && (
              <form onSubmit={handleSantriLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    value={santriNama}
                    onChange={(e) => setSantriNama(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                      placeholder:text-slate-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">NIK</label>
                  <input
                    type="text"
                    value={santriNik}
                    onChange={(e) => setSantriNik(e.target.value)}
                    placeholder="Masukkan NIK"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                      placeholder:text-slate-300 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700
                    disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all
                    shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? 'Memeriksa...' : 'Masuk sebagai Santri'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Sistem Absensi Makan Santri · Pondok Pesantren
        </p>
      </div>
    </div>
  );
}
