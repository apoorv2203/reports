import { useState } from 'react';
import { FileOutput, Save, X } from 'lucide-react';

export function ActionsPanel({ onConvertToReport }: { onConvertToReport: () => void }) {
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
          <h2 className="font-display text-sm font-bold text-navy-900">Actions</h2>
          <p className="mt-1 text-[11px] leading-4 text-ink-500">Save or convert this result</p>
        </div>

        <button
          type="button"
          onClick={onConvertToReport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d1d1f] px-3 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black"
        >
          <FileOutput className="h-4 w-4" />
          Convert to report
        </button>

        <button
          type="button"
          onClick={() => setShowWidgetModal(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-700 transition hover:border-mint-300 hover:bg-mint-50 hover:text-navy-900"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
      </aside>

      {showWidgetModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/30 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowWidgetModal(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="save-widget-title" className="w-full max-w-md rounded-lg border border-surface-200 bg-white p-5 shadow-floaty">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="save-widget-title" className="font-display text-[18px] font-bold text-navy-900">Save as widget</h2>
                <p className="mt-1 text-[12px] text-ink-500">What would you like to save?</p>
              </div>
              <button type="button" onClick={() => setShowWidgetModal(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition hover:bg-surface-100 hover:text-navy-900" aria-label="Close save as widget dialog"><X className="h-4 w-4" /></button>
            </div>

            <fieldset className="mt-5 flex flex-col gap-2.5">
              <legend className="sr-only">Choose a result to save</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-200 p-3 transition has-[:checked]:border-navy-900 has-[:checked]:bg-surface-50">
                <input type="radio" name="widget-result" value="table" checked={widgetType === 'table'} onChange={() => setWidgetType('table')} className="mt-0.5 accent-[#1d1d1f]" />
                <span><span className="block text-[13px] font-semibold text-navy-900">Table</span><span className="mt-0.5 block text-[12px] text-ink-500">Top 5 products by approval rate</span></span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-200 p-3 transition has-[:checked]:border-navy-900 has-[:checked]:bg-surface-50">
                <input type="radio" name="widget-result" value="chart" checked={widgetType === 'chart'} onChange={() => setWidgetType('chart')} className="mt-0.5 accent-[#1d1d1f]" />
                <span><span className="block text-[13px] font-semibold text-navy-900">Chart</span><span className="mt-0.5 block text-[12px] text-ink-500">Approval rate by product</span></span>
              </label>
            </fieldset>

            <label htmlFor="widget-name" className="mt-5 block text-[12px] font-semibold text-navy-900">Widget name</label>
            <input id="widget-name" value={widgetName} onChange={(event) => setWidgetName(event.target.value)} placeholder="Enter a name for your widget" className="mt-2 w-full rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-[13px] text-navy-900 outline-none transition placeholder:text-ink-300 focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10" />

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowWidgetModal(false)} className="rounded-lg border border-surface-200 px-3.5 py-2 text-[12px] font-semibold text-ink-700 transition hover:bg-surface-50">Cancel</button>
              <button type="button" onClick={saveWidget} disabled={!widgetName.trim()} className="rounded-lg bg-[#1d1d1f] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">Save widget</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
