'use client';

interface Props {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'orange';
  sub?: string;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', value: 'text-yellow-700' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-700' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700' },
};

export default function StatCard({ title, value, icon, color, sub }: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 sm:p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${c.value} leading-tight`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
