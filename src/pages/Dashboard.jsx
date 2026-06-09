import { Users, CheckCircle2, XCircle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { getTodayStats, getWeeklyStats, getSesiAktif } from '../lib/attendanceStore';
import { fetchStudents, getCachedStudents } from '../lib/studentStore';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [total, setTotal] = useState(getCachedStudents().length);
  const sesi = getSesiAktif();
  const [stats, setStats] = useState(getTodayStats(total, sesi));
  const [chartData, setChartData] = useState(getWeeklyStats(total));

  // Fetch total santri dari Supabase
  useEffect(() => {
    fetchStudents().then((data) => {
      setTotal(data.length);
    });
  }, []);

  // Jam real-time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Refresh stats tiap 3 detik
  useEffect(() => {
    const refresh = () => {
      const t = getCachedStudents().length;
      const currentSesi = getSesiAktif();
      setStats(getTodayStats(t, currentSesi));
      setChartData(getWeeklyStats(t));
    };
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const percentage = total > 0 ? Math.round((stats.sudahMengambil / total) * 100) : 0;

  // Hanya tampilkan bar untuk hari yang punya data (sudah !== null)
  const visibleChartData = chartData.map((d) => ({
    hari: d.hari,
    sudah: d.sudah ?? 0,
    belum: d.belum ?? 0,
    hasData: d.sudah !== null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Ringkasan data absensi makan santri</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 border border-slate-200 shadow-sm sm:hidden">
          <Clock className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-slate-700">{formattedDate}</span>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-semibold text-primary-600">{formattedTime}</span>
        </div>
      </div>

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Santri"
          value={stats.totalSantri}
          icon={Users}
          color="blue"
          subtitle="Seluruh santri terdaftar"
        />
        <DashboardCard
          title="Sudah Mengambil"
          value={stats.sudahMengambil}
          icon={CheckCircle2}
          color="green"
          subtitle={`${percentage}% dari total santri`}
        />
        <DashboardCard
          title="Belum Mengambil"
          value={stats.belumMengambil}
          icon={XCircle}
          color="red"
          subtitle="Perlu segera diingatkan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grafik mingguan */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Statistik Harian</h2>
              <p className="text-xs text-slate-400 mt-0.5">7 hari terakhir — bar muncul saat ada data scan</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Minggu ini
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={visibleChartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="hari"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                }}
                formatter={(value, name, props) => {
                  // Sembunyikan tooltip untuk hari yang tidak punya data
                  if (!props.payload?.hasData) return ['-', name];
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Bar
                dataKey="sudah"
                name="Sudah Mengambil"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="belum"
                name="Belum Mengambil"
                fill="#e2e8f0"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ringkasan hari ini */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Ringkasan Hari Ini</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="#3b82f6" strokeWidth="12"
                  strokeDasharray={`${percentage * 3.27} 327`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">{percentage}%</span>
                <span className="text-[10px] text-slate-400">Tercapai</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-sm text-slate-600">Sudah</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">{stats.sudahMengambil} santri</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-sm text-slate-600">Belum</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">{stats.belumMengambil} santri</span>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
