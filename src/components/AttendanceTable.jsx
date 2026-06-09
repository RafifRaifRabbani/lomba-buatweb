import PropTypes from 'prop-types';
import StatusBadge from './StatusBadge';

export default function AttendanceTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-sm">Tidak ada data yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">No</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">NIK</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jam</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-3.5 px-4 text-sm text-slate-500">{index + 1}</td>
              <td className="py-3.5 px-4 text-sm font-medium text-slate-700">{item.nama}</td>
              <td className="py-3.5 px-4 text-sm text-slate-500 font-mono">{item.nik}</td>
              <td className="py-3.5 px-4 text-sm text-slate-500">{item.tanggal}</td>
              <td className="py-3.5 px-4 text-sm text-slate-500">{item.jam}</td>
              <td className="py-3.5 px-4"><StatusBadge status={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

AttendanceTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nama: PropTypes.string,
      nik: PropTypes.string,
      tanggal: PropTypes.string,
      jam: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
};
