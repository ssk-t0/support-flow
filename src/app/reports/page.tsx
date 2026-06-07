'use client';
import { useEffect, useState } from 'react';
import type { Inquiry, Staff } from '@/types';
import { getInquiries, getStaff } from '@/lib/storage';
import CsvExportButton from '@/components/CsvExportButton';
import FilterSelect from '@/components/FilterSelect';

export default function ReportsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStaff, setFilterStaff] = useState('');

  useEffect(() => {
    setInquiries(getInquiries());
    setStaff(getStaff());
  }, []);

  const months = [...new Set(inquiries.map((i) => i.receivedAt.slice(0, 7)))].sort().reverse();

  const filtered = inquiries.filter((i) => {
    if (filterMonth && !i.receivedAt.startsWith(filterMonth)) return false;
    if (filterStaff && i.assignedStaffId !== filterStaff) return false;
    return true;
  });

  const total = filtered.length;
  const completed = filtered.filter((i) => i.status === '完了').length;
  const unhandled = filtered.filter((i) => i.status === '未対応').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const unhandledRate = total > 0 ? Math.round((unhandled / total) * 100) : 0;

  const staffRanking = staff.map((s) => ({
    name: s.name,
    count: filtered.filter((i) => i.assignedStaffId === s.id).length,
    completedCount: filtered.filter((i) => i.assignedStaffId === s.id && i.status === '完了').length,
  })).sort((a, b) => b.count - a.count);

  const typeCounts = filtered.reduce<Record<string, number>>((acc, i) => {
    acc[i.type] = (acc[i.type] ?? 0) + 1;
    return acc;
  }, {});

  const statusCounts = filtered.reduce<Record<string, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1;
    return acc;
  }, {});

  const dayCounts = filtered.reduce<Record<string, number>>((acc, i) => {
    const day = i.receivedAt.slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});
  const dayEntries = Object.entries(dayCounts).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const maxDayCount = Math.max(...dayEntries.map(([, c]) => c), 1);

  const csvData = filtered.map((i) => ({
    'ID': i.id,
    '受付日時': i.receivedAt,
    '顧客名': i.customerName,
    '連絡先': i.contact,
    '種別': i.type,
    'ステータス': i.status,
    '優先度': i.priority,
    '担当スタッフ': staff.find((s) => s.id === i.assignedStaffId)?.name ?? '',
    '問い合わせ内容': i.content,
    '対応メモ': i.memo,
    '最終更新': i.updatedAt,
  }));

  const maxTypeCount = Math.max(...Object.values(typeCounts), 1);
  const statusColors: Record<string, string> = {
    '未対応': 'bg-red-500',
    '対応中': 'bg-yellow-500',
    '完了': 'bg-green-500',
    '保留': 'bg-slate-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <FilterSelect value={filterMonth} onChange={setFilterMonth}
            options={months.map((m) => ({ value: m, label: m }))} placeholder="期間（月）" />
          <FilterSelect value={filterStaff} onChange={setFilterStaff}
            options={staff.map((s) => ({ value: s.id, label: s.name }))} placeholder="スタッフ" />
        </div>
        <CsvExportButton data={csvData} filename="inquiries_report.csv" label="CSVエクスポート" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '総問い合わせ件数', value: total, sub: `${filterMonth || '全期間'}`, color: 'bg-blue-50 text-blue-700' },
          { label: '完了率', value: `${completionRate}%`, sub: `${completed}件完了`, color: 'bg-green-50 text-green-700' },
          { label: '未対応率', value: `${unhandledRate}%`, sub: `${unhandled}件未対応`, color: 'bg-red-50 text-red-700' },
          { label: '担当スタッフ数', value: staff.length, sub: `稼働 ${staff.filter((s) => s.workStatus === '稼働中').length}名`, color: 'bg-purple-50 text-purple-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-lg p-4 ${item.color.split(' ')[0]}`}>
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-3xl font-bold ${item.color.split(' ')[1]}`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-slate-800 mb-4">日別問い合わせ件数（直近14日）</h2>
        <div className="flex items-end gap-1 h-32">
          {dayEntries.map(([day, count]) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-xs text-slate-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{ height: `${(count / maxDayCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
              />
              <span className="text-xs text-slate-400 truncate w-full text-center" style={{ fontSize: '10px' }}>
                {day.slice(5)}
              </span>
            </div>
          ))}
          {dayEntries.length === 0 && (
            <p className="text-sm text-slate-400 w-full text-center py-8">データがありません</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-800 mb-4">スタッフ別対応ランキング</h2>
          <div className="space-y-3">
            {staffRanking.map((s, i) => (
            <div key={s.name} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{i + 1}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-700 truncate">{s.name}</span>
                </div>
                <div className="w-full flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${total > 0 ? (s.count / total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 flex-shrink-0">{s.count}件</span>
                  </div>
                  <p className="text-xs text-green-600 mt-0.5">完了 {s.completedCount}件</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-3">問い合わせ種別</h2>
            <div className="space-y-2">
              {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 truncate">{type}</span>
                    <span className="font-semibold ml-2">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / maxTypeCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-bold text-slate-800 mb-3">ステータス別件数</h2>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[status] ?? 'bg-slate-400'}`} />
                  <span className="text-xs text-slate-600 flex-1">{status}</span>
                  <span className="text-xs font-bold text-slate-800">{count}件</span>
                  <span className="text-xs text-slate-400">({total > 0 ? Math.round((count / total) * 100) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
