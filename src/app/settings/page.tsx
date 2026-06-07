'use client';
import { useEffect, useState } from 'react';
import type { Settings } from '@/types';
import { getSettings, saveSettings, getTemplates } from '@/lib/storage';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    businessName: '',
    businessHours: '',
    closedDays: '',
    notificationEmail: '',
    targetResponseTime: 24,
    autoReplyTemplateId: '',
    itemsPerPage: 20,
  });
  const [templates, setTemplates] = useState<{ id: string; title: string }[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setTemplates(getTemplates().map((t) => ({ id: t.id, title: t.title })));
  }, []);

  const set = (k: keyof Settings, v: string | number) => setSettings((s) => ({ ...s, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card">
          <h2 className="text-sm font-bold text-slate-800 mb-4">基本設定</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">事業者名</label>
              <input className="form-input" value={settings.businessName} onChange={(e) => set('businessName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">受付時間</label>
              <input className="form-input" value={settings.businessHours} onChange={(e) => set('businessHours', e.target.value)}
                placeholder="例: 平日 9:00〜18:00" />
            </div>
            <div>
              <label className="form-label">定休日</label>
              <input className="form-input" value={settings.closedDays} onChange={(e) => set('closedDays', e.target.value)}
                placeholder="例: 日曜日・祝日" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-bold text-slate-800 mb-4">通知・対応設定</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">通知メールアドレス</label>
              <input type="email" className="form-input" value={settings.notificationEmail}
                onChange={(e) => set('notificationEmail', e.target.value)} />
            </div>
            <div>
              <label className="form-label">対応目標時間（時間）</label>
              <input type="number" className="form-input" value={settings.targetResponseTime}
                onChange={(e) => set('targetResponseTime', Number(e.target.value))} min={1} />
              <p className="text-xs text-slate-400 mt-1">問い合わせ受付から目標とする対応完了時間</p>
            </div>
            <div>
              <label className="form-label">自動返信テンプレート</label>
              <select className="form-input" value={settings.autoReplyTemplateId}
                onChange={(e) => set('autoReplyTemplateId', e.target.value)}>
                <option value="">使用しない</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-bold text-slate-800 mb-4">表示設定</h2>
          <div>
            <label className="form-label">一覧の表示件数</label>
            <select className="form-input" value={settings.itemsPerPage}
              onChange={(e) => set('itemsPerPage', Number(e.target.value))}>
              {[10, 20, 30, 50].map((n) => <option key={n} value={n}>{n}件</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button type="submit" className="btn-primary px-8">設定を保存する</button>
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              ✓ 保存しました
            </span>
          )}
        </div>
      </form>

      <div className="mt-8 card border-red-100">
        <h2 className="text-sm font-bold text-red-700 mb-2">デモデータのリセット</h2>
        <p className="text-xs text-slate-500 mb-3">
          すべてのデータを削除して、初期サンプルデータに戻します。ページをリロードすると再投入されます。
        </p>
        <button
          type="button"
          className="btn-danger w-full text-sm sm:w-auto"
          onClick={() => {
            if (confirm('すべてのデータを削除してリセットしますか？この操作は元に戻せません。')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          データをリセットする
        </button>
      </div>
    </div>
  );
}
