import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { reportRows, type ProductRow } from '@/data/reportData';

type SortKey = 'product' | 'rate';
type SortDirection = 'asc' | 'desc';

export function CanvasPanel({ onBuildAReport }: { onBuildAReport: () => void }) {
  const [tab, setTab] = useState<'table' | 'chart'>('table');
  const [contextView, setContextView] = useState<'summary' | 'glance'>('summary');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'rate',
    direction: 'desc',
  });

  const sortedRows = useMemo(() => {
    return [...reportRows].sort((a, b) => {
      const comparison = sort.key === 'rate'
        ? a.rate - b.rate
        : a.product.localeCompare(b.product);
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [sort]);

  function handleSort(key: SortKey) {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  return (
    <section className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-[12px] border border-[#e5e5e7] bg-[#f5f5f7] p-1">
            <button
              onClick={() => setTab('table')}
              className={`rounded-[9px] px-3.5 py-1.5 text-[13px] font-semibold transition ${
                tab === 'table'
                  ? 'bg-[#1d1d1f] text-white shadow-soft'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setTab('chart')}
              className={`rounded-[9px] px-3.5 py-1.5 text-[13px] font-semibold transition ${
                tab === 'chart'
                  ? 'bg-[#1d1d1f] text-white shadow-soft'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              Chart
            </button>
          </div>

          <button
            onClick={onBuildAReport}
            className="inline-flex items-center gap-1.5 rounded-full bg-mint-400 px-4 py-2 text-[13px] font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:bg-mint-300 hover:shadow-soft"
          >
            Build a report
            <ChevronUp className="h-3.5 w-3.5 rotate-90" />
          </button>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-mint-200 bg-white shadow-[0_6px_20px_rgba(19,42,58,0.04)]">
          <div className="flex flex-col gap-3 border-b border-mint-100 bg-mint-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-200 text-navy-900"><FileText className="h-4 w-4" /></span>
              <div>
                <h2 className="font-display text-[14px] font-bold text-navy-900">What you’re looking at</h2>
                <p className="mt-0.5 text-[11px] text-ink-500">A business-friendly explanation of this result</p>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-2 rounded-xl border border-mint-200 bg-white/80 p-1" role="tablist" aria-label="Result explanation view">
              {(['summary', 'glance'] as const).map((view) => (
                <button key={view} type="button" role="tab" aria-selected={contextView === view} onClick={() => setContextView(view)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${contextView === view ? 'bg-navy-900 text-white shadow-soft' : 'text-ink-500 hover:text-navy-900'}`}>
                  {view === 'summary' ? 'Summary' : 'At a glance'}
                </button>
              ))}
            </div>
          </div>
          {contextView === 'summary' ? (
            <div className="px-4 py-4">
              <p className="max-w-3xl text-[13px] leading-6 text-ink-700">
                This result ranks the five best-performing products by approval rate for August 2026. It uses lending production data, calculates the share of approved applications for each product, and orders the results from highest to lowest so you can quickly identify which products are converting most successfully.
              </p>
              <p className="mt-2 text-[12px] leading-5 text-ink-500">
                Each row represents one product. The approval rate is the number of approved applications divided by all applications received for that product during the selected period.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 px-4 py-3 text-[12px] sm:flex-row sm:flex-wrap sm:gap-x-6">
              <ExplRow label="Based on" chips={['Lending production data', 'August 2026']} />
              <ExplRow label="Showing" chips={['Product', 'Approval rate']} />
              <ExplRow label="Ordered by" chips={['Highest approval rate first', 'Top 5']} />
            </div>
          )}
        </section>

        <div className="mt-4 flex-1 overflow-auto rounded-2xl border border-surface-200 shadow-[0_3px_12px_rgba(19,42,58,0.04)]">
          {tab === 'table' ? (
            <ReportTable rows={sortedRows} sort={sort} onSort={handleSort} />
          ) : (
            <ChartPlaceholder rows={sortedRows} />
          )}
        </div>
      </div>
    </section>
  );
}

function ExplRow({ label, chips }: { label: string; chips: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-0.5 shrink-0 text-[11px] font-semibold text-ink-500">{label}</span>
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full border border-surface-200 bg-surface-50 px-2.5 py-1 text-[11px] font-medium text-navy-900"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function ReportTable({
  rows,
  sort,
  onSort,
}: {
  rows: ProductRow[];
  sort: { key: SortKey; direction: SortDirection };
  onSort: (key: SortKey) => void;
}) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="bg-navy-900 text-white">
          <SortableHeader
            label="Product"
            sortKey="product"
            sort={sort}
            onSort={onSort}
            align="left"
          />
          <SortableHeader
            label="Approval rate (%)"
            sortKey="rate"
            sort={sort}
            onSort={onSort}
            align="right"
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={row.product}
            className={`transition-colors hover:bg-mint-50 ${
              index % 2 === 1 ? 'bg-surface-50' : 'bg-white'
            }`}
          >
            <td className="px-4 py-3 font-medium text-ink-900">{row.product}</td>
            <td className="px-4 py-3 text-right font-semibold">
              <span
                className={`inline-flex items-center justify-end gap-1.5 ${
                  row.flagged ? 'text-red-600' : 'text-ink-900'
                }`}
              >
                {row.rate.toFixed(2)}
                {row.flagged && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  align,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; direction: SortDirection };
  onSort: (key: SortKey) => void;
  align: 'left' | 'right';
}) {
  const active = sort.key === sortKey;
  const Icon = active ? (sort.direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`px-4 py-2.5 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1.5 font-semibold transition hover:text-mint-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-300 ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <Icon className={`h-3.5 w-3.5 ${active ? 'text-mint-300' : 'text-white/55'}`} />
      </button>
    </th>
  );
}

function ChartPlaceholder({ rows }: { rows: ProductRow[] }) {
  const max = Math.max(...rows.map((row) => row.rate));
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      {rows.map((row) => (
        <div key={row.product} className="flex items-center gap-3">
          <div className="w-40 shrink-0 truncate text-[12px] font-medium text-ink-700">
            {row.product}
          </div>
          <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-surface-100">
            <div
              className={`h-full rounded-md ${row.flagged ? 'bg-red-400/80' : 'bg-mint-400'}`}
              style={{ width: `${Math.max((row.rate / max) * 100, 8)}%` }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-ink-900">
              {row.rate.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
