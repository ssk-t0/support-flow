'use client';
import { useEffect, useState } from 'react';
import type { Staff, WorkStatus } from '@/types';
import { getStaff, saveStaff, getInquiries, getHandovers, generateId } from '@/lib/storage';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import StaffForm from '@/components/StaffForm';
import EmptyState from '@/components/EmptyState';
import type { Inquiry, Handover } from '@/types';

const workStatusOptions: WorkStatus[] = ['稼働中', '休憩中', '本日休み', '停止中'];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Staff | null>(null);
  const [detailTarget, setDetailTarget] = useState<Staff | null>(null);
  const [staffInquiries, setStaffInquiries] = useState<Inquiry[]>([]);
  const [staffHandovers, setStaffHandovers] = useState<Handover[]>([]);

  useEffect(() => { setStaff(getStaff()); }, []);

  const save = (list: Staff[]) => { setStaff(list); saveStaff(list); };

  const handleCreate = (data: Omit<Staff, 'id' | 'todayCount' | 'monthCount'>) => {
    save([...staff, { id: generateId('S'), todayCount: 0, monthCount: 0, ...data }]);
    setShowCreate(false);
  };

  const handleEdit = (data: Omit<Staff, 'id' | 'todayCount' | 'monthCount'>) => {
    if (!editTarget) return;
    save(staff.map((s) => s.id === editTarget.id ? { ...editTarget, ...data } : s));
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('削除してもよいですか？')) return;
    save(staff.filter((s) => s.id !== id));
    setDetailTarget(null);
  };

  const handleStatusChange = (id: string, status: WorkStatus) => {
    save(staff.map((s) => s.id === id ? { ...s, workStatus: status } : s));
  };

  const openDetail = (s: Staff) => {
    setDetailTarget(s);
    const inqs = getInquiries();
    const hvrs = getHandovers();
    setStaffInquiries(inqs.filter((i) => i.assignedStaffId === s.id));
    setStaffHandovers(hvrs.filter((h) => h.targetStaffId === s.id || h.createdById === s.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">全{staff.length}名</p>
        <button onClick={() => setShowCreate(true)} className="btn-primary w-full sm:w-auto">＋ スタッフ追加</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.length === 0 ? (
          <div className="col-span-3"><EmptyState message="スタッフがいません" icon="👤" /></div>
        ) : (
          staff.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 cursor-pointer hover:shadow-md transition-all"
              onClick={() => openDetail(s)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.role}</p>
                  </div>
                </div>
                <StatusBadge status={s.workStatus} size="sm" />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-blue-600">{s.todayCount}</p>
                  <p className="text-xs text-slate-400">本日</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-slate-700">{s.monthCount}</p>
                  <p className="text-xs text-slate-400">今月</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs text-slate-400 mb-1.5">稼働ステータス変更</p>
                <select
                  value={s.workStatus}
                  onChange={(e) => handleStatusChange(s.id, e.target.value as WorkStatus)}
                  className="form-input text-xs py-1"
                >
                  {workStatusOptions.map((ws) => <option key={ws}>{ws}</option>)}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="スタッフ追加" size="md">
        <StaffForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="スタッフ編集" size="md">
        {editTarget && (
          <StaffForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>

      <Modal isOpen={!!detailTarget} onClose={() => setDetailTarget(null)} title="スタッフ詳細" size="lg">
        {detailTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex flex-shrink-0 items-center justify-center text-blue-700 text-xl font-bold">
                {detailTarget.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-xl font-bold text-slate-900">{detailTarget.name}</h3>
                <p className="break-words text-sm text-slate-500">{detailTarget.role} · {detailTarget.email}</p>
                <div className="mt-1"><StatusBadge status={detailTarget.workStatus} size="sm" /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">{detailTarget.todayCount}</p>
                <p className="text-xs text-slate-500 mt-1">本日の対応件数</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-slate-700">{detailTarget.monthCount}</p>
                <p className="text-xs text-slate-500 mt-1">今月の対応件数</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">担当問い合わせ ({staffInquiries.length}件)</h4>
              <div className="space-y-1.5">
                {staffInquiries.slice(0, 5).map((i) => (
                  <div key={i.id} className="flex flex-wrap items-center gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                    <span className="font-mono text-slate-400">{i.id}</span>
                    <span className="font-medium text-slate-700">{i.customerName}</span>
                    <StatusBadge status={i.status} size="sm" />
                    <span className="text-slate-400 sm:ml-auto">{i.receivedAt.slice(0, 10)}</span>
                  </div>
                ))}
                {staffInquiries.length > 5 && <p className="text-xs text-slate-400 text-center">他 {staffInquiries.length - 5}件</p>}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button className="btn-danger text-sm" onClick={() => handleDelete(detailTarget.id)}>削除</button>
              <button className="btn-primary" onClick={() => { setEditTarget(detailTarget); setDetailTarget(null); }}>編集する</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
