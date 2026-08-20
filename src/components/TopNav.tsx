import { Clock, Heart, FileText, ChevronRight } from 'lucide-react';
import { LogoMark, Wordmark } from './Logo';

export function TopNav({ onOpenReports }: { onOpenReports: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-200 bg-white px-4 text-navy-900 shadow-[0_1px_2px_rgba(19,42,58,0.04)]">
      <div className="flex items-center gap-3">
        <LogoMark />
        <Wordmark />
        <span className="h-5 w-px bg-surface-200" />
        <span className="hidden text-[13px] font-medium text-ink-500 lg:inline">
          Digital Banking · Reporting Workspace
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 px-3 py-1.5 text-[13px] font-medium text-ink-700 transition hover:border-mint-300 hover:bg-mint-50">
          <Clock className="h-3.5 w-3.5" />
          Sessions
        </button>

        <button className="relative inline-flex items-center gap-1.5 rounded-full border border-surface-200 px-3 py-1.5 text-[13px] font-medium text-ink-700 transition hover:border-mint-300 hover:bg-mint-50">
          <Heart className="h-3.5 w-3.5" />
          Favourites
          <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            47
          </span>
        </button>

        <span className="h-5 w-px bg-surface-200" />

        <button
          onClick={onOpenReports}
          className="inline-flex items-center gap-1.5 rounded-full border border-mint-300 bg-mint-50 px-3.5 py-1.5 text-[13px] font-semibold text-navy-900 transition hover:border-mint-400 hover:bg-mint-100"
        >
          <FileText className="h-3.5 w-3.5" />
          Reports
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-mint-400 text-[12px] font-bold text-navy-900 transition hover:bg-mint-300">
          RA
        </button>
      </div>
    </header>
  );
}
