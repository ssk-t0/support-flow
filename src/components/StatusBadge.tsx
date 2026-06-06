'use client';
import type { InquiryStatus, HandoverStatus, WorkStatus } from '@/types';

type Status = InquiryStatus | HandoverStatus | WorkStatus;

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  '未対応': { bg: 'bg-red-100', text: 'text-red-700', label: '未対応' },
  '対応中': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '対応中' },
  '完了': { bg: 'bg-green-100', text: 'text-green-700', label: '完了' },
  '保留': { bg: 'bg-slate-100', text: 'text-slate-600', label: '保留' },
  '未確認': { bg: 'bg-red-100', text: 'text-red-700', label: '未確認' },
  '確認済み': { bg: 'bg-green-100', text: 'text-green-700', label: '確認済み' },
  '稼働中': { bg: 'bg-green-100', text: 'text-green-700', label: '稼働中' },
  '休憩中': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '休憩中' },
  '本日休み': { bg: 'bg-slate-100', text: 'text-slate-600', label: '本日休み' },
  '停止中': { bg: 'bg-red-100', text: 'text-red-600', label: '停止中' },
};

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = statusConfig[status] ?? { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${padding}`}>
      {config.label}
    </span>
  );
}
