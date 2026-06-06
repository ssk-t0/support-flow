'use client';
import { useState } from 'react';
import type { Handover, Priority, HandoverCategory } from '@/types';
import { getStaff } from '@/lib/storage';

const categories: HandoverCategory[] = ['問い合わせ対応', '予約関連', '顧客対応', 'システム確認', 'その他'];
const priorities: Priority[] = ['高', '中', '低'];

interface Props {
  initial?: Partial<Handover>;
  currentUserId: string;
  onSubmit: (data: Omit<Handover, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function HandoverForm({ initial, currentUserId, onSubmit, onCancel }: Props) {
  const staff = getStaff();
  const [form, setForm] = useState({
    createdById: initial?.createdById ?? currentUserId,
    targetStaffId: initial?.targetStaffId ?? '',
    category: (initial?.category ?? '問い合わせ対応') as HandoverCategory,
    priority: (initial?.priority ?? '中') as Priority,
    subject: initial?.subject ?? '',
    body: initial?.body ?? '',
    status: (initial?.status ?? '未確認') as Handover['status'],
    relatedCustomerName: initial?.relatedCustomerName ?? '',
    relatedInquiryId: initial?.relatedInquiryId ?? '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">宛先スタッフ <span className="text-red-500">*</span></label>
          <select className="form-input" value={form.targetStaffId} onChange={(e) => set('targetStaffId', e.target.value)} required>
            <option value="">選択してください</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">カテゴリ</label>
          <select className="form-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">重要度</label>
          <select className="form-input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
            {priorities.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">確認状態</label>
          <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="未確認">未確認</option>
            <option value="確認済み">確認済み</option>
          </select>
        </div>
      </div>
      <div>
        <label className="form-label">件名 <span className="text-red-500">*</span></label>
        <input className="form-input" value={form.subject} onChange={(e) => set('subject', e.target.value)} required />
      </div>
      <div>
        <label className="form-label">本文 <span className="text-red-500">*</span></label>
        <textarea className="form-input" rows={5} value={form.body} onChange={(e) => set('body', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">関連顧客名</label>
          <input className="form-input" value={form.relatedCustomerName} onChange={(e) => set('relatedCustomerName', e.target.value)} />
        </div>
        <div>
          <label className="form-label">関連問い合わせID</label>
          <input className="form-input" value={form.relatedInquiryId} onChange={(e) => set('relatedInquiryId', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">キャンセル</button>
        <button type="submit" className="btn-primary">保存する</button>
      </div>
    </form>
  );
}
