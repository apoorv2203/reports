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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { exportReport } from '@/api/services/reportService';
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
    const result = t('workspace.promptApplied');
    setMessages((current) => [...current, { prompt: text, result }]);
    setPrompt('');
  }

  async function handleExport(format: 'image' | 'jrxml' | 'pdf') {
    if (!report?.id) return;
    try {
      await exportReport(report.id, { format });
    } catch (err) {
      // keep behavior minimal; the export service handles the response
      console.error('Export failed', err);
    }
    setExportOpen(false);
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
              {messages.length === 0 && <div className="rounded-[24px] border border-dashed border-border bg-transparent px-6 py-6 text-[13px] leading-relaxed text-muted-foreground">{t('workspace.emptyState')}</div>}
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => <div key={`${message.prompt}-${index}`}><div className="rounded-[14px] bg-foreground px-3.5 py-3 text-[13px] font-medium leading-relaxed text-background">{message.prompt}</div><div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-primary"><Check className="h-3.5 w-3.5" />{message.result}</div></div>)}
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <div className="text-[12px] font-bold text-muted-foreground">{t('workspace.tryNext')}</div>
                <div className="mt-2 flex flex-col gap-2">
                  {[t('workspace.suggestionKPI'), t('workspace.suggestionChart'), t('workspace.suggestionTitle')].map((suggestion) => (
                    <AppButton key={suggestion} onClick={() => applyPrompt(suggestion)} variant="secondary" size="suggestion">
                      {suggestion}
                    </AppButton>
                  ))}
                </div>
              </div>
            </div>}
            <div className="mt-4 shrink-0 relative">
              <Textarea
                className="w-full resize-none bg-white rounded-[18px] border border-border px-4 pt-4 pb-8 text-[13px] text-ink-900 outline-none placeholder:text-ink-300 min-h-[36px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.nativeEvent.isComposing) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyPrompt(prompt); } }}
                placeholder={t('workspace.askPlaceholder')}
                rows={4}
              />
              <div className="absolute left-3 bottom-3 text-[12px] text-muted-foreground">{t('workspace.enterToSend')}</div>
              <AppButton
                variant="primary"
                size="icon-sm"
                className="absolute right-3 bottom-2 h-10 w-10 rounded-full bg-ink-900 text-white shadow-md"
                onClick={() => applyPrompt(prompt)}
                aria-label={t('workspace.sendPrompt')}
              >
                <Send className="h-4 w-4" />
              </AppButton>
            </div>
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
              <DropdownMenu open={exportOpen} onOpenChange={(open) => setExportOpen(open)}>
                <DropdownMenuTrigger {...({ asChild: true } as any)}>
                  <AppButton type="button" variant="secondary" size="report-export" aria-label={t('workspace.export')} className="w-full">
                    <ArrowDownToLine className="h-4 w-4" />
                    {t('workspace.export')}
                    <ChevronDown style={{ marginInlineStart: 'auto' }} className={`h-4 w-4 text-muted-foreground transition ${exportOpen ? 'rotate-180' : ''}`} />
                  </AppButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={8} className="bg-white rounded-lg p-2 text-foreground shadow-lg ring-1 ring-foreground/10">
                  <DropdownMenuItem onSelect={() => handleExport('image')}>{t('workspace.exportImage')}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleExport('jrxml')}>{t('workspace.exportJRXML')}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleExport('pdf')}>{t('workspace.exportPDF')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
