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
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 md:left-60">
      <h1 className="truncate text-base font-bold text-slate-900">{title}</h1>
      <div className="ml-3 flex flex-shrink-0 items-center gap-3 sm:gap-4">
        <span className="hidden text-xs text-slate-400 sm:inline">{today}</span>
        <div className="w-2 h-2 rounded-full bg-green-400" title="接続中" />
      </div>
    </header>
  );
}
