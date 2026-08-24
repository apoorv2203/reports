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

  const categories = [t('common.all'), ...Array.from(new Set(libraryReports.map((report) => report.category)))];
  const visibleReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesTab = tab === 'catalogue' ? report.published : report.ownedByYou;
      const matchesCategory = category === 'All' || report.category === category;
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
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-white px-5 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <AppButton variant="ghost" size="icon-lg" onClick={onBack} aria-label={t('builderLibrary.backButton')}>
            <ArrowLeft className="h-4 w-4" />
          </AppButton>
          <span className="h-5 w-px bg-border-light" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-mint-700">Report library</p>
            <h1 id="reports-library-title" className="font-display text-[18px] font-bold tracking-[-0.03em] text-ink-900">Reuse what your team already knows</h1>
          </div>
        </div>
        <AppButton variant="primary" size="action-sm" onClick={onBack}>{t('builderLibrary.backButton')}</AppButton>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex rounded-[14px] border border-surface-200 bg-white p-1 shadow-soft" aria-label={t('reports.library')}>
            <AppButton size="tab" active={tab === 'mine'} onClick={() => { setTab('mine'); setCategory('All'); }}>{t('builderLibrary.myReports')}</AppButton>
            <AppButton size="tab" active={tab === 'catalogue'} onClick={() => { setTab('catalogue'); setCategory('All'); }}>{t('builderLibrary.catalogue')}</AppButton>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[14px] border border-border-light bg-white px-4 py-3 text-ink-300 focus-within:border-mint-400 focus-within:ring-2 focus-within:ring-mint-100">
              <Search className="h-5 w-5 shrink-0" />
              <span className="sr-only">Search reports</span>
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
            <div className="mt-6 rounded-[18px] border border-dashed border-border-light bg-white px-6 py-16 text-center">
              <h2 className="font-display text-[18px] font-bold text-ink-900">No reports found</h2>
              <p className="mt-2 text-[14px] text-ink-500">Try another search or choose a different category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ReportLibraryCard({ report, onOpen, onFavourite, onPublish }: { report: LibraryReport; onOpen: () => void; onFavourite: () => void; onPublish: () => void }) {
  const categoryStyles: Record<LibraryReport['category'], string> = {
    Sales: 'bg-mint-100 text-mint-700',
    Delinquency: 'bg-red-100 text-red-700',
    Compliance: 'bg-amber-100 text-amber-800',
    Operations: 'bg-badge-blue-bg text-badge-blue-text',
  };

  return (
    <AppCard variant="report" density="recommendation" className="min-h-[300px]">
      <div><span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${categoryStyles[report.category]}`}>{report.category}</span></div>
      <h2 className="mt-4 text-balance font-display text-[19px] font-bold tracking-[-0.03em] text-ink-900">{report.title}</h2>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-500">{report.description}</p>
      <div className="mt-5 flex items-center gap-2 text-[12px] font-medium text-ink-300"><CalendarDays className="h-4 w-4" /><span>{report.cadence} · published by {report.publisher}</span></div>
      <div className="mt-5 flex items-center gap-2">
        {report.ownedByYou ? (
          <>
            <button onClick={onOpen} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-border-light px-3 py-2.5 text-[13px] font-bold text-ink-900 hover:bg-background"><FilePenLine className="h-4 w-4" /> Edit</button>
            <button onClick={onPublish} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-border-light px-3 py-2.5 text-[13px] font-bold text-red-700 hover:bg-red-50"><EyeOff className="h-4 w-4" /> {report.published ? 'Unpublish' : 'Publish'}</button>
          </>
        ) : (
          <>
            <button onClick={onOpen} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-navy-900 px-3 py-2.5 text-[13px] font-bold text-white hover:bg-ink-900"><Play className="h-4 w-4" /> Run report</button>
            <button onClick={onFavourite} aria-label={report.favourite ? `Remove ${report.title} from favourites` : `Add ${report.title} to favourites`} aria-pressed={report.favourite} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border ${report.favourite ? 'border-red-200 bg-red-50 text-red-600' : 'border-border-light text-ink-500 hover:border-ink-500'}`}><Heart className={`h-4 w-4 ${report.favourite ? 'fill-current' : ''}`} /></button>
          </>
        )}
      </div>
      {report.ownedByYou && <p className="mt-3 text-center text-[11px] font-semibold text-ink-300">{report.published ? 'Published by you' : 'Private draft'}</p>}
    </AppCard>
  );
}
