'use client';
import { useState } from 'react';
import type { ResponseTemplate, TemplateCategory } from '@/types';

const categories: TemplateCategory[] = ['初回案内', '予約確認', 'キャンセル案内', '料金案内', '営業時間案内', 'お礼', 'その他'];

interface Props {
  initial?: Partial<ResponseTemplate>;
  onSubmit: (data: Omit<ResponseTemplate, 'id' | 'usageCount' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TemplateForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    category: (initial?.category ?? '初回案内') as TemplateCategory,
    body: initial?.body ?? '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="form-label">タイトル <span className="text-red-500">*</span></label>
        <input className="form-input" value={form.title} onChange={(e) => set('title', e.target.value)} required />
      </div>
      <div>
        <label className="form-label">カテゴリ</label>
        <select className="form-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">本文 <span className="text-red-500">*</span></label>
        <textarea className="form-input" rows={10} value={form.body} onChange={(e) => set('body', e.target.value)} required />
      </div>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">キャンセル</button>
        <button type="submit" className="btn-primary">保存する</button>
      </div>
    </form>
  );
}
