import { useMemo, useState } from 'react';
import { useT } from '@/providers/I18nProvider';
import { AppButton } from '@/components/app/AppButton';
import { AppBadge } from '@/components/app/AppBadge';
import { AppCard } from '@/components/app/AppCard';
import { AppInput } from '@/components/app/AppInput';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, ChartBar as BarChart3, BookOpen, Check, ChevronDown, FileText, MessageSquare, MoveHorizontal as MoreHorizontal, Pencil, Send, Sparkles, Table2, X } from 'lucide-react';
import { defaultReportParameters, type LibraryReport, type ReportParameter, type ReportTemplate, type TemplateSection } from '@/data/reportTemplates';
import { PublishReportDialog } from './PublishReportDialog';
import { ReportParameterRunner } from './ReportParameterRunner';
import { ResizableThreePane } from './ResizableThreePane';

export function ReportWorkspace({ template, report, onBack, onBrowseReports, readOnly = false }: { template: ReportTemplate; report?: LibraryReport; onBack: () => void; onBrowseReports: () => void; readOnly?: boolean }) {
  const t = useT();
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
      result = target >= 0 ? `Metric block added to section ${target + 1}` : 'KPI block added';
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
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-card">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-5 text-foreground shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <AppButton variant="primary" size="icon-sm" onClick={onBack} aria-label={t('common.back')}><ArrowLeft /></AppButton>
          <span className="h-5 w-px bg-border" />
          <span className="font-display text-[16px] font-bold text-foreground">ReportIQ</span>
          <span className="text-muted-foreground">/</span>
          <span className="hidden text-[13px] text-muted-foreground sm:inline">{t('workspace.myReports')}</span>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <span className="truncate text-[13px] font-semibold text-foreground">{title}</span>
          <AppBadge variant={publishedParameters ? 'success' : 'warning'} size="status">{publishedParameters ? 'Published' : report?.published ? 'Catalogue' : 'Draft'}</AppBadge>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <AppButton variant="primary" size="report-header" type="button" onClick={onBrowseReports} className="hidden sm:inline-flex"><BookOpen /> {t('workspace.reports')}</AppButton>
          <AppButton variant="ghost" size="icon-sm" onClick={onBack} aria-label={t('common.close')}><X /></AppButton>
        </div>
      </header>

      <ResizableThreePane
        leftLabel={t('workspace.editingReport')}
        rightLabel={t('workspace.actions')}
        left={
          <aside className={`flex h-full min-h-0 flex-col border-r border-border bg-muted p-4 ${readOnly ? 'items-center justify-center' : ''}`}>
            {!readOnly && <div className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-foreground"><MessageSquare className="h-4 w-4 text-primary" /> {t('workspace.editing')}</div>}
            {!readOnly && <div className="mt-4 flex-1 overflow-y-auto">
              {messages.length === 0 && <AppCard variant="report" density="report-composer">{t('workspace.askUpdate')}</AppCard>}
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => <div key={`${message.prompt}-${index}`}><div className="rounded-[14px] bg-foreground px-3.5 py-3 text-[13px] font-medium leading-relaxed text-background">{message.prompt}</div><div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-primary"><Check className="h-3.5 w-3.5" />{message.result}</div></div>)}
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <div className="text-[12px] font-bold text-muted-foreground">{t('workspace.tryNext')}</div>
                <div className="mt-2 flex flex-col gap-2">
                  {['Add a metric block in section 2', 'Add a chart in section 3', 'Update the title in section 1 to "Q2 branch review"'].map((suggestion) => <AppButton key={suggestion} onClick={() => applyPrompt(suggestion)} variant="secondary" size="menu-item">{suggestion}</AppButton>)}
                </div>
              </div>
            </div>}
            <AppCard variant="report" density="report-layout" className="mt-3">
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyPrompt(prompt); } }} placeholder={t('workspace.askUpdate')} rows={3} />
              <div className="flex items-center justify-between px-1"><span className="text-[10px] text-muted-foreground">{t('workspace.enterToSend')}</span><AppButton variant="primary" size="icon-sm" onClick={() => applyPrompt(prompt)} aria-label={t('workspace.sendPrompt')}><Send /></AppButton></div>
            </AppCard>
          </aside>
        }
        center={
          <main className="h-full min-h-0 overflow-y-auto bg-card px-8 py-7">
            <div className="mx-auto max-w-2xl">
              <div className="mb-5 flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{report ? t('workspace.reportView') : t('workspace.reportPreview')}</div><h1 className="mt-1 font-display text-[25px] font-bold tracking-[-0.04em] text-foreground">{title}</h1></div><AppButton variant="ghost" size="icon-sm" aria-label={t('workspace.moreOptions')}><MoreHorizontal /></AppButton></div>
              {readOnly && <ReportParameterRunner parameters={report?.parameters ?? defaultReportParameters} reportTitle={title} />}
              <div className="flex flex-col gap-4">{sections.map((section) => <ReportSectionCard key={`${section.id}-${section.kind}`} section={section} readOnly={readOnly} onEdit={(value) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, title: value } : item))} />)}</div>
            </div>
          </main>
        }
        right={
          <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto border-l border-border bg-muted p-4">
            <div className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-foreground">{t('workspace.actions')}</div>
            {!readOnly && <><AppButton onClick={() => setShowPublishDialog(true)} variant="primary" size="report-publish"><ArrowUpRight /> {t('workspace.publishReport')}</AppButton>
            <p className="-mt-1 text-[11px] leading-4 text-muted-foreground">{t('workspace.publishHelper')}</p></>}
            <div>
              <AppButton type="button" onClick={() => setExportOpen((open) => !open)} variant="secondary" size="report-export">
                <ArrowDownToLine className="h-4 w-4" />
                {t('workspace.export')}
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition ${exportOpen ? 'rotate-180' : ''}`} />
              </AppButton>
              {exportOpen && <div className="mt-1 flex flex-col gap-1 rounded-lg border border-border bg-card p-1">
                {[t('workspace.exportImage'), t('workspace.exportJRXML'), t('workspace.exportPDF')].map((option) => <AppButton key={option} type="button" variant="ghost" size="menu-item">{option}</AppButton>)}
              </div>}
            </div>
            <div className={`my-2 h-px bg-border ${readOnly ? 'hidden' : ''}`} />
            <div className={readOnly ? 'hidden' : 'text-[12px] font-bold uppercase tracking-wide text-muted-foreground'}>{t('workspace.layout')}</div>
            <AppCard variant="report" density="report-layout" className={readOnly ? 'hidden' : undefined}><div className="font-display text-[14px] font-bold text-foreground">{template.name}</div><div className="mt-1 text-[12px] text-muted-foreground">{sections.length} sections · {template.category}</div><AppButton variant="secondary" size="report-designer"><Pencil /> {t('workspace.editDesigner')}</AppButton></AppCard>
          </aside>
        }
      />
      {showPublishDialog && <PublishReportDialog onClose={() => setShowPublishDialog(false)} onPublished={(parameters) => { setPublishedParameters(parameters); setShowPublishDialog(false); }} />}
    </div>
  );
}

function ReportSectionCard({ section, onEdit, readOnly = false }: { section: TemplateSection; onEdit: (value: string) => void; readOnly?: boolean }) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const Icon = section.kind === 'chart' ? BarChart3 : section.kind === 'table' ? Table2 : section.kind === 'kpi' ? Sparkles : FileText;
  return <section className={`relative rounded-xl border p-5 ${section.kind === 'empty' ? 'border-dashed border-border-light bg-muted' : 'border-border bg-card shadow-card-alt'}`}>
    <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground"><Icon className="h-4 w-4 text-primary" /> {section.kind === 'empty' ? t('workspace.emptySection') : section.kind === 'title' ? t('workspace.titleSection') : section.kind === 'kpi' ? t('workspace.kpiSection') : section.kind === 'chart' ? t('workspace.chartSection') : t('workspace.tableSection')}</div>{!readOnly && <AppButton size="section-icon" aria-label="Edit section" onClick={() => setEditing(!editing)}><Pencil /></AppButton>}</div>
    {editing ? <AppInput autoFocus defaultValue={section.title} onBlur={(e) => { onEdit(e.target.value); setEditing(false); }} onKeyDown={(e) => { if (e.key === 'Enter') { onEdit(e.currentTarget.value); setEditing(false); } }} className="mt-3" /> : <h3 className="mt-3 font-display text-[18px] font-bold leading-tight tracking-[-0.03em] text-foreground">{section.title}</h3>}
    {section.kind === 'title' && <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. This summary gives your team a clear view of what changed and where attention is needed.</p>}
    {section.kind === 'kpi' && <div className="mt-4 grid grid-cols-3 gap-3"><Metric label="Outstanding" value="97.9 Cr" /><Metric label="Loans" value="1,284" /><Metric label="YoY" value="+7.2%" danger /></div>}
    {section.kind === 'chart' && <MiniChart />}
    {section.kind === 'table' && <MiniTable />}
    {section.kind === 'empty' && <div className="mt-5 flex min-h-[72px] items-center justify-center text-center text-[13px] text-muted-foreground">{t('workspace.emptySectionHelp')}</div>}
  </section>;
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) { return <div className="rounded-lg bg-background px-3 py-2.5"><div className="text-[11px] text-muted-foreground">{label}</div><div className={`mt-1 font-display text-[18px] font-bold ${danger ? 'text-red-600' : 'text-foreground'}`}>{value}</div></div>; }
function MiniChart() { return <div className="mt-4 flex h-32 items-end justify-around gap-4 rounded-lg bg-background px-6 pb-3 pt-4">{[78, 54, 66, 34, 48, 88].map((height, index) => <div key={index} className="flex h-full flex-1 items-end"><div className={`w-full rounded-t-md ${index < 2 ? 'bg-destructive/60' : 'bg-primary'}`} style={{ height: `${height}%` }} /></div>)}</div>; }
function MiniTable() { return <div className="mt-4 overflow-hidden rounded-[10px] border border-border"><div className="grid grid-cols-3 bg-foreground px-3 py-2 text-[11px] font-bold text-background"><span>Segment</span><span>Accounts</span><span className="text-right">Balance</span></div>{['Retail', 'Corporate', 'SME'].map((row, index) => <div key={row} className="grid grid-cols-3 border-t border-border px-3 py-2 text-[12px] text-foreground"><span>{row}</span><span>{[782, 341, 161][index]}</span><span className="text-right font-semibold">{['43.2 Cr', '31.8 Cr', '22.9 Cr'][index]}</span></div>)}</div>; }
