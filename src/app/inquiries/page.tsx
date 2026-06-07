'use client';
import { useEffect, useState } from 'react';
import type { Inquiry, InquiryStatus, InquiryType, Priority } from '@/types';
import { getInquiries, saveInquiries, getStaff, formatDateTime, generateId, now } from '@/lib/storage';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import Modal from '@/components/Modal';
import SearchInput from '@/components/SearchInput';
import FilterSelect from '@/components/FilterSelect';
import InquiryForm from '@/components/InquiryForm';
import EmptyState from '@/components/EmptyState';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStaff, setFilterStaff] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Inquiry | null>(null);
  const [detailTarget, setDetailTarget] = useState<Inquiry | null>(null);

  useEffect(() => {
    setInquiries(getInquiries());
    const staff = getStaff();
    setStaffMap(Object.fromEntries(staff.map((s) => [s.id, s.name])));
  }, []);

  const save = (list: Inquiry[]) => { setInquiries(list); saveInquiries(list); };

  const handleCreate = (data: Omit<Inquiry, 'id' | 'receivedAt' | 'updatedAt'>) => {
    const newItem: Inquiry = { id: generateId('INQ'), receivedAt: now(), updatedAt: now(), ...data };
    save([newItem, ...inquiries]);
    setShowCreate(false);
  };

  const handleEdit = (data: Omit<Inquiry, 'id' | 'receivedAt' | 'updatedAt'>) => {
    if (!editTarget) return;
    save(inquiries.map((i) => i.id === editTarget.id ? { ...editTarget, ...data, updatedAt: now() } : i));
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('削除してもよいですか？')) return;
    save(inquiries.filter((i) => i.id !== id));
    setDetailTarget(null);
  };

  const filtered = inquiries.filter((i) => {
    if (search && !i.customerName.includes(search) && !i.id.includes(search)) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    if (filterType && i.type !== filterType) return false;
    if (filterPriority && i.priority !== filterPriority) return false;
    if (filterStaff && i.assignedStaffId !== filterStaff) return false;
    return true;
  });

  const staffOptions = Object.entries(staffMap).map(([id, name]) => ({ value: id, label: name }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{filtered.length}件表示 / 全{inquiries.length}件</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary w-full sm:w-auto">
          ＋ 新規問い合わせ
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="顧客名・IDで検索" />
          <FilterSelect value={filterStatus} onChange={setFilterStatus} options={[
            { value: '未対応', label: '未対応' }, { value: '対応中', label: '対応中' },
            { value: '完了', label: '完了' }, { value: '保留', label: '保留' },
          ]} placeholder="ステータス" />
          <FilterSelect value={filterType} onChange={setFilterType} options={[
            { value: '予約相談', label: '予約相談' }, { value: '料金確認', label: '料金確認' },
            { value: 'キャンセル', label: 'キャンセル' }, { value: '変更依頼', label: '変更依頼' },
            { value: 'サービス内容確認', label: 'サービス内容確認' }, { value: 'その他', label: 'その他' },
          ]} placeholder="種別" />
          <FilterSelect value={filterPriority} onChange={setFilterPriority} options={[
            { value: '高', label: '高' }, { value: '中', label: '中' }, { value: '低', label: '低' },
          ]} placeholder="優先度" />
          <FilterSelect value={filterStaff} onChange={setFilterStaff} options={staffOptions} placeholder="担当者" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">受付日時</th>
                <th className="px-4 py-3 text-left">顧客名</th>
                <th className="px-4 py-3 text-left">種別</th>
                <th className="px-4 py-3 text-left">ステータス</th>
                <th className="px-4 py-3 text-left">優先度</th>
                <th className="px-4 py-3 text-left">担当</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState message="問い合わせはありません" /></td></tr>
              ) : (
                filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`table-row cursor-pointer ${inq.status === '未対応' ? 'bg-red-50/50' : ''}`}
                    onClick={() => setDetailTarget(inq)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{inq.id}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(inq.receivedAt)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{inq.customerName}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{inq.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={inq.status} size="sm" /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={inq.priority} /></td>
                    <td className="px-4 py-3 text-xs text-slate-600">{staffMap[inq.assignedStaffId] ?? '未割当'}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditTarget(inq)}>編集</button>
                        <button className="text-xs text-red-500 hover:underline" onClick={() => handleDelete(inq.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="新規問い合わせ作成" size="lg">
        <InquiryForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="問い合わせ編集" size="lg">
        {editTarget && (
          <InquiryForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>

      <Modal isOpen={!!detailTarget} onClose={() => setDetailTarget(null)} title="問い合わせ詳細" size="lg">
        {detailTarget && (
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <StatusBadge status={detailTarget.status} />
              <PriorityBadge priority={detailTarget.priority} />
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{detailTarget.type}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div><p className="form-label">問い合わせID</p><p className="font-mono text-slate-700">{detailTarget.id}</p></div>
              <div><p className="form-label">受付日時</p><p className="text-slate-700">{formatDateTime(detailTarget.receivedAt)}</p></div>
              <div><p className="form-label">顧客名</p><p className="font-semibold text-slate-800">{detailTarget.customerName}</p></div>
              <div><p className="form-label">連絡先</p><p className="text-slate-700">{detailTarget.contact || '未記入'}</p></div>
              <div><p className="form-label">担当スタッフ</p><p className="text-slate-700">{staffMap[detailTarget.assignedStaffId] ?? '未割当'}</p></div>
              <div><p className="form-label">最終更新</p><p className="text-slate-700">{formatDateTime(detailTarget.updatedAt)}</p></div>
            </div>
            <div>
              <p className="form-label">問い合わせ内容</p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{detailTarget.content}</div>
            </div>
            {detailTarget.memo && (
              <div>
                <p className="form-label">対応メモ</p>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-blue-100">{detailTarget.memo}</div>
              </div>
            )}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <button className="btn-danger text-sm" onClick={() => handleDelete(detailTarget.id)}>削除</button>
              <button className="btn-primary" onClick={() => { setEditTarget(detailTarget); setDetailTarget(null); }}>編集する</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
