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
import { useT } from '@/providers/I18nProvider';

type ContextView = 'summary' | 'glance';

export function ChatPanel({ empty = false, paneControl, initialQuestion = '' }: { empty?: boolean; paneControl?: React.ReactNode; initialQuestion?: string }) {
  const t = useT();
  const [contextView, setContextView] = useState<ContextView>('glance');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const runDetails = [
    {
      label: t('chat.sources'),
      summary: t('chat.sourcesSummary'),
      count: t('chat.3tables'),
      icon: Database,
      items: [t('chat.lmsProdLoans'), t('chat.crmCustomers'), t('chat.networkBranches')],
    },
    {
      label: t('chat.columns'),
      summary: t('chat.columnsSummary'),
      count: t('chat.3of24'),
      icon: TableProperties,
      items: [t('chat.branchName'), t('chat.riskLevel'), t('chat.outstandingBalance'), t('chat.customerType'), t('chat.loanStatus'), t('chat.delinquencyDays')],
    },
    {
      label: t('chat.filters'),
      summary: t('chat.filtersSummary'),
      count: t('chat.4rules'),
      icon: ListFilter,
      items: [t('chat.corporateCustomers'), t('chat.balanceOver500K'), t('chat.excludesWrittenOff'), t('chat.delinquentOnly')],
    },
    {
      label: t('chat.groupedBy'),
      summary: t('chat.groupedSummary'),
      count: t('chat.2levels'),
      icon: Layers3,
      items: [t('chat.branch'), t('chat.riskLevel')],
    },
  ];

  return (
    <aside className="flex h-full min-h-0 flex-col bg-surface-50">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold text-navy-900">{t('chat.yourRequest')}</h2>
          {paneControl}
        </div>
          {!empty && <div className="mt-4 rounded-2xl rounded-br-md border border-surface-200 bg-white px-4 py-3 text-[13px] font-medium leading-6 text-ink-700">{initialQuestion || t('chat.fallbackQuestion')}</div>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section className="overflow-hidden rounded-lg border border-mint-200 bg-white shadow-chat-detail">
          <div className="flex items-center justify-between gap-2 border-b border-mint-100 bg-mint-50 px-3 py-2">
            <div className="flex items-center gap-2 text-navy-900">
              <MessageCircle className="h-4 w-4 text-mint-600" strokeWidth={2.2} />
              <h3 className="font-display text-[13px] font-bold">{t('chat.aboutThisRun')}</h3>
            </div>
            <button
              type="button"
              onClick={() => setContextView(contextView === 'glance' ? 'summary' : 'glance')}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-medium text-ink-500 transition hover:bg-white/70 hover:text-navy-900"
              aria-label={contextView === 'glance' ? t('chat.switchToSummary') : t('chat.switchToGlance')}
              title={contextView === 'glance' ? t('chat.readAsSummary') : t('chat.showAtAGlance')}
            >
              {contextView === 'glance' ? <AlignLeft className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
              {contextView === 'glance' ? t('chat.summary') : t('chat.atAGlance')}
            </button>
          </div>

          {contextView === 'summary' ? (
            <div className="px-4 py-4">
              <p className="text-[13px] leading-6 text-ink-700">
                {t('chat.summaryText')}
              </p>
              <div className="mt-3 rounded-xl bg-surface-50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-300">{t('chat.yourIntent')}</p>
                <p className="mt-1 text-[12px] font-medium leading-5 text-navy-900">{t('chat.intentText')}</p>
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-300">{t('chat.comparison')}</p>
                <p className="mt-1 text-[12px] font-medium text-ink-700">{t('chat.comparisonText')}</p>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="border-t border-surface-200 bg-white p-4">
        <div className="rounded-2xl border border-surface-200 bg-white p-2 transition focus-within:border-mint-300 focus-within:shadow-textarea-focus">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing || event.keyCode === 229) return;
              if (event.key === 'Enter' && !event.shiftKey) event.preventDefault();
            }}
            rows={2}
            placeholder={t('chat.askPlaceholder')}
            className="w-full resize-none rounded-xl bg-transparent px-2 py-1.5 text-[13px] leading-5 text-ink-900 outline-none placeholder:text-ink-300"
          />
          <div className="flex items-center justify-between px-1 pt-1.5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-medium text-ink-500 transition hover:bg-mint-50 hover:text-navy-900"
            >
              <Check className="h-3.5 w-3.5 text-mint-600" strokeWidth={2.5} />
              {t('chat.runIt')}
            </button>
            <button
              disabled={message.trim().length === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-400 text-navy-900 transition hover:bg-mint-300 disabled:cursor-not-allowed disabled:bg-surface-200 disabled:text-ink-300"
              aria-label={t('chat.sendMessage')}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
