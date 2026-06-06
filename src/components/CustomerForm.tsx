'use client';
import { useState } from 'react';
import type { Customer, CustomerTag } from '@/types';

const allTags: CustomerTag[] = ['新規', 'リピーター', 'VIP', '対応注意'];

interface Props {
  initial?: Partial<Customer>;
  onSubmit: (data: Omit<Customer, 'id' | 'inquiryCount' | 'lastInquiryDate'>) => void;
  onCancel: () => void;
}

export default function CustomerForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    tags: initial?.tags ?? [] as CustomerTag[],
    memo: initial?.memo ?? '',
  });

  const toggleTag = (tag: CustomerTag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="form-label">氏名 <span className="text-red-500">*</span></label>
        <input className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">電話番号</label>
          <input className="form-input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
        <div>
          <label className="form-label">メールアドレス</label>
          <input type="email" className="form-input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="form-label">タグ</label>
        <div className="flex gap-2 flex-wrap mt-1">
          {allTags.map((tag) => {
            const tagColors: Record<CustomerTag, string> = {
              '新規': 'bg-blue-50 text-blue-700 border-blue-200',
              'リピーター': 'bg-green-50 text-green-700 border-green-200',
              'VIP': 'bg-purple-50 text-purple-700 border-purple-200',
              '対応注意': 'bg-red-50 text-red-700 border-red-200',
            };
            const isSelected = form.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  isSelected ? tagColors[tag] + ' ring-2 ring-offset-1' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="form-label">メモ</label>
        <textarea className="form-input" rows={3} value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">キャンセル</button>
        <button type="submit" className="btn-primary">保存する</button>
      </div>
    </form>
  );
}
