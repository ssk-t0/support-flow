'use client';
import { useEffect, useState } from 'react';
import type { ResponseTemplate, TemplateCategory } from '@/types';
import { getTemplates, saveTemplates, generateId, now, formatDate } from '@/lib/storage';
import Modal from '@/components/Modal';
import SearchInput from '@/components/SearchInput';
import FilterSelect from '@/components/FilterSelect';
import TemplateForm from '@/components/TemplateForm';
import EmptyState from '@/components/EmptyState';

const categoryColors: Record<string, string> = {
  '初回案内': 'bg-blue-100 text-blue-700',
  '予約確認': 'bg-green-100 text-green-700',
  'キャンセル案内': 'bg-red-100 text-red-700',
  '料金案内': 'bg-yellow-100 text-yellow-700',
  '営業時間案内': 'bg-purple-100 text-purple-700',
  'お礼': 'bg-pink-100 text-pink-700',
  'その他': 'bg-slate-100 text-slate-600',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<ResponseTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => { setTemplates(getTemplates()); }, []);

  const save = (list: ResponseTemplate[]) => { setTemplates(list); saveTemplates(list); };

  const handleCreate = (data: Omit<ResponseTemplate, 'id' | 'usageCount' | 'updatedAt'>) => {
    save([{ id: generateId('T'), usageCount: 0, updatedAt: now(), ...data }, ...templates]);
    setShowCreate(false);
  };

  const handleEdit = (data: Omit<ResponseTemplate, 'id' | 'usageCount' | 'updatedAt'>) => {
    if (!editTarget) return;
    save(templates.map((t) => t.id === editTarget.id ? { ...editTarget, ...data, updatedAt: now() } : t));
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('削除してもよいですか？')) return;
    save(templates.filter((t) => t.id !== id));
  };

  const handleCopy = (t: ResponseTemplate) => {
    navigator.clipboard.writeText(t.body).then(() => {
      setCopiedId(t.id);
      save(templates.map((tmpl) => tmpl.id === t.id ? { ...tmpl, usageCount: tmpl.usageCount + 1 } : tmpl));
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filtered = templates.filter((t) => {
    if (search && !t.title.includes(search) && !t.body.includes(search)) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    return true;
  });

  const categories: TemplateCategory[] = ['初回案内', '予約確認', 'キャンセル案内', '料金案内', '営業時間案内', 'お礼', 'その他'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{filtered.length}件</p>
        <button onClick={() => setShowCreate(true)} className="btn-primary">＋ 新規テンプレート</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="タイトル・本文で検索" />
        <FilterSelect value={filterCategory} onChange={setFilterCategory}
          options={categories.map((c) => ({ value: c, label: c }))} placeholder="カテゴリ" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="テンプレートはありません" icon="✉️" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm">{t.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[t.category] ?? 'bg-slate-100 text-slate-600'}`}>
                      {t.category}
                    </span>
                    <span className="text-xs text-slate-400">使用 {t.usageCount}回</span>
                    <span className="text-xs text-slate-400">{formatDate(t.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-slate-50 rounded-xl p-3 mb-4 min-h-[80px]">
                <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed line-clamp-5">{t.body}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditTarget(t)}>編集</button>
                  <button className="text-xs text-red-500 hover:underline" onClick={() => handleDelete(t.id)}>削除</button>
                </div>
                <button
                  onClick={() => handleCopy(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    copiedId === t.id
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copiedId === t.id ? '✓ コピーしました' : '📋 コピーする'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="テンプレート作成" size="lg">
        <TemplateForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="テンプレート編集" size="lg">
        {editTarget && (
          <TemplateForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>
    </div>
  );
}
