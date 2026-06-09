export default function DashboardCard({ title, value, icon: Icon, color, subtitle }) {
  const colorMap = {
    blue: 'bg-primary-50 text-primary-600 ring-primary-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    red: 'bg-rose-50 text-rose-600 ring-rose-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  };

  const iconBg = {
    blue: 'bg-primary-100',
    green: 'bg-emerald-100',
    red: 'bg-rose-100',
    amber: 'bg-amber-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`w-11 h-11 ${iconBg[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${colorMap[color]?.split(' ')[1]}`} />
        </div>
      </div>
    </div>
  );
}
