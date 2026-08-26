import { useEffect, useState } from 'react';
import { useT } from '@/providers/I18nProvider';
import { AppButton } from '@/components/app/AppButton';
import { AppCard } from '@/components/app/AppCard';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDownToLine, ArrowUpRight, Check, ChevronDown, MessageSquare, MoveHorizontal as MoreHorizontal, Pencil, Send } from 'lucide-react';
import { defaultReportParameters, type LibraryReport, type ReportParameter } from '@/data/reportTemplates';
import type { ReportTemplateResponse } from '@/api/types/report';
import { renderReportTemplate } from '@/api/services/reportService';
import { PublishReportDialog } from './PublishReportDialog';
import { ReportParameterRunner } from './ReportParameterRunner';
import { ResizableThreePane } from './ResizableThreePane';

export function ReportWorkspace({ template, report, onBack, onBrowseReports, readOnly = false }: { template: ReportTemplateResponse; report?: LibraryReport; onBack: () => void; onBrowseReports: () => void; readOnly?: boolean }) {
  const t = useT();
  const [renderedHtml, setRenderedHtml] = useState('');
  const [renderError, setRenderError] = useState(false);
  const [title, setTitle] = useState(report?.title ?? template.name);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ prompt: string; result: string }[]>([]);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [publishedParameters, setPublishedParameters] = useState<ReportParameter[] | null>(null);

  useEffect(() => {
    let active = true;
    renderReportTemplate(template.masterTemplateId).then((response) => { if (active) setRenderedHtml(response.html); }).catch(() => { if (active) setRenderError(true); });
    return () => { active = false; };
  }, [template.masterTemplateId]);

  function applyPrompt(value: string) {
    const text = value.trim();
    if (!text) return;
    const result = 'The Jasper report preview will update with this request.';
    setMessages((current) => [...current, { prompt: text, result }]);
    setPrompt('');
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
      <ResizableThreePane
        leftLabel={t('workspace.editingReport')}
        rightLabel={t('workspace.actions')}
        left={
          <aside className={`flex h-full min-h-0 flex-col border-r border-border bg-muted p-4 ${readOnly ? 'items-center justify-center' : ''}`}>
            {!readOnly && <div className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-ink-700"><MessageSquare className="h-4 w-4 text-mint-600" /> {t('workspace.editing')}</div>}
            {!readOnly && <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto">
              {messages.length === 0 && <div className="rounded-[24px] border border-dashed border-border bg-transparent px-8 py-8 text-[15px] leading-relaxed text-muted-foreground">{t('workspace.askUpdate')}</div>}
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => <div key={`${message.prompt}-${index}`}><div className="rounded-[14px] bg-foreground px-3.5 py-3 text-[13px] font-medium leading-relaxed text-background">{message.prompt}</div><div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-primary"><Check className="h-3.5 w-3.5" />{message.result}</div></div>)}
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <div className="text-[12px] font-bold text-muted-foreground">{t('workspace.tryNext')}</div>
                <div className="mt-2 flex flex-col gap-2">
                  {['Add a metric block in section 2', 'Add a chart in section 3', 'Update the title in section 1 to "Q2 branch review"'].map((suggestion) => <AppButton key={suggestion} onClick={() => applyPrompt(suggestion)} variant="secondary" size="menu-item" className="rounded-lg border border-border bg-card px-3 py-2.5 text-left text-[12px] font-medium leading-relaxed text-foreground shadow-none hover:border-primary hover:bg-accent">{suggestion}</AppButton>)}
                </div>
              </div>
            </div>}
            <AppCard variant="report" density="report-layout" className="mt-4 shrink-0 rounded-[24px] border border-border bg-card p-4 shadow-none">
              <Textarea className="w-full resize-none bg-transparent px-2 py-1 text-[13px] text-ink-900 outline-none placeholder:text-ink-300" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyPrompt(prompt); } }} placeholder={t('workspace.askUpdate')} rows={3} />
              <div className="mt-4 flex items-center justify-between px-1"><span className="text-[12px] text-muted-foreground">{t('workspace.enterToSend')}</span><AppButton variant="primary" size="icon-sm" className="size-12 rounded-full" onClick={() => applyPrompt(prompt)} aria-label={t('workspace.sendPrompt')}><Send /></AppButton></div>
            </AppCard>
          </aside>
        }
        center={
          <main className="h-full min-h-0 overflow-y-auto bg-card px-8 py-7">
            <div className="mx-auto max-w-2xl">
              <div className="mb-5 flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{report ? t('workspace.reportView') : t('workspace.reportPreview')}</div><h1 className="mt-1 font-display text-[25px] font-bold tracking-[-0.04em] text-foreground">{title}</h1></div><AppButton variant="ghost" size="icon-sm" aria-label={t('workspace.moreOptions')}><MoreHorizontal /></AppButton></div>
              {readOnly && <ReportParameterRunner parameters={report?.parameters ?? defaultReportParameters} reportTitle={title} />}
              {renderError ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{t('workspace.renderError')}</div> : <div className="report-rendered-html" dangerouslySetInnerHTML={{ __html: renderedHtml }} />}
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
            <AppCard variant="report" density="report-layout" className={readOnly ? 'hidden' : undefined}><div className="font-display text-[14px] font-bold text-foreground">{template.name}</div><div className="mt-1 text-[12px] text-muted-foreground">{template.category}</div><AppButton variant="secondary" size="report-designer"><Pencil /> {t('workspace.editDesigner')}</AppButton></AppCard>
          </aside>
        }
      />
      {showPublishDialog && <PublishReportDialog onClose={() => setShowPublishDialog(false)} onPublished={(parameters) => { setPublishedParameters(parameters); setShowPublishDialog(false); }} />}
    </div>
  );
}
