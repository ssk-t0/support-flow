'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/types';
import { getCurrentUser, clearCurrentUser, initializeSampleData } from '@/lib/storage';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initializeSampleData();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    if (!currentUser && pathname !== '/login') {
      router.replace('/login');
    }
    if (currentUser && pathname === '/login') {
      router.replace('/');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="md:ml-60">
        <Header />
        <main className="min-h-screen pt-14 pb-20 md:pb-0">
          <div className="p-4 sm:p-5 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
