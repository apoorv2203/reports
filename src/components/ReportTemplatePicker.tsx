import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { AppButton } from '@/components/app/AppButton';
import { AppInput } from '@/components/app/AppInput';
import { AppCard } from '@/components/app/AppCard';
import { AppBadge } from '@/components/app/AppBadge';
import { reportTemplates, type ReportTemplate } from '@/data/reportTemplates';
import { useT } from '@/providers/I18nProvider';

export function ReportTemplatePicker({
  onSelect,
  onClose,
  onBrowseReports,
}: {
  onSelect: (template: ReportTemplate) => void;
  onClose: () => void;
  onBrowseReports: () => void;
}) {
  const t = useT();

  return (
    <div className="rb-overlay fixed inset-0 z-50 overflow-y-auto bg-background" role="dialog" aria-modal="true">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-[17px] font-bold tracking-[-0.03em] text-foreground">{t('reports.buildReport')}</span>
          <span className="h-5 w-px bg-border" />
          <span className="text-[13px] text-muted-foreground">{t('reports.chooseStartingPoint')}</span>
        </div>
        <div className="flex items-center gap-2">
          <AppButton variant="ghost" size="action-sm" type="button" onClick={onBrowseReports}>
            <BookOpen /> {t('reports.library')}
          </AppButton>
          <AppButton variant="ghost" size="action-md" onClick={onClose}>
            {t('common.cancel')}
          </AppButton>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <div className="max-w-2xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-primary">{t('reports.templatesEyebrow')}</p>
          <h1 className="mt-2 font-display text-[32px] font-bold tracking-[-0.04em] text-foreground">{t('reports.templatesTitle')}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {t('reports.templatesDescription')}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-muted-foreground shadow-sm">
            <Search className="h-4 w-4" />
            <AppInput size="inline" className="w-52" placeholder={t('reports.searchTemplates')} />
          </div>
          <span className="text-[12px] font-medium text-ink-500">{reportTemplates.length} templates</span>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-5">
          {reportTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onSelect={onSelect} />
          ))}
        </div>

      </main>
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: ReportTemplate; onSelect: (template: ReportTemplate) => void }) {
  return (
    <button type="button" onClick={() => onSelect(template)} className="group flex min-w-0 flex-col overflow-hidden text-left"><AppCard variant="report" className="cursor-pointer overflow-hidden p-0 text-left transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-muted">
        <img
          src={template.preview || "/placeholder.svg"}
          alt={`${template.name} template preview`}
          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <AppBadge variant="success" size="status" className="absolute left-3 top-3 bg-white/90 text-navy-900 shadow-soft backdrop-blur-sm">{template.category}</AppBadge>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink-900">{template.name}</h3>
        <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-500">{template.description}</p>
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-ink-300">
          <span>{template.updated}</span>
          <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-1 group-hover:text-mint-600" />
        </div>
      </div>
    </AppCard></button>
  );
}
