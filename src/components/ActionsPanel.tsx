import { useState } from 'react';
import {
  Download,
  Share2,
  CalendarClock,
  Heart,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export function ActionsPanel() {
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto bg-surface-50 p-4">
      <div>
        <h2 className="font-display text-sm font-bold text-navy-900">Actions</h2>
        <p className="mt-1 text-[11px] leading-4 text-ink-500">Export, share or save this result</p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Export dropdown */}
        <div className="relative">
          <DropdownButton
            icon={<Download className="h-4 w-4" />}
            label="Export"
            open={exportOpen}
            onClick={() => {
              setExportOpen((v) => !v);
              setShareOpen(false);
            }}
          />
          {exportOpen && (
            <Menu>
              <MenuItem label="PDF" />
              <MenuItem label="HTML" />
            </Menu>
          )}
        </div>

        {/* Share dropdown */}
        <div className="relative">
          <DropdownButton
            icon={<Share2 className="h-4 w-4" />}
            label="Share"
            open={shareOpen}
            onClick={() => {
              setShareOpen((v) => !v);
              setExportOpen(false);
            }}
          />
          {shareOpen && (
            <Menu>
              <MenuItem label="Share with users" />
              <MenuItem label="Share via email" />
              <MenuItem label="Share via Teams" />
            </Menu>
          )}
        </div>

        <OutlineButton icon={<CalendarClock className="h-4 w-4" />} label="Schedule monthly" />
        <OutlineButton icon={<Heart className="h-4 w-4" />} label="Save to favourites" />
      </div>

      <div className="my-1 h-px bg-surface-200" />

      {/* data trust */}
      <div className="rounded-xl border border-surface-200 bg-white p-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-ink-700">
          <ShieldCheck className="h-4 w-4 text-mint-600" />
          Data trust
        </div>
        <div className="flex flex-col gap-1.5 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Response time</span>
            <span className="font-semibold text-ink-900">21.4s</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Integrity</span>
            <span className="inline-flex items-center gap-1 font-bold text-mint-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DropdownButton({
  icon,
  label,
  open,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-900 transition hover:border-mint-300 hover:bg-mint-50"
    >
      <span className="flex items-center gap-2 text-ink-700">
        {icon}
        {label}
      </span>
      <ChevronDown
        className={`h-4 w-4 text-ink-500 transition ${open ? 'rotate-180' : ''}`}
      />
    </button>
  );
}

function OutlineButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-700 transition hover:border-mint-300 hover:bg-mint-50 hover:text-mint-700">
      {icon}
      {label}
    </button>
  );
}

function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-surface-200 bg-white py-1 shadow-floaty">
      {children}
    </div>
  );
}

function MenuItem({ label }: { label: string }) {
  return (
    <button className="block w-full px-3 py-2 text-left text-[13px] font-medium text-ink-700 transition hover:bg-mint-50 hover:text-mint-700">
      {label}
    </button>
  );
}
