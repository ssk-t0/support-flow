'use client';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthMap = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-t-lg shadow-xl w-full ${widthMap[size]} max-h-[92vh] flex flex-col sm:rounded-lg sm:max-h-[90vh]`}>
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 sm:p-6">
          <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-1 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
