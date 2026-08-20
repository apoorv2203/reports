import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  AlignLeft,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Database,
  FileText,
  Layers3,
  LayoutList,
  ListFilter,
  TableProperties,
} from 'lucide-react';
import { reportRows, type ProductRow } from '@/data/reportData';

type SortKey = 'product' | 'rate';
type SortDirection = 'asc' | 'desc';

const resultDetails = [
  {
    label: 'Sources',
    summary: 'Lending production data joined with product reference data',
    count: '2 tables',
    icon: Database,
    items: ['Lending applications', 'Product catalogue'],
  },
  {
    label: 'Columns',
    summary: 'Product name, application outcome and calculated approval rate',
    count: '3 of 18',
    icon: TableProperties,
    items: ['Product', 'Application outcome', 'Approval rate'],
  },
  {
    label: 'Filters',
    summary: 'Applications received during August 2026',
    count: '1 rule',
    icon: ListFilter,
    items: ['Application date: 1–31 August 2026'],
  },
  {
    label: 'Grouped by',
    summary: 'Product, ranked by approval rate from highest to lowest',
    count: '1 level',
    icon: Layers3,
    items: ['Product', 'Top 5 results', 'Highest approval rate first'],
  },
];

export function CanvasPanel() {
  const [tab, setTab] = useState<'table' | 'chart'>('table');
  const [contextView, setContextView] = useState<'summary' | 'glance'>('glance');
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null);
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
        <section className="overflow-hidden rounded-lg border border-mint-200 bg-white shadow-[0_6px_20px_rgba(19,42,58,0.04)]">
          <div className="flex flex-col gap-3 border-b border-mint-100 bg-mint-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-200 text-navy-900"><FileText className="h-4 w-4" /></span>
              <div>
                <h2 className="font-display text-[14px] font-bold text-navy-900">What you’re looking at</h2>
                <p className="mt-0.5 text-[11px] text-ink-500">A business-friendly explanation of this result</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setContextView(contextView === 'glance' ? 'summary' : 'glance')}
              className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg px-1.5 py-1 text-[11px] font-medium text-ink-500 transition hover:bg-white/70 hover:text-navy-900 sm:self-auto"
              aria-label={contextView === 'glance' ? 'Switch to summary view' : 'Switch to at a glance view'}
              title={contextView === 'glance' ? 'Read as summary' : 'Show at a glance'}
            >
              {contextView === 'glance' ? <AlignLeft className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
              {contextView === 'glance' ? 'Summary' : 'At a glance'}
            </button>
          </div>
          {contextView === 'summary' ? (
            <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <p className="max-w-3xl text-[13px] leading-6 text-ink-700">
                  This result ranks the five best-performing products by approval rate for August 2026. It combines lending application records with the product catalogue, then calculates the share of approved applications for every product.
                </p>
                <p className="mt-2 text-[12px] leading-5 text-ink-500">
                  Each row represents one product. Results are ordered from the highest approval rate to the lowest, making it easy to compare conversion performance and identify the strongest products.
                </p>
              </div>
              <div className="rounded-xl border border-mint-200 bg-mint-50 px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-mint-700">How to read it</p>
                <p className="mt-1.5 text-[12px] font-medium leading-5 text-navy-900">Approval rate is approved applications divided by all applications received for that product.</p>
              </div>
            </div>
          ) : (
            <div className="grid divide-y divide-surface-200 md:grid-cols-2 md:divide-x md:divide-y-0">
              {resultDetails.map((detail, index) => {
                const Icon = detail.icon;
                const isExpanded = expandedDetail === detail.label;
                return (
                  <div key={detail.label} className={index > 1 ? 'border-t border-surface-200 md:border-t' : index === 1 ? 'md:border-l' : ''}>
                    <button
                      type="button"
                      onClick={() => setExpandedDetail(isExpanded ? null : detail.label)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-mint-50/60"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-mint-700"><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[12px] font-semibold text-ink-900">{detail.label}</span>
                          <span className="shrink-0 text-[10px] font-semibold text-ink-300">{detail.count}</span>
                        </span>
                        <span className="mt-1 block text-[11px] leading-4 text-ink-500">{detail.summary}</span>
                      </span>
                      <ChevronDown className={`mt-1 h-3.5 w-3.5 shrink-0 text-ink-300 transition ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-1.5 bg-surface-50 px-4 pb-3.5 pt-2">
                        {detail.items.map((item) => <span key={item} className="rounded-full border border-surface-200 bg-white px-2.5 py-1 text-[11px] font-medium text-navy-900">{item}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink-700">Results</h2>
          <div className="inline-flex rounded-lg bg-surface-100 p-0.5">
            <button
              onClick={() => setTab('table')}
              className={`rounded-md px-3 py-1 text-[12px] font-semibold transition ${
                tab === 'table'
                  ? 'bg-white text-navy-900 shadow-[0_1px_2px_rgba(19,42,58,0.08)]'
                  : 'text-ink-500 hover:text-navy-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setTab('chart')}
              className={`rounded-md px-3 py-1 text-[12px] font-semibold transition ${
                tab === 'chart'
                  ? 'bg-white text-navy-900 shadow-[0_1px_2px_rgba(19,42,58,0.08)]'
                  : 'text-ink-500 hover:text-navy-900'
              }`}
            >
              Chart
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex-1 overflow-auto rounded-lg border border-surface-200 bg-white shadow-[0_3px_12px_rgba(19,42,58,0.04)]">
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
        <tr className="border-b border-surface-200 bg-surface-50">
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
        {rows.map((row) => (
          <tr
            key={row.product}
            className="border-b border-surface-100 transition-colors last:border-0 hover:bg-surface-50"
          >
            <td className="px-5 py-3.5 font-semibold text-navy-900">{row.product}</td>
            <td className="px-5 py-3.5 text-right">
              <span
                className={`inline-flex items-center justify-end gap-1.5 font-semibold tabular-nums ${
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
    <th className={`px-5 py-3 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-300 ${
          active ? 'text-navy-900' : 'text-ink-500 hover:text-navy-900'
        } ${align === 'right' ? 'flex-row-reverse' : ''}`}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <Icon className={`h-3.5 w-3.5 ${active ? 'text-mint-600' : 'text-ink-300'}`} />
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
