'use client';
import { useEffect, useState } from 'react';
import type { Inquiry, Handover, Staff } from '@/types';
import { getInquiries, getHandovers, getStaff, formatDateTime } from '@/lib/storage';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    setInquiries(getInquiries());
    setHandovers(getHandovers());
    setStaff(getStaff());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayInquiries = inquiries.filter((i) => i.receivedAt.startsWith(today));
  const unhandled = inquiries.filter((i) => i.status === '未対応');
  const inProgress = inquiries.filter((i) => i.status === '対応中');
  const completed = inquiries.filter((i) => i.status === '完了');
  const todayHandovers = handovers.filter((h) => h.createdAt.startsWith(today));
  const activeStaff = staff.filter((s) => s.workStatus === '稼働中');
  const unconfirmedHandovers = handovers.filter((h) => h.status === '未確認');

  const typeCounts = inquiries.reduce<Record<string, number>>((acc, i) => {
    acc[i.type] = (acc[i.type] ?? 0) + 1;
    return acc;
  }, {});

  const maxTypeCount = Math.max(...Object.values(typeCounts), 1);

  const staffCounts = staff.map((s) => ({
    ...s,
    count: inquiries.filter((i) => i.assignedStaffId === s.id).length,
  })).sort((a, b) => b.count - a.count);

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="本日の問い合わせ" value={todayInquiries.length} icon="📩" color="blue" />
        <StatCard title="未対応" value={unhandled.length} icon="🔴" color="red" />
        <StatCard title="対応中" value={inProgress.length} icon="🟡" color="yellow" />
        <StatCard title="完了" value={completed.length} icon="✅" color="green" />
        <StatCard title="本日の申し送り" value={todayHandovers.length} icon="🔄" color="purple" />
        <StatCard title="稼働スタッフ" value={activeStaff.length} icon="👥" color="orange" sub={`全${staff.length}名`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-4">最近の問い合わせ</h2>
            <div className="space-y-2">
              {recentInquiries.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">問い合わせはありません</p>
              ) : (
                recentInquiries.map((inq) => (
                  <div key={inq.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500">{inq.id}</span>
                        <span className="text-xs text-slate-400">{formatDateTime(inq.receivedAt)}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{inq.customerName}</p>
                      <p className="text-xs text-slate-500 truncate">{inq.content}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                      <StatusBadge status={inq.status} size="sm" />
                      <PriorityBadge priority={inq.priority} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-4">未対応の問い合わせ</h2>
            {unhandled.length === 0 ? (
              <p className="text-sm text-green-600 text-center py-4">✓ 未対応の問い合わせはありません</p>
            ) : (
              <div className="space-y-2">
                {unhandled.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{inq.customerName}</p>
                      <p className="text-xs text-slate-500">{inq.type} · {formatDateTime(inq.receivedAt)}</p>
                    </div>
                    <PriorityBadge priority={inq.priority} />
                  </div>
                ))}
                {unhandled.length > 5 && (
                  <p className="text-xs text-slate-400 text-center pt-1">他 {unhandled.length - 5}件</p>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-4">本日の業務申し送り</h2>
            {unconfirmedHandovers.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">未確認の申し送りはありません</p>
            ) : (
              <div className="space-y-2">
                {unconfirmedHandovers.slice(0, 5).map((h) => {
                  const creator = staff.find((s) => s.id === h.createdById);
                  return (
                    <div key={h.id} className={`p-3 rounded-xl border ${h.priority === '高' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-100'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{h.subject}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{creator?.name ?? h.createdById} · {h.category}</p>
                        </div>
                        <PriorityBadge priority={h.priority} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-4">ステータス別件数</h2>
            <div className="space-y-3">
              {[
                { label: '未対応', count: unhandled.length, color: 'bg-red-500' },
                { label: '対応中', count: inProgress.length, color: 'bg-yellow-500' },
                { label: '完了', count: completed.length, color: 'bg-green-500' },
                { label: '保留', count: inquiries.filter((i) => i.status === '保留').length, color: 'bg-slate-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.count}件</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${inquiries.length > 0 ? (item.count / inquiries.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-4">問い合わせ種別</h2>
            <div className="space-y-2">
              {Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate">{type}</span>
                      <span className="font-semibold text-slate-800 ml-2 flex-shrink-0">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${(count / maxTypeCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-4">スタッフ別対応件数</h2>
            <div className="space-y-2">
              {staffCounts.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-700 truncate">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 flex-shrink-0">{s.count}件</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
