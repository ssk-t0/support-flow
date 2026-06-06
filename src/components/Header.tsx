'use client';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/': 'ダッシュボード',
  '/inquiries': '問い合わせ管理',
  '/templates': '返信テンプレート',
  '/handover': '業務申し送り',
  '/customers': '顧客管理',
  '/staff': 'スタッフ管理',
  '/reports': 'レポート',
  '/settings': '設定',
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'SupportFlow';
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 right-0 left-60 z-20">
      <h1 className="text-base font-bold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400">{today}</span>
        <div className="w-2 h-2 rounded-full bg-green-400" title="接続中" />
      </div>
    </header>
  );
}
