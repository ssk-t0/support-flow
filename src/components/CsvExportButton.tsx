'use client';

interface Props {
  data: Record<string, string | number>[];
  filename?: string;
  label?: string;
}

function toCsv(data: Record<string, string | number>[]): string {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const v = String(row[h] ?? '');
      return v.includes(',') || v.includes('"') || v.includes('\n')
        ? `"${v.replace(/"/g, '""')}"`
        : v;
    }).join(',')
  );
  return '﻿' + [headers.join(','), ...rows].join('\n');
}

export default function CsvExportButton({ data, filename = 'export.csv', label = 'CSVエクスポート' }: Props) {
  const handleExport = () => {
    const csv = toCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
      <span>⬇</span>
      {label}
    </button>
  );
}
