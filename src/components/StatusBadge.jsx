export default function StatusBadge({ status }) {
  if (status === 'sudah') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Sudah Mengambil
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 ring-1 ring-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Belum Mengambil
    </span>
  );
}
