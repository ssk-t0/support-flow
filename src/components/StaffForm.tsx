'use client';
import { useState } from 'react';
import type { Staff, WorkStatus } from '@/types';

const workStatuses: WorkStatus[] = ['稼働中', '休憩中', '本日休み', '停止中'];

interface Props {
  initial?: Partial<Staff>;
  onSubmit: (data: Omit<Staff, 'id' | 'todayCount' | 'monthCount'>) => void;
  onCancel: () => void;
}

export default function StaffForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    role: initial?.role ?? 'スタッフ',
    email: initial?.email ?? '',
    workStatus: (initial?.workStatus ?? '稼働中') as WorkStatus,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="form-label">氏名 <span className="text-red-500">*</span></label>
        <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label">役職</label>
          <input className="form-input" value={form.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div>
          <label className="form-label">稼働ステータス</label>
          <select className="form-input" value={form.workStatus} onChange={(e) => set('workStatus', e.target.value)}>
            {workStatuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="form-label">メールアドレス</label>
        <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
      </div>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">キャンセル</button>
        <button type="submit" className="btn-primary">保存する</button>
      </div>
    </form>
  );
}
