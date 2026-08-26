import { ArrowLeft, ArrowDownToLine, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useT } from '@/providers/I18nProvider';
import { AppButton } from '@/components/app/AppButton';
import { ReportParameterRunner } from './ReportParameterRunner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportReport } from '@/api/services/reportService';
import { defaultReportParameters, type LibraryReport } from '@/data/reportTemplates';
import type { ReportTemplateResponse } from '@/api/types/report';

export function PublishedReportViewer({ template, report, renderedHtml, renderError, onBack, onRunReport }: { template: ReportTemplateResponse; report?: LibraryReport; renderedHtml: string; renderError: boolean; onBack: () => void; onRunReport: (values: Record<string, unknown>) => Promise<void> }) {
  const t = useT();
  const [exportOpen, setExportOpen] = useState(false);
  const title = report?.title ?? template.name;

  async function handleExport(format: 'image' | 'jrxml' | 'pdf') {
    if (!report?.id) return;
    await exportReport(report.id, { format });
    setExportOpen(false);
  }

  return <main className="min-h-0 flex-1 overflow-y-auto bg-muted px-4 py-6 md:px-8">
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <AppButton variant="ghost" size="action-sm" onClick={onBack} className="-ms-2 mb-3 text-primary"><ArrowLeft />{t('reports.myReports')}</AppButton>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{template.description}</p>
          <p className="mt-3 text-xs text-muted-foreground">{t('reports.viewerLastUpdated')}</p>
        </div>
        <AppButton variant="ghost" size="icon-sm" aria-label={t('workspace.moreOptions')}><MoreHorizontal /></AppButton>
      </header>
      <div className="mt-0">
        <ReportParameterRunner parameters={report?.parameters ?? defaultReportParameters} reportTitle={title} onRunReport={onRunReport} />
      </div>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm" aria-labelledby="report-title">
        <div className="flex items-center justify-between gap-3"><h2 id="report-title" className="font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground">{t('reports.viewerReport')}</h2><DropdownMenu open={exportOpen} onOpenChange={setExportOpen}><DropdownMenuTrigger {...({ asChild: true } as any)}><AppButton type="button" variant="secondary" size="report-export"><ArrowDownToLine />{t('workspace.export')}<ChevronDown className="ms-auto" /></AppButton></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => handleExport('image')}>{t('workspace.exportImage')}</DropdownMenuItem><DropdownMenuItem onSelect={() => handleExport('pdf')}>{t('workspace.exportPDF')}</DropdownMenuItem><DropdownMenuItem onSelect={() => handleExport('jrxml')}>{t('workspace.exportJRXML')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">{renderError ? <p className="p-6 text-sm text-destructive">{t('workspace.renderError')}</p> : <div className="report-rendered-html overflow-auto" dangerouslySetInnerHTML={{ __html: renderedHtml }} />}</div>
        <p className="mt-3 text-center text-xs text-muted-foreground">{t('reports.jasperNote')}</p>
      </section>
    </div>
  </main>;
}

void PublishedReportViewer;
