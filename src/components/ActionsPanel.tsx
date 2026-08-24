import { useState } from 'react';
import { FileOutput, Save, X } from 'lucide-react';
import { useT } from '@/providers/I18nProvider';

export function ActionsPanel({ onConvertToReport, disabled = false }: { onConvertToReport: () => void; disabled?: boolean }) {
  const t = useT();
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [widgetType, setWidgetType] = useState<'table' | 'chart'>('table');
  const [widgetName, setWidgetName] = useState('');

  function saveWidget() {
    if (!widgetName.trim()) return;
    setShowWidgetModal(false);
    setWidgetName('');
  }

  return (
    <>
      <aside className="flex h-full flex-col gap-3 overflow-y-auto bg-surface-50 p-4">
        <div>
          <h2 className="font-display text-sm font-bold text-navy-900">{t('actions.title')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-ink-500">{t('actions.subtitle')}</p>
        </div>

        <button
          type="button"
          onClick={onConvertToReport}
          disabled={disabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-button-dark px-3 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black"
        >
          <FileOutput className="h-4 w-4" />
          {t('actions.convertToReport')}
        </button>

        <button
          type="button"
          onClick={() => setShowWidgetModal(true)}
          disabled={disabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-700 transition hover:border-mint-300 hover:bg-mint-50 hover:text-navy-900"
        >
          <Save className="h-4 w-4" />
          {t('actions.save')}
        </button>
      </aside>

      {showWidgetModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay-light p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowWidgetModal(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="save-widget-title" className="w-full max-w-md rounded-lg border border-surface-200 bg-white p-5 shadow-floaty">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="save-widget-title" className="font-display text-[18px] font-bold text-navy-900">{t('actions.saveAsWidget')}</h2>
                <p className="mt-1 text-[12px] text-ink-500">{t('actions.saveSubtitle')}</p>
              </div>
              <button type="button" onClick={() => setShowWidgetModal(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition hover:bg-surface-100 hover:text-navy-900" aria-label={t('actions.closeDialog')}><X className="h-4 w-4" /></button>
            </div>

            <fieldset className="mt-5 flex flex-col gap-2.5">
              <legend className="sr-only">{t('actions.chooseResult')}</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-200 p-3 transition has-[:checked]:border-navy-900 has-[:checked]:bg-surface-50">
                <input type="radio" name="widget-result" value="table" checked={widgetType === 'table'} onChange={() => setWidgetType('table')} className="mt-0.5 accent-button-dark" />
                <span><span className="block text-[13px] font-semibold text-navy-900">{t('actions.table')}</span><span className="mt-0.5 block text-[12px] text-ink-500">{t('actions.tableDesc')}</span></span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-200 p-3 transition has-[:checked]:border-navy-900 has-[:checked]:bg-surface-50">
                <input type="radio" name="widget-result" value="chart" checked={widgetType === 'chart'} onChange={() => setWidgetType('chart')} className="mt-0.5 accent-button-dark" />
                <span><span className="block text-[13px] font-semibold text-navy-900">{t('actions.chart')}</span><span className="mt-0.5 block text-[12px] text-ink-500">{t('actions.chartDesc')}</span></span>
              </label>
            </fieldset>

            <label htmlFor="widget-name" className="mt-5 block text-[12px] font-semibold text-navy-900">{t('actions.widgetName')}</label>
            <input id="widget-name" value={widgetName} onChange={(event) => setWidgetName(event.target.value)} placeholder={t('actions.widgetNamePlaceholder')} className="mt-2 w-full rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-[13px] text-navy-900 outline-none transition placeholder:text-ink-300 focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10" />

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowWidgetModal(false)} className="rounded-lg border border-surface-200 px-3.5 py-2 text-[12px] font-semibold text-ink-700 transition hover:bg-surface-50">{t('common.cancel')}</button>
              <button type="button" onClick={saveWidget} disabled={!widgetName.trim()} className="rounded-lg bg-button-dark px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">{t('actions.saveWidget')}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
