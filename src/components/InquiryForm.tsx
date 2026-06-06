'use client';
import { useState } from 'react';
import type { Inquiry, InquiryStatus, InquiryType, Priority } from '@/types';
import { getStaff } from '@/lib/storage';

const inquiryTypes: InquiryType[] = ['予約相談', '料金確認', 'キャンセル', '変更依頼', 'サービス内容確認', 'その他'];
const statuses: InquiryStatus[] = ['未対応', '対応中', '完了', '保留'];
const priorities: Priority[] = ['高', '中', '低'];

interface Props {
  initial?: Partial<Inquiry>;
  onSubmit: (data: Omit<Inquiry, 'id' | 'receivedAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function InquiryForm({ initial, onSubmit, onCancel }: Props) {
  const staff = getStaff();
  const [form, setForm] = useState({
    customerName: initial?.customerName ?? '',
    contact: initial?.contact ?? '',
    type: (initial?.type ?? '予約相談') as InquiryType,
    status: (initial?.status ?? '未対応') as InquiryStatus,
    priority: (initial?.priority ?? '中') as Priority,
    assignedStaffId: initial?.assignedStaffId ?? '',
    content: initial?.content ?? '',
    memo: initial?.memo ?? '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">顧客名 <span className="text-red-500">*</span></label>
          <input className="form-input" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} required />
        </div>
        <div>
          <label className="form-label">連絡先</label>
          <input className="form-input" value={form.contact} onChange={(e) => set('contact', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label">種別</label>
          <select className="form-input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            {inquiryTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">ステータス</label>
          <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">優先度</label>
          <select className="form-input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
            {priorities.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="form-label">担当スタッフ</label>
        <select className="form-input" value={form.assignedStaffId} onChange={(e) => set('assignedStaffId', e.target.value)}>
          <option value="">未割り当て</option>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">問い合わせ内容 <span className="text-red-500">*</span></label>
        <textarea className="form-input" rows={4} value={form.content} onChange={(e) => set('content', e.target.value)} required />
      </div>
      <div>
        <label className="form-label">対応メモ</label>
        <textarea className="form-input" rows={3} value={form.memo} onChange={(e) => set('memo', e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">キャンセル</button>
        <button type="submit" className="btn-primary">保存する</button>
      </div>
    </form>
  );
}
