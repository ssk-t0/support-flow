'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCurrentUser } from '@/lib/storage';
import { demoUsers } from '@/lib/sampleData';

const DEMO_ACCOUNTS = [
  { email: 'admin@example.com', password: 'password', label: '管理者', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { email: 'staff@example.com', password: 'password', label: 'スタッフ', color: 'bg-green-50 border-green-200 text-green-700' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = demoUsers.find((u) => u.email === email && password === 'password');
      if (user) {
        saveCurrentUser(user);
        router.push('/');
      } else {
        setError('メールアドレスまたはパスワードが正しくありません');
        setLoading(false);
      }
    }, 500);
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    const user = demoUsers.find((u) => u.email === demoEmail);
    if (user) {
      saveCurrentUser(user);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">SF</span>
          </div>
          <h1 className="text-3xl font-bold text-white">SupportFlow</h1>
          <p className="text-blue-200 text-sm mt-2">問い合わせ対応管理システム</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">ログイン</h2>

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="form-label">メールアドレス</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                required
              />
            </div>
            <div>
              <label className="form-label">パスワード</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-base disabled:opacity-60"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              デモアカウント（クリックでログイン）
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc.email)}
                  className={`w-full text-left border rounded-xl p-3 transition-all hover:shadow-sm ${acc.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider">{acc.label}</span>
                      <p className="text-xs mt-0.5 opacity-80">{acc.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-60">パスワード</p>
                      <p className="text-xs font-mono font-semibold">password</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          © 2026 SupportFlow. デモ版 - データはブラウザに保存されます
        </p>
      </div>
    </div>
  );
}
