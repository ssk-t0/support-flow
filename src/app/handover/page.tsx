'use client';
import { useEffect, useState } from 'react';
import type { Handover } from '@/types';
import { getHandovers, saveHandovers, getStaff, getCurrentUser, formatDateTime, generateId, now } from '@/lib/storage';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import Modal from '@/components/Modal';
import SearchInput from '@/components/SearchInput';
import FilterSelect from '@/components/FilterSelect';
import HandoverForm from '@/components/HandoverForm';
import EmptyState from '@/components/EmptyState';

export default function HandoverPage() {
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState('');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStaff, setFilterStaff] = useState('');
  const [showUnconfirmedOnly, setShowUnconfirmedOnly] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Handover | null>(null);
  const [detailTarget, setDetailTarget] = useState<Handover | null>(null);

  useEffect(() => {
    setHandovers(getHandovers());
    const staff = getStaff();
    setStaffMap(Object.fromEntries(staff.map((s) => [s.id, s.name])));
    const user = getCurrentUser();
    if (user) setCurrentUserId(user.id);
  }, []);

  const save = (list: Handover[]) => { setHandovers(list); saveHandovers(list); };

  const handleCreate = (data: Omit<Handover, 'id' | 'createdAt'>) => {
    save([{ id: generateId('H'), createdAt: now(), ...data }, ...handovers]);
    setShowCreate(false);
  };

  const handleEdit = (data: Omit<Handover, 'id' | 'createdAt'>) => {
    if (!editTarget) return;
    save(handovers.map((h) => h.id === editTarget.id ? { ...editTarget, ...data } : h));
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('削除してもよいですか？')) return;
    save(handovers.filter((h) => h.id !== id));
    setDetailTarget(null);
  };

  const markConfirmed = (id: string) => {
    save(handovers.map((h) => h.id === id ? { ...h, status: '確認済み' } : h));
    setDetailTarget((prev) => prev ? { ...prev, status: '確認済み' } : null);
  };

  const filtered = handovers.filter((h) => {
    if (search && !h.subject.includes(search) && !h.relatedCustomerName.includes(search)) return false;
    if (filterPriority && h.priority !== filterPriority) return false;
    if (filterCategory && h.category !== filterCategory) return false;
    if (filterStaff && h.targetStaffId !== filterStaff) return false;
    if (showUnconfirmedOnly && h.status !== '未確認') return false;
    return true;
  });

  const staffOptions = Object.entries(staffMap).map(([id, name]) => ({ value: id, label: name }));
  const unconfirmedCount = handovers.filter((h) => h.status === '未確認').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500">{filtered.length}件</p>
          {unconfirmedCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              未確認 {unconfirmedCount}件
            </span>
          )}
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary w-full sm:w-auto">＋ 申し送り作成</button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="件名・顧客名で検索" />
        <FilterSelect value={filterPriority} onChange={setFilterPriority}
          options={[{ value: '高', label: '高' }, { value: '中', label: '中' }, { value: '低', label: '低' }]}
          placeholder="重要度" />
        <FilterSelect value={filterCategory} onChange={setFilterCategory}
          options={['問い合わせ対応', '予約関連', '顧客対応', 'システム確認', 'その他'].map((c) => ({ value: c, label: c }))}
          placeholder="カテゴリ" />
        <FilterSelect value={filterStaff} onChange={setFilterStaff} options={staffOptions} placeholder="宛先スタッフ" />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
          <input type="checkbox" className="rounded" checked={showUnconfirmedOnly} onChange={(e) => setShowUnconfirmedOnly(e.target.checked)} />
          未確認のみ
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="申し送りはありません" icon="🔄" />
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => {
            const creator = staffMap[h.createdById] ?? h.createdById;
            const target = staffMap[h.targetStaffId] ?? h.targetStaffId;
            const isUnconfirmed = h.status === '未確認';
            return (
              <div
                key={h.id}
                className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition-all hover:shadow-md ${
                  isUnconfirmed && h.priority === '高'
                    ? 'border-red-300 bg-red-50/50'
                    : isUnconfirmed
                    ? 'border-yellow-200 bg-yellow-50/30'
                    : 'border-slate-100'
                }`}
                onClick={() => setDetailTarget(h)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <StatusBadge status={h.status} size="sm" />
                      <PriorityBadge priority={h.priority} />
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{h.category}</span>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${isUnconfirmed ? 'text-slate-900' : 'text-slate-700'}`}>{h.subject}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{h.body}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span>作成: {creator}</span>
                    <span>→</span>
                    <span className="font-medium text-slate-600">宛先: {target}</span>
                    {h.relatedCustomerName && <span>顧客: {h.relatedCustomerName}</span>}
                  </div>
                  <span className="text-xs text-slate-400">{formatDateTime(h.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="申し送り作成" size="lg">
        <HandoverForm currentUserId={currentUserId} onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="申し送り編集" size="lg">
        {editTarget && (
          <HandoverForm initial={editTarget} currentUserId={currentUserId} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>

      <Modal isOpen={!!detailTarget} onClose={() => setDetailTarget(null)} title="申し送り詳細" size="lg">
        {detailTarget && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <StatusBadge status={detailTarget.status} />
              <PriorityBadge priority={detailTarget.priority} />
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{detailTarget.category}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{detailTarget.subject}</h3>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><p className="form-label">作成者</p><p>{staffMap[detailTarget.createdById] ?? detailTarget.createdById}</p></div>
              <div><p className="form-label">宛先</p><p>{staffMap[detailTarget.targetStaffId] ?? detailTarget.targetStaffId}</p></div>
              <div><p className="form-label">作成日時</p><p>{formatDateTime(detailTarget.createdAt)}</p></div>
              {detailTarget.relatedCustomerName && (
                <div><p className="form-label">関連顧客</p><p>{detailTarget.relatedCustomerName}</p></div>
              )}
              {detailTarget.relatedInquiryId && (
                <div><p className="form-label">関連問い合わせ</p><p className="font-mono">{detailTarget.relatedInquiryId}</p></div>
              )}
            </div>
            <div>
              <p className="form-label">本文</p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{detailTarget.body}</div>
            </div>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row">
                <button className="btn-danger text-sm" onClick={() => handleDelete(detailTarget.id)}>削除</button>
                <button className="btn-secondary text-sm" onClick={() => { setEditTarget(detailTarget); setDetailTarget(null); }}>編集</button>
              </div>
              {detailTarget.status === '未確認' && (
                <button className="btn-primary" onClick={() => markConfirmed(detailTarget.id)}>確認済みにする</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
