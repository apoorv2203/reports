import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, ChartBar as BarChart3, BookOpen, Check, ChevronDown, FileText, MessageSquare, MoveHorizontal as MoreHorizontal, Pencil, Send, Sparkles, Table2, X } from 'lucide-react';
import { defaultReportParameters, type LibraryReport, type ReportParameter, type ReportTemplate, type TemplateSection } from '@/data/reportTemplates';
import { PublishReportDialog } from './PublishReportDialog';
import { ReportParameterRunner } from './ReportParameterRunner';
import { ResizableThreePane } from './ResizableThreePane';

export function ReportWorkspace({ template, report, onBack, onBrowseReports, readOnly = false }: { template: ReportTemplate; report?: LibraryReport; onBack: () => void; onBrowseReports: () => void; readOnly?: boolean }) {
  const [sections, setSections] = useState<TemplateSection[]>(template.sections);
  const [title, setTitle] = useState(report?.title ?? template.sections[0]?.title ?? 'Untitled report');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ prompt: string; result: string }[]>([]);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [publishedParameters, setPublishedParameters] = useState<ReportParameter[] | null>(null);

  const emptySections = useMemo(() => sections.filter((s) => s.kind === 'empty'), [sections]);

  function applyPrompt(value: string) {
    const text = value.trim();
    if (!text) return;
    const titleMatch = text.match(/(?:title|section 1)[^\"]*[\"]([^\"]+)[\"]/i);
    const chartMatch = text.match(/chart[^\d]*(\d+)/i);
    const tableMatch = text.match(/table[^\d]*(\d+)/i);
    let result = 'I added that to the report shell.';
    let nextSections = [...sections];
    if (titleMatch?.[1]) {
      setTitle(titleMatch[1]);
      nextSections = nextSections.map((section, index) => index === 0 ? { ...section, title: titleMatch[1]! } : section);
      result = 'Section 1 title updated';
    } else if (chartMatch?.[1]) {
      const target = Math.max(1, Number(chartMatch[1]) - 1);
      nextSections = nextSections.map((section, index) => index === target ? { ...section, kind: 'chart', body: 'Approval rate by product' } : section);
      result = `Chart added to section ${chartMatch[1]}`;
    } else if (tableMatch?.[1]) {
      const target = Math.max(1, Number(tableMatch[1]) - 1);
      nextSections = nextSections.map((section, index) => index === target ? { ...section, kind: 'table', body: 'Product performance detail' } : section);
      result = `Table added to section ${tableMatch[1]}`;
    } else if (/kpi|metric|number/i.test(text)) {
      const target = nextSections.findIndex((section, index) => index > 0 && section.kind === 'empty');
      if (target >= 0) nextSections[target] = { ...nextSections[target], kind: 'kpi', body: 'Outstanding balance · Loans · Year-over-year' };
      result = target >= 0 ? `KPI block added to section ${target + 1}` : 'KPI block added';
    } else if (/add|create|include/i.test(text) && emptySections.length > 0) {
      const target = nextSections.findIndex((section) => section.kind === 'empty');
      nextSections[target] = { ...nextSections[target], kind: 'table', body: 'New report detail' };
      result = `New content added to section ${target + 1}`;
    }
    setSections(nextSections);
    setMessages((current) => [...current, { prompt: text, result }]);
    setPrompt('');
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-200 bg-white px-5 text-navy-900 shadow-[0_1px_2px_rgba(19,42,58,0.04)]">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-mint-50 hover:text-navy-900"><ArrowLeft className="h-4 w-4" /></button>
          <span className="h-5 w-px bg-surface-200" />
          <span className="font-display text-[16px] font-bold text-navy-900">ReportIQ</span>
          <span className="text-ink-300">/</span>
          <span className="hidden text-[13px] text-ink-500 sm:inline">My reports</span>
          <span className="hidden text-ink-300 sm:inline">/</span>
          <span className="truncate text-[13px] font-semibold text-navy-900">{title}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${publishedParameters ? 'bg-mint-100 text-mint-700' : 'bg-amber-100 text-amber-800'}`}>{publishedParameters ? 'Published' : report?.published ? 'Catalogue' : 'Draft'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onBrowseReports} className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-navy-900 transition hover:bg-mint-50 hover:text-mint-700 sm:inline-flex"><BookOpen className="h-4 w-4" /> Reports</button>
          <button onClick={onBack} className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-mint-50 hover:text-navy-900"><X className="h-4 w-4" /></button>
        </div>
      </header>

      <ResizableThreePane
        leftLabel="Editing this report"
        rightLabel="Actions"
        left={
          <aside className={`flex h-full min-h-0 flex-col border-r border-[#e5e5e7] bg-[#f5f5f7] p-4 ${readOnly ? 'items-center justify-center' : ''}`}>
            {!readOnly && <div className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-ink-700"><MessageSquare className="h-4 w-4 text-mint-600" /> Editing this report</div>}
            {!readOnly && <div className="mt-4 flex-1 overflow-y-auto">
              {messages.length === 0 && <div className="rounded-[14px] border border-dashed border-[#d2d2d7] p-4 text-[12px] leading-relaxed text-ink-500">Tell ReportIQ what to change. Reference a section number to place content exactly where you want it.</div>}
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => <div key={`${message.prompt}-${index}`}><div className="rounded-[14px] bg-[#1d1d1f] px-3.5 py-3 text-[13px] font-medium leading-relaxed text-white">{message.prompt}</div><div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#174f91]"><Check className="h-3.5 w-3.5" />{message.result}</div></div>)}
              </div>
              <div className="mt-6 border-t border-[#e5e5e7] pt-4">
                <div className="text-[12px] font-bold text-ink-500">Try next</div>
                <div className="mt-2 flex flex-col gap-2">
                  {['Add a KPI block in section 2', 'Add a chart in section 3', 'Update the title in section 1 to "Q2 branch review"'].map((suggestion) => <button key={suggestion} onClick={() => applyPrompt(suggestion)} className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2.5 text-left text-[12px] font-medium text-ink-700 hover:border-mint-300 hover:bg-mint-50">{suggestion}</button>)}
                </div>
              </div>
            </div>}
            <div className="mt-3 rounded-[14px] border border-[#d2d2d7] bg-white p-2">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyPrompt(prompt); } }} placeholder="Ask to update a section..." rows={3} className="w-full resize-none bg-transparent px-2 py-1 text-[13px] text-ink-900 outline-none placeholder:text-ink-300" />
              <div className="flex items-center justify-between px-1"><span className="text-[10px] text-ink-300">Enter to send</span><button onClick={() => applyPrompt(prompt)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1f] text-white hover:bg-black"><Send className="h-3.5 w-3.5" /></button></div>
            </div>
          </aside>
        }
        center={
          <main className="h-full min-h-0 overflow-y-auto bg-white px-8 py-7">
            <div className="mx-auto max-w-2xl">
              <div className="mb-5 flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-300">{report ? 'Report view' : 'Report preview'}</div><h1 className="mt-1 font-display text-[25px] font-bold tracking-[-0.04em] text-ink-900">{title}</h1></div><button className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-[#f5f5f7]"><MoreHorizontal className="h-5 w-5" /></button></div>
              {readOnly && <ReportParameterRunner parameters={report?.parameters ?? defaultReportParameters} reportTitle={title} />}
              <div className="flex flex-col gap-4">{sections.map((section) => <ReportSectionCard key={`${section.id}-${section.kind}`} section={section} readOnly={readOnly} onEdit={(value) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, title: value } : item))} />)}</div>
            </div>
          </main>
        }
        right={
          <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto border-l border-[#e5e5e7] bg-[#f5f5f7] p-4">
            <div className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-ink-700">Actions</div>
            {!readOnly && <><button onClick={() => setShowPublishDialog(true)} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1d1d1f] px-3 py-2.5 text-[13px] font-bold text-white transition hover:bg-black"><ArrowUpRight className="h-4 w-4" /> Publish report</button>
            <p className="-mt-1 text-[11px] leading-4 text-ink-500">Publish this report to make it available in your reports library.</p></>}
            <div>
              <button type="button" onClick={() => setExportOpen((open) => !open)} className="flex w-full items-center gap-2 rounded-lg border border-[#e5e5e7] bg-white px-3 py-3 text-[13px] font-semibold text-ink-700 transition hover:border-mint-300 hover:bg-mint-50 hover:text-mint-700">
                <ArrowDownToLine className="h-4 w-4" />
                Export
                <ChevronDown className={`ml-auto h-4 w-4 text-ink-300 transition ${exportOpen ? 'rotate-180' : ''}`} />
              </button>
              {exportOpen && <div className="mt-1 flex flex-col gap-1 rounded-lg border border-[#e5e5e7] bg-white p-1">
                {['Export as Image', 'Export as JRXML', 'Export as PDF'].map((option) => <button key={option} type="button" className="rounded-md px-3 py-2 text-left text-[12px] font-medium text-ink-700 transition hover:bg-mint-50 hover:text-mint-700">{option}</button>)}
              </div>}
            </div>
            <div className={`my-2 h-px bg-[#e5e5e7] ${readOnly ? 'hidden' : ''}`} />
            <div className={readOnly ? 'hidden' : 'text-[12px] font-bold uppercase tracking-wide text-ink-500'}>Layout</div>
            <div className={readOnly ? 'hidden' : 'rounded-[14px] border border-[#e5e5e7] bg-white p-3'}><div className="font-display text-[14px] font-bold text-ink-900">{template.name}</div><div className="mt-1 text-[12px] text-ink-500">{sections.length} sections · {template.category}</div><button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#d2d2d7] py-2 text-[12px] font-semibold text-ink-700 hover:bg-[#f5f5f7]"><Pencil className="h-3.5 w-3.5" /> Edit in designer</button></div>
          </aside>
        }
      />
      {showPublishDialog && <PublishReportDialog onClose={() => setShowPublishDialog(false)} onPublished={(parameters) => { setPublishedParameters(parameters); setShowPublishDialog(false); }} />}
    </div>
  );
}

