'use client';

import { useState, type ReactNode } from 'react';
import { ChevronLeft, Database, ListChecks, Activity, ShieldCheck } from 'lucide-react';

type AdminSection = 'tables' | 'audit' | 'traceability' | 'policies';

export function AdminShell({ section, onNavigate, children }: { section: AdminSection; onNavigate: (section: AdminSection) => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const resizeSidebar = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const move = (moveEvent: PointerEvent) => setSidebarWidth(Math.min(360, Math.max(180, moveEvent.clientX)));
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop);
  };
  const groups = [
    { label: 'DATA GOVERNANCE', items: [['tables', 'Tables & Columns', Database], ['audit', 'Audit Trail', ListChecks]] as const },
    { label: 'AI OBSERVABILITY', items: [['traceability', 'AI Traceability', Activity]] as const },
    { label: 'COMPLIANCE', items: [['policies', 'Policy Packs', ShieldCheck]] as const },
  ];
  return <div className="flex min-h-0 flex-1 bg-white text-navy-900"><aside style={{ width: collapsed ? 56 : sidebarWidth }} className="relative flex shrink-0 flex-col border-r border-surface-200 py-5 transition-[width] duration-200"><div role="separator" aria-label="Resize admin sidebar" onPointerDown={resizeSidebar} className="absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize hover:bg-blue-100" /><button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand admin navigation' : 'Collapse admin navigation'} className="mb-6 flex size-9 items-center justify-center self-end rounded-lg text-blue-900 hover:bg-blue-50"><ChevronLeft className={`size-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} /></button>{groups.map((group) => <div key={group.label} className="mb-7">{!collapsed && <p className="mb-2 px-3 text-[10px] font-bold tracking-wide text-ink-500">{group.label}</p>}<div className="flex flex-col gap-1">{group.items.map(([id, label, Icon]) => <button key={id} type="button" onClick={() => onNavigate(id)} aria-label={label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold ${section === id ? 'bg-blue-50 text-blue-700' : 'text-blue-900 hover:bg-surface-50'} ${collapsed ? 'justify-center px-0' : ''}`}><Icon className="size-4 shrink-0" />{!collapsed && label}</button>)}</div></div>)}</aside><main className="min-w-0 flex-1 overflow-hidden">{children}</main></div>;
}
