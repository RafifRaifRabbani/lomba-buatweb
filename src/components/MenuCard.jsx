import { UtensilsCrossed, Beef, Leaf, CupSoda, Apple } from 'lucide-react';

export default function MenuCard({ icon: Icon, label, items, color }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      ring: 'ring-primary-100',
      dot: 'bg-primary-400',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      ring: 'ring-amber-100',
      dot: 'bg-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      ring: 'ring-emerald-100',
      dot: 'bg-emerald-400',
    },
    sky: {
      bg: 'bg-sky-50',
      icon: 'text-sky-600',
      ring: 'ring-sky-100',
      dot: 'bg-sky-400',
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      ring: 'ring-rose-100',
      dot: 'bg-rose-400',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  const isArray = Array.isArray(items);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:shadow-slate-100 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center ring-1 ${c.ring}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      </div>
      {isArray ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              <span className="text-sm text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
          <span className="text-sm text-slate-600">{items}</span>
        </div>
      )}
    </div>
  );
}