function ReportSectionCard({ section, onEdit, readOnly = false }: { section: TemplateSection; onEdit: (value: string) => void; readOnly?: boolean }) {
  const [editing, setEditing] = useState(false);
  const Icon = section.kind === 'chart' ? BarChart3 : section.kind === 'table' ? Table2 : section.kind === 'kpi' ? Sparkles : FileText;
  return <section className={`relative rounded-lg border p-5 ${section.kind === 'empty' ? 'border-dashed border-[#d2d2d7] bg-[#fafafa]' : 'border-[#e5e5e7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}>
    <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-ink-500"><Icon className="h-4 w-4 text-mint-600" /> {section.kind === 'empty' ? 'Empty section' : section.kind}</div>{!readOnly && <button onClick={() => setEditing(!editing)} className="text-ink-300 hover:text-ink-900"><Pencil className="h-3.5 w-3.5" /></button>}</div>
    {editing ? <input autoFocus defaultValue={section.title} onBlur={(e) => { onEdit(e.target.value); setEditing(false); }} onKeyDown={(e) => { if (e.key === 'Enter') { onEdit(e.currentTarget.value); setEditing(false); } }} className="input mt-3" /> : <h3 className="mt-3 font-display text-[18px] font-bold tracking-[-0.03em] text-ink-900">{section.title}</h3>}
    {section.kind === 'title' && <p className="mt-2 text-[13px] leading-relaxed text-ink-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. This summary gives your team a clear view of what changed and where attention is needed.</p>}
    {section.kind === 'kpi' && <div className="mt-4 grid grid-cols-3 gap-3"><Metric label="Outstanding" value="97.9 Cr" /><Metric label="Loans" value="1,284" /><Metric label="YoY" value="+7.2%" danger /></div>}
    {section.kind === 'chart' && <MiniChart />}
    {section.kind === 'table' && <MiniTable />}
    {section.kind === 'empty' && <div className="mt-5 flex min-h-[72px] items-center justify-center text-center text-[13px] text-ink-500">Empty — ask ReportIQ to add a chart, table, or KPI here</div>}
  </section>;
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) { return <div className="rounded-lg bg-[#f5f5f7] px-3 py-2.5"><div className="text-[11px] text-ink-500">{label}</div><div className={`mt-1 font-display text-[18px] font-bold ${danger ? 'text-red-600' : 'text-ink-900'}`}>{value}</div></div>; }
function MiniChart() { return <div className="mt-4 flex h-32 items-end justify-around gap-4 rounded-lg bg-[#f5f5f7] px-6 pb-3 pt-4">{[78, 54, 66, 34, 48, 88].map((height, index) => <div key={index} className="flex h-full flex-1 items-end"><div className={`w-full rounded-t-md ${index < 2 ? 'bg-red-400/80' : 'bg-mint-400'}`} style={{ height: `${height}%` }} /></div>)}</div>; }
function MiniTable() { return <div className="mt-4 overflow-hidden rounded-[10px] border border-[#e5e5e7]"><div className="grid grid-cols-3 bg-navy-900 px-3 py-2 text-[11px] font-bold text-white"><span>Segment</span><span>Accounts</span><span className="text-right">Balance</span></div>{['Retail', 'Corporate', 'SME'].map((row, index) => <div key={row} className="grid grid-cols-3 border-t border-[#e5e5e7] px-3 py-2 text-[12px] text-ink-700"><span>{row}</span><span>{[782, 341, 161][index]}</span><span className="text-right font-semibold">{['43.2 Cr', '31.8 Cr', '22.9 Cr'][index]}</span></div>)}</div>; }
