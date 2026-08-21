import { useState } from 'react';
import { Bell, ChevronDown, Clock3, FileText, Grid2x2X as Grid2X2, Chrome as Home, LogOut, Search } from 'lucide-react';
import { LogoMark, Wordmark } from './Logo';

type TopNavProps = {
  onOpenHome: () => void;
  onOpenReports: () => void;
  onOpenSessions: () => void;
  userName: string;
  userInitials: string;
  onSignOut: () => void;
};

export function TopNav({ onOpenHome, onOpenReports, onOpenSessions, userName, userInitials, onSignOut }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex min-h-16 shrink-0 items-center gap-4 border-b border-surface-200 bg-white px-4 text-navy-900 shadow-[0_1px_2px_rgba(19,42,58,0.04)] sm:px-5">
      <button type="button" onClick={onOpenHome} className="flex shrink-0 items-center gap-2"><LogoMark /><Wordmark /></button>
      <span className="hidden h-5 w-px bg-surface-200 lg:block" />
      <button type="button" onClick={onOpenHome} className="hidden items-center gap-2 text-[12px] font-bold text-navy-900 lg:inline-flex"><Home className="h-3.5 w-3.5" /> Home <ChevronDown className="h-3.5 w-3.5" /></button>
      <label className="mx-auto hidden min-w-0 max-w-[470px] flex-1 items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2 text-ink-300 md:flex"><Search className="h-4 w-4 shrink-0" /><span className="sr-only">Search</span><input className="min-w-0 flex-1 bg-transparent text-[12px] text-navy-900 outline-none placeholder:text-ink-500" placeholder="Search for reports, widgets, or ask anything..." /><kbd className="rounded bg-surface-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500">⌘ K</kbd></label>
      <nav className="ml-auto flex items-center gap-2 sm:gap-3">
        <button type="button" onClick={onOpenSessions} className="hidden items-center gap-1.5 text-[12px] font-bold text-navy-900 hover:text-mint-700 sm:inline-flex"><Clock3 className="h-4 w-4" /> Sessions</button>
        <button type="button" className="hidden items-center gap-1.5 text-[12px] font-bold text-navy-900 hover:text-mint-700 lg:inline-flex"><Grid2X2 className="h-4 w-4" /> Widgets</button>
        <button type="button" onClick={onOpenReports} className="hidden items-center gap-1.5 text-[12px] font-bold text-navy-900 hover:text-mint-700 sm:inline-flex"><FileText className="h-4 w-4" /> Reports</button>
        <button type="button" className="relative flex h-8 w-8 items-center justify-center rounded-full text-navy-900 hover:bg-surface-50" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" /></button>
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-500 text-[11px] font-bold text-white">{userInitials}</span>
            <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-surface-200 bg-white py-1 shadow-floaty">
                <div className="border-b border-surface-100 px-3 py-2">
                  <div className="text-[12px] font-bold text-navy-900">{userName}</div>
                  <div className="mt-0.5 text-[11px] text-ink-500">Signed in</div>
                </div>
                <button type="button" onClick={() => { setMenuOpen(false); onSignOut(); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-semibold text-red-600 transition hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign out</button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
