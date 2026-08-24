import { useMemo, useState } from 'react';
import { AppButton } from '@/components/app/AppButton';
import { AppInput } from '@/components/app/AppInput';
import { AppCard } from '@/components/app/AppCard';
import { AppBadge } from '@/components/app/AppBadge';
import { useT } from '@/providers/I18nProvider';
import {
  ArrowLeft,
  CalendarDays,
  EyeOff,
  FilePenLine,
  Heart,
  Play,
  Search,
} from 'lucide-react';
import {
  libraryReports,
  reportTemplates,
  type LibraryReport,
  type ReportTemplate,
} from '@/data/reportTemplates';

type LibraryTab = 'mine' | 'catalogue';

export function BuilderReportsLibrary({
  onBack,
  onOpenReport,
}: {
  onBack: () => void;
  onOpenReport: (template: ReportTemplate, report: LibraryReport) => void;
}) {
  const t = useT();
  const [tab, setTab] = useState<LibraryTab>('catalogue');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [reports, setReports] = useState(libraryReports);

  const allCategory = t('common.all');
  const categories = [allCategory, ...Array.from(new Set(libraryReports.map((report) => report.category)))];
  const visibleReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesTab = tab === 'catalogue' ? report.published : report.ownedByYou;
      const matchesCategory = category === allCategory || report.category === category;
      const matchesSearch = !query || `${report.title} ${report.description} ${report.publisher}`.toLowerCase().includes(query);
      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [category, reports, search, tab]);

  function openReport(report: LibraryReport) {
    onOpenReport(reportTemplates.find((template) => template.id === report.templateId) ?? reportTemplates[0], report);
  }

  function toggleFavourite(id: string) {
    setReports((current) => current.map((report) => report.id === id ? { ...report, favourite: !report.favourite } : report));
  }

  function togglePublished(id: string) {
    setReports((current) => current.map((report) => report.id === id ? { ...report, published: !report.published } : report));
  }

  return (
    <div className="rb-overlay fixed inset-0 z-50 flex flex-col overflow-hidden bg-background" role="dialog" aria-modal="true" aria-labelledby="reports-library-title">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <AppButton variant="ghost" size="icon-lg" onClick={onBack} aria-label={t('builderLibrary.backButton')}>
            <ArrowLeft className="h-4 w-4" />
          </AppButton>
          <span className="h-5 w-px bg-border-light" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">{t('reports.library')}</p>
            <h1 id="reports-library-title" className="font-display text-[18px] font-bold tracking-[-0.03em] text-foreground">{t('reports.libraryTitle')}</h1>
          </div>
        </div>
        <AppButton variant="primary" size="action-sm" onClick={onBack}>{t('builderLibrary.backButton')}</AppButton>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex rounded-[14px] border border-border bg-card p-1 shadow-soft" aria-label={t('reports.library')}>
            <AppButton size="tab" active={tab === 'mine'} onClick={() => { setTab('mine'); setCategory('All'); }}>{t('builderLibrary.myReports')}</AppButton>
            <AppButton size="tab" active={tab === 'catalogue'} onClick={() => { setTab('catalogue'); setCategory('All'); }}>{t('builderLibrary.catalogue')}</AppButton>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-3 text-muted-foreground focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-5 w-5 shrink-0" />
              <span className="sr-only">{t('reports.search')}</span>
              <AppInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tab === 'mine' ? t('builderLibrary.searchMyReports') : t('builderLibrary.searchSharedReports')} size="inline" />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Report categories">
              {categories.map((item) => (
                <AppButton key={item} size="pill" active={category === item} onClick={() => setCategory(item)}>{item}</AppButton>
              ))}
            </div>
          </div>

          {visibleReports.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleReports.map((report) => (
                <ReportLibraryCard key={report.id} report={report} onOpen={() => openReport(report)} onFavourite={() => toggleFavourite(report.id)} onPublish={() => togglePublished(report.id)} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <h2 className="font-display text-[18px] font-bold text-foreground">{t('reports.noResults')}</h2>
              <p className="mt-2 text-[14px] text-muted-foreground">{t('reports.tryAnother')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ReportLibraryCard({ report, onOpen, onFavourite, onPublish }: { report: LibraryReport; onOpen: () => void; onFavourite: () => void; onPublish: () => void }) {
  const t = useT();
  return (
    <AppCard variant="report" density="recommendation" className="min-h-[300px]">
      <div><AppBadge variant={report.category === 'Delinquency' ? 'danger' : report.category === 'Compliance' ? 'warning' : report.category === 'Operations' ? 'chart' : 'success'} size="category">{report.category}</AppBadge></div>
      <h2 className="mt-4 text-balance font-display text-[19px] font-bold tracking-[-0.03em] text-ink-900">{report.title}</h2>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-500">{report.description}</p>
      <div className="mt-5 flex items-center gap-2 text-[12px] font-medium text-ink-300"><CalendarDays className="h-4 w-4" /><span>{report.cadence} · {t('reports.publishedBy')} {report.publisher}</span></div>
      <div className="mt-5 flex items-center gap-2">
        {report.ownedByYou ? (
          <>
            <AppButton variant="secondary" size="report-action" onClick={onOpen}><FilePenLine /> {t('reports.edit')}</AppButton>
            <AppButton variant="danger" size="report-action" onClick={onPublish}><EyeOff /> {report.published ? t('reports.unpublish') : t('reports.publish')}</AppButton>
          </>
        ) : (
          <>
            <AppButton variant="primary" size="report-action" onClick={onOpen}><Play /> {t('reports.run')}</AppButton>
            <AppButton variant="secondary" size="toggle" active={report.favourite} onClick={onFavourite} aria-label={report.favourite ? `${t('reports.removeFromFavourites')} ${report.title}` : `${t('reports.addToFavourites')} ${report.title}`} aria-pressed={report.favourite}><Heart className={report.favourite ? 'fill-current' : undefined} /></AppButton>
          </>
        )}
      </div>
      {report.ownedByYou && <p className="mt-3 text-center text-[11px] font-semibold text-ink-300">{report.published ? t('reports.publishedByYou') : t('reports.privateDraft')}</p>}
    </AppCard>
  );
}
