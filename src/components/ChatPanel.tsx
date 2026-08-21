import { useState } from 'react';
import {
  AlignLeft,
  Check,
  ChevronDown,
  Database,
  Layers3,
  LayoutList,
  ListFilter,
  MessageCircle,
  Send,
  TableProperties,
} from 'lucide-react';

const runDetails = [
  {
    label: 'Sources',
    summary: 'Loans, customers and branches',
    count: '3 tables',
    icon: Database,
    items: ['LMS_PROD.loans', 'CRM.customers', 'NETWORK.branches'],
  },
  {
    label: 'Columns',
    summary: 'Branch, risk level and outstanding balance',
    count: '3 of 24',
    icon: TableProperties,
    items: ['Branch name', 'Risk level', 'Outstanding balance', 'Customer type', 'Loan status', 'Delinquency days'],
  },
  {
    label: 'Filters',
    summary: 'Corporate, balance over 500K and 2 more',
    count: '4 rules',
    icon: ListFilter,
    items: ['Corporate customers', 'Balance over 500K', 'Excludes written-off', 'Delinquent only'],
  },
  {
    label: 'Grouped by',
    summary: 'Branch, then risk level',
    count: '2 levels',
    icon: Layers3,
    items: ['Branch', 'Risk level'],
  },
];

type ContextView = 'summary' | 'glance';

export function ChatPanel({ empty = false }: { empty?: boolean }) {
  const [contextView, setContextView] = useState<ContextView>('glance');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  return (
    <aside className="flex h-full min-h-0 flex-col bg-surface-50">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold text-navy-900">Your request</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-2.5 py-1 text-[11px] font-semibold text-mint-700">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
            Ready
          </span>
        </div>
          {!empty && <div className="mt-4 rounded-2xl rounded-br-md border border-surface-200 bg-white px-4 py-3 text-[13px] font-medium leading-6 text-ink-700">Top 5 products by approval rate</div>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section className="overflow-hidden rounded-lg border border-mint-200 bg-white shadow-[0_8px_24px_rgba(19,42,58,0.05)]">
          <div className="flex items-center justify-between gap-2 border-b border-mint-100 bg-mint-50 px-3 py-2">
            <div className="flex items-center gap-2 text-navy-900">
              <MessageCircle className="h-4 w-4 text-mint-600" strokeWidth={2.2} />
              <h3 className="font-display text-[13px] font-bold">About this run</h3>
            </div>
            <button
              type="button"
              onClick={() => setContextView(contextView === 'glance' ? 'summary' : 'glance')}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-medium text-ink-500 transition hover:bg-white/70 hover:text-navy-900"
              aria-label={contextView === 'glance' ? 'Switch to summary view' : 'Switch to at a glance view'}
              title={contextView === 'glance' ? 'Read as summary' : 'Show at a glance'}
            >
              {contextView === 'glance' ? <AlignLeft className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
              {contextView === 'glance' ? 'Summary' : 'At a glance'}
            </button>
          </div>

          {contextView === 'summary' ? (
            <div className="px-4 py-4">
              <p className="text-[13px] leading-6 text-ink-700">
                You asked to see the five products with the highest approval rate. This run compares the current quarter with the same quarter last year and presents the strongest performers first.
              </p>
              <div className="mt-3 rounded-xl bg-surface-50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-300">Your intent</p>
                <p className="mt-1 text-[12px] font-medium leading-5 text-navy-900">Rank product performance and highlight the top five results.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="divide-y divide-surface-200">
                {runDetails.map((detail) => {
                  const isExpanded = expanded === detail.label;
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label}>
                      <button type="button" onClick={() => setExpanded(isExpanded ? null : detail.label)} className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-mint-50/60" aria-expanded={isExpanded}>
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2"><span className="text-[12px] font-semibold text-ink-900">{detail.label}</span><span className="shrink-0 text-[10px] font-semibold text-ink-300">{detail.count}</span></span>
                          <span className="mt-1 block text-[11px] leading-4 text-ink-500">{detail.summary}</span>
                        </span>
                        <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-ink-300 transition ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && <div className="flex flex-wrap gap-1.5 bg-surface-50 px-4 pb-3.5 pt-1">{detail.items.map((item) => <span key={item} className="rounded-full border border-surface-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-700">{item}</span>)}</div>}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-surface-200 bg-surface-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-300">Comparison</p>
                <p className="mt-1 text-[12px] font-medium text-ink-700">This Q2 compared with Q2 last year</p>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="border-t border-surface-200 bg-white p-4">
        <div className="rounded-2xl border border-surface-200 bg-white p-2 transition focus-within:border-mint-300 focus-within:shadow-[0_8px_24px_rgba(19,42,58,0.08)]">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing || event.keyCode === 229) return;
              if (event.key === 'Enter' && !event.shiftKey) event.preventDefault();
            }}
            rows={2}
            placeholder="Ask to change something, e.g. include only Q2 data…"
            className="w-full resize-none rounded-xl bg-transparent px-2 py-1.5 text-[13px] leading-5 text-ink-900 outline-none placeholder:text-ink-300"
          />
          <div className="flex items-center justify-between px-1 pt-1.5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-medium text-ink-500 transition hover:bg-mint-50 hover:text-navy-900"
            >
              <Check className="h-3.5 w-3.5 text-mint-600" strokeWidth={2.5} />
              Run it
            </button>
            <button
              disabled={message.trim().length === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-400 text-navy-900 transition hover:bg-mint-300 disabled:cursor-not-allowed disabled:bg-surface-200 disabled:text-ink-300"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
