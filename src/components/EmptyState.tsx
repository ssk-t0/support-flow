'use client';

interface Props {
  message?: string;
  icon?: string;
}

export default function EmptyState({ message = 'データがありません', icon = '📭' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
