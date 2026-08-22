'use client';

import { Info, LockKeyhole, Pencil, Table2, X } from 'lucide-react';

type Props = { onClose: () => void; onEdit?: () => void; onViewAccess?: () => void };

export function TableSummaryDrawer({ onClose, onEdit, onViewAccess }: Props) {
  const overview = [['Description', 'Branch master data'], ['Total Columns', '23'], ['Parameterizable Columns', '8'], ['PII Columns', '2'], ['Restricted', 'Yes'], ['Status', 'Active']];
  return <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[520px] flex-col rounded-l-2xl border-l border-surface-200 bg-white shadow-[-10px_0_30px_rgba(15,35,55,0.12)]">
    <header className="flex items-center justify-between border-b border-surface-200 px-7 py-6"><div className="flex items-center gap-3"><Table2 className="size-7 text-navy-900" /><h2 className="font-display text-[20px] font-bold">Table Summary</h2></div><button type="button" onClick={onClose} aria-label="Close table summary"><X className="size-6" /></button></header>
    <div className="flex-1 overflow-y-auto px-7 py-6"><div className="flex items-center justify-between"><h3 className="font-display text-[18px] font-bold">public.branch</h3><button type="button" onClick={onEdit} className="flex items-center gap-2 text-[14px] font-bold text-blue-600"><Pencil className="size-4" />Edit</button></div>
      <section className="mt-10"><h3 className="font-display text-[18px] font-bold">Overview</h3><div className="mt-6 flex flex-col gap-5 text-[14px]">{overview.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4"><span className="text-ink-500">{label}</span><span className={`text-right font-semibold ${value === 'Yes' ? 'text-red-600' : value === 'Active' ? 'text-green-600' : 'text-navy-900'}`}>{value}</span></div>)}</div></section>
      <section className="mt-8 border-t border-surface-200 pt-8"><h3 className="flex items-center gap-3 font-display text-[18px] font-bold"><LockKeyhole className="size-6" />Table Access</h3><div className="mt-6 flex items-center justify-between text-[14px]"><span className="text-ink-500">Roles</span><strong>3 Roles</strong></div><div className="mt-5 flex flex-col gap-4 text-[14px] text-blue-700"><button type="button" className="text-left">Data Analyst</button><button type="button" className="text-left">Branch Manager</button><button type="button" className="text-left">Reporting User</button><button type="button" onClick={onViewAccess} className="text-left font-semibold text-blue-600">View all</button></div></section>
      <section className="mt-8 border-t border-surface-200 pt-8"><h3 className="flex items-center gap-3 font-display text-[18px] font-bold"><Info className="size-6" />Properties</h3><div className="mt-6 flex flex-col gap-5 text-[14px]">{[['Owner', 'data_admin'], ['Source', 'PostgreSQL'], ['Last Refreshed', '22 Aug 2026 09:30 AM'], ['Refresh Frequency', 'Daily']].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4"><span className="text-ink-500">{label}</span><span className="text-right font-semibold">{value}</span></div>)}</div></section>
    </div>
  </aside>;
}
