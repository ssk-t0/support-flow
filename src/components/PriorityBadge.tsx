'use client';
import type { Priority } from '@/types';

const priorityConfig: Record<Priority, { bg: string; text: string; dot: string }> = {
  '高': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  '中': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  '低': { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
};

interface Props {
  priority: Priority;
}

export default function PriorityBadge({ priority }: Props) {
  const config = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {priority}
    </span>
  );
}
