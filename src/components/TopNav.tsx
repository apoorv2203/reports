import { memo, useState } from 'react';
import { Bell, ChevronDown, Clock3, FileText, Grid2x2X as Grid2X2, Chrome as Home, LogOut, Settings } from 'lucide-react';
import { LogoMark, Wordmark } from './Logo';
import { useT } from '@/providers/I18nProvider';

function SessionCountdown({ seconds }: { seconds?: number }) {
  if (seconds === undefined) return null;
  const countdown = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  return <span className="hidden rounded-lg bg-surface-50 px-2.5 py-1 text-[11px] font-semibold text-ink-600 tabular-nums lg:inline-flex" style={{ minWidth: '95px' }}>Session {countdown}</span>;
}

const MemoizedSessionCountdown = memo(SessionCountdown);

type TopNavProps = {
  onOpenHome: () => void;
  onOpenReports: () => void;
  onOpenWidgets: () => void;
  onOpenSessions: () => void;
  userName: string;
  userEmail?: string;
  userRoles?: string[];
  userInitials: string;
  onSignOut: () => void;
  isAdmin: boolean;
  onOpenSettings: () => void;
  sessionSecondsLeft?: number;
};

export const TopNav = memo(function TopNav({ onOpenHome, onOpenReports, onOpenWidgets, onOpenSessions, userName, userEmail, userRoles = [], userInitials, onSignOut, isAdmin, onOpenSettings, sessionSecondsLeft }: TopNavProps) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex min-h-16 shrink-0 items-center gap-4 border-b border-surface-200 bg-white px-4 text-navy-900 shadow-soft sm:px-5">
      <button type="button" onClick={onOpenHome} className="flex shrink-0 items-center gap-2"><LogoMark /><Wordmark /></button>
      <span className="hidden h-5 w-px bg-surface-200 lg:block" />
      <button type="button" onClick={onOpenHome} className="hidden items-center gap-2 text-[12px] font-bold text-navy-900 lg:inline-flex"><Home className="h-3.5 w-3.5" /> {t('nav.home')} <ChevronDown className="h-3.5 w-3.5" /></button>
      <nav className="ml-auto flex items-center gap-2 sm:gap-3">
        <button type="button" onClick={onOpenSessions} className="hidden items-center gap-1.5 text-[12px] font-bold text-navy-900 hover:text-mint-700 sm:inline-flex"><Clock3 className="h-4 w-4" /> {t('nav.sessions')}</button>
        <button type="button" onClick={onOpenWidgets} className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-navy-900 transition hover:bg-mint-50 hover:text-mint-700 lg:inline-flex"><Grid2X2 className="h-4 w-4" /> {t('nav.widgets')}</button>
        <button type="button" onClick={onOpenReports} className="hidden items-center gap-1.5 text-[12px] font-bold text-navy-900 hover:text-mint-700 sm:inline-flex"><FileText className="h-4 w-4" /> {t('nav.reports')}</button>
        <MemoizedSessionCountdown seconds={sessionSecondsLeft} />
        <button type="button" className="relative flex h-8 w-8 items-center justify-center rounded-full text-navy-900 hover:bg-surface-50" aria-label={t('nav.notifications')}><Bell className="h-4 w-4" /><span className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" /></button>
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-500 text-[11px] font-bold text-white">{userInitials}</span>
            <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-lg border border-surface-200 bg-white py-1 shadow-floaty">
                <div className="border-b border-surface-100 px-3 py-2">
                  <div className="text-[12px] font-bold text-navy-900">{userName}</div>
                  <div className="mt-0.5 text-[11px] text-ink-500">{t('nav.signedIn')}</div>
                  {userEmail && <div className="mt-1 truncate text-[10px] text-ink-500">{userEmail}</div>}
                  {userRoles.length > 0 && <div className="mt-1 text-[10px] font-medium text-ink-600">{userRoles.join(', ')}</div>}
                </div>
                {isAdmin && <button type="button" onClick={() => { setMenuOpen(false); onOpenSettings(); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-semibold text-navy-900 transition hover:bg-surface-50"><Settings className="h-4 w-4" /> {t('nav.settings')}</button>}
                <button type="button" onClick={() => { setMenuOpen(false); onSignOut(); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-semibold text-red-600 transition hover:bg-red-50"><LogOut className="h-4 w-4" /> {t('nav.signOut')}</button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
});
