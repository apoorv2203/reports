import { useState } from 'react';
import { CalendarClock, Check, MessageCircle, Pencil } from 'lucide-react';

const runDetails = [
  { label: 'Based on', chips: ['Loans, customers and branches'] },
  {
    label: 'Includes only',
    chips: ['Corporate customers', 'Balance over 500K', 'Excludes written-off', 'Delinquent only'],
  },
  { label: 'Showing', chips: ['Branch', 'Risk level', 'Outstanding balance'] },
  { label: 'Grouped', chips: ['By branch, then risk level'] },
];

export function ChatPanel() {
  const [hasRun, setHasRun] = useState(false);

  return (
    <aside className="flex h-full flex-col overflow-y-auto bg-[#f5f5f7] p-4">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-ink-700">
          Prompt
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mint-700">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
          Active
        </span>
      </div>

      <div className="mt-5 flex justify-end">
        <div className="max-w-[94%] rounded-[20px] rounded-br-[6px] bg-navy-900 px-4 py-3 text-[13px] font-medium leading-relaxed text-white shadow-soft">
          Top 5 products by approval rate
        </div>
      </div>

      <div className="mt-5 rounded-[18px] border border-[#c3dcf7] bg-[#d9eaff] p-3.5 shadow-[0_8px_24px_rgba(32,89,150,0.06)]">
        <div className="flex items-center gap-2 font-display text-[16px] font-bold tracking-[-0.02em] text-[#174f91]">
          <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.3} />
          About to run this
        </div>

        <div className="mt-4 flex flex-col gap-3.5">
          {runDetails.map((detail) => (
            <div key={detail.label} className="flex items-start gap-2.5">
              <span className="w-[74px] shrink-0 pt-1 text-[12px] font-bold leading-tight text-[#174f91]">
                {detail.label}
              </span>
              <div className="flex flex-1 flex-wrap gap-1.5">
                {detail.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium leading-tight text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#ffdda0] px-3 py-2.5 text-[12px] font-semibold leading-snug text-[#774b05]">
          <CalendarClock className="h-4 w-4 shrink-0" />
          Comparing this Q2 to Q2 last year
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setHasRun(true)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-[14px] px-3.5 py-2.5 text-[13px] font-semibold transition hover:-translate-y-0.5 ${
            hasRun
              ? 'bg-mint-500 text-navy-900 shadow-soft'
              : 'bg-[#1d1d1f] text-white shadow-soft hover:bg-black'
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
          {hasRun ? 'Queued' : 'Run it'}
        </button>
        <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[14px] border border-[#d2d2d7] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#1d1d1f] transition hover:-translate-y-0.5 hover:border-[#a1a1a6] hover:bg-[#fafafa]">
          <Pencil className="h-4 w-4" />
          Change something
        </button>
      </div>
    </aside>
  );
}
