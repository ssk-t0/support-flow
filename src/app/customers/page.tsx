'use client';
import { useEffect, useState } from 'react';
import type { Customer, CustomerTag } from '@/types';
import { getCustomers, saveCustomers, getInquiries, formatDate, generateId, now } from '@/lib/storage';
import Modal from '@/components/Modal';
import SearchInput from '@/components/SearchInput';
import FilterSelect from '@/components/FilterSelect';
import CustomerForm from '@/components/CustomerForm';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import type { Inquiry } from '@/types';

const tagColors: Record<CustomerTag, string> = {
  '新規': 'bg-blue-100 text-blue-700',
  'リピーター': 'bg-green-100 text-green-700',
  'VIP': 'bg-purple-100 text-purple-700',
  '対応注意': 'bg-red-100 text-red-700',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [detailTarget, setDetailTarget] = useState<Customer | null>(null);
  const [relatedInquiries, setRelatedInquiries] = useState<Inquiry[]>([]);

  useEffect(() => { setCustomers(getCustomers()); }, []);

  const save = (list: Customer[]) => { setCustomers(list); saveCustomers(list); };

  const handleCreate = (data: Omit<Customer, 'id' | 'inquiryCount' | 'lastInquiryDate'>) => {
    save([{ id: generateId('C'), inquiryCount: 0, lastInquiryDate: '', ...data }, ...customers]);
    setShowCreate(false);
  };

  const handleEdit = (data: Omit<Customer, 'id' | 'inquiryCount' | 'lastInquiryDate'>) => {
    if (!editTarget) return;
    save(customers.map((c) => c.id === editTarget.id ? { ...editTarget, ...data } : c));
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('削除してもよいですか？')) return;
    save(customers.filter((c) => c.id !== id));
    setDetailTarget(null);
  };

  const openDetail = (c: Customer) => {
    setDetailTarget(c);
    const all = getInquiries();
    setRelatedInquiries(all.filter((i) => i.customerName === c.name));
  };

  const filtered = customers.filter((c) => {
    if (search && !c.name.includes(search)) return false;
    if (filterTag && !c.tags.includes(filterTag as CustomerTag)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{filtered.length}件</p>
        <button onClick={() => setShowCreate(true)} className="btn-primary">＋ 顧客追加</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="顧客名で検索" />
        <FilterSelect value={filterTag} onChange={setFilterTag}
          options={(['新規', 'リピーター', 'VIP', '対応注意'] as CustomerTag[]).map((t) => ({ value: t, label: t }))}
          placeholder="タグ" />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">氏名</th>
                <th className="px-4 py-3 text-left">連絡先</th>
                <th className="px-4 py-3 text-left">タグ</th>
                <th className="px-4 py-3 text-left">問い合わせ回数</th>
                <th className="px-4 py-3 text-left">最終問い合わせ</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="顧客がいません" icon="👥" /></td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="table-row cursor-pointer" onClick={() => openDetail(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <div>{c.phone}</div>
                      <div>{c.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {c.tags.map((t) => (
                          <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[t]}`}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800">{c.inquiryCount}回</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{c.lastInquiryDate ? formatDate(c.lastInquiryDate) : '—'}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditTarget(c)}>編集</button>
                        <button className="text-xs text-red-500 hover:underline" onClick={() => handleDelete(c.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="顧客追加" size="md">
        <CustomerForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="顧客編集" size="md">
        {editTarget && (
          <CustomerForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>

      <Modal isOpen={!!detailTarget} onClose={() => setDetailTarget(null)} title="顧客詳細" size="lg">
        {detailTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
                {detailTarget.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{detailTarget.name}</h3>
                <div className="flex gap-1 mt-1">
                  {detailTarget.tags.map((t) => (
                    <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[t]}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="form-label">電話番号</p><p>{detailTarget.phone || '—'}</p></div>
              <div><p className="form-label">メールアドレス</p><p>{detailTarget.email || '—'}</p></div>
              <div><p className="form-label">問い合わせ回数</p><p className="font-bold text-blue-600">{detailTarget.inquiryCount}回</p></div>
              <div><p className="form-label">最終問い合わせ</p><p>{detailTarget.lastInquiryDate ? formatDate(detailTarget.lastInquiryDate) : '—'}</p></div>
            </div>

            {detailTarget.memo && (
              <div>
                <p className="form-label">メモ</p>
                <div className="bg-yellow-50 rounded-xl p-3 text-sm text-slate-700 border border-yellow-100">{detailTarget.memo}</div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3">問い合わせ履歴 ({relatedInquiries.length}件)</h4>
              {relatedInquiries.length === 0 ? (
                <p className="text-xs text-slate-400">問い合わせ履歴はありません</p>
              ) : (
                <div className="space-y-2">
                  {relatedInquiries.map((i) => (
                    <div key={i.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                      <span className="font-mono text-slate-400">{i.id}</span>
                      <StatusBadge status={i.status} size="sm" />
                      <span className="text-slate-600">{i.type}</span>
                      <span className="text-slate-400 ml-auto">{i.receivedAt.slice(0, 10)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button className="btn-primary" onClick={() => { setEditTarget(detailTarget); setDetailTarget(null); }}>編集する</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
