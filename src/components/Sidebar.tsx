'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'ダッシュボード', icon: '🏠' },
  { href: '/inquiries', label: '問い合わせ管理', icon: '📋' },
  { href: '/templates', label: '返信テンプレート', icon: '✉️' },
  { href: '/handover', label: '業務申し送り', icon: '🔄' },
  { href: '/customers', label: '顧客管理', icon: '👥' },
  { href: '/staff', label: 'スタッフ管理', icon: '👤', adminOnly: true },
  { href: '/reports', label: 'レポート', icon: '📊', adminOnly: true },
  { href: '/settings', label: '設定', icon: '⚙️', adminOnly: true },
];

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: Props) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user.role === 'admin'
  );

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 flex h-16 flex-col border-t border-slate-200 bg-white md:bottom-auto md:left-0 md:top-0 md:h-full md:w-60 md:border-r md:border-t-0">
      <div className="hidden p-5 border-b border-slate-100 md:block">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">SF</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">SupportFlow</p>
            <p className="text-xs text-slate-400">問い合わせ管理システム</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-x-auto overflow-y-hidden p-2 md:overflow-y-auto md:p-3">
        <p className="hidden text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2 md:block">メニュー</p>
        <ul className="flex min-w-max gap-1 md:block md:min-w-0 md:space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-link h-12 min-w-[72px] flex-col justify-center gap-1 px-2 py-1.5 text-[11px] md:h-auto md:min-w-0 md:flex-row md:justify-start md:gap-3 md:px-4 md:py-2.5 md:text-sm ${isActive ? 'active' : 'text-slate-600'}`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="max-w-[64px] truncate md:max-w-none">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="md:hidden">
            <button
              onClick={onLogout}
              className="sidebar-link h-12 min-w-[72px] flex-col justify-center gap-1 px-2 py-1.5 text-[11px] text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <span className="text-base leading-none">🚪</span>
              <span>ログアウト</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="hidden p-3 border-t border-slate-100 md:block">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role === 'admin' ? '管理者' : 'スタッフ'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left sidebar-link text-slate-500 hover:text-red-600 hover:bg-red-50"
        >
          <span>🚪</span>
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  );
}
