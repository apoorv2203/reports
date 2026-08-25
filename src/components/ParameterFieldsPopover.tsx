import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Database, FileText, Plus, Search } from 'lucide-react';
import { AppButton } from '@/components/app/AppButton';
import { AppInput } from '@/components/app/AppInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getReportParameterFields } from '@/api/services/reportService';
import type { ReportParameterField } from '@/api/types/report';
import { useT } from '@/providers/I18nProvider';

type Props = { reportId: string; selectedIds: string[]; onAdd: (fields: ReportParameterField[]) => void; children: React.ReactNode };

export function ParameterFieldsPopover({ reportId, selectedIds, onAdd, children }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [fields, setFields] = useState<ReportParameterField[]>([]);
  const [pending, setPending] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function loadFields(search = '') {
    setLoading(true); setError(false);
    try { const response = await getReportParameterFields(reportId, search); setFields(response.items); }
    catch { setError(true); }
    finally { setLoading(false); }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) { setPending([]); void loadFields(query); }
  }

  function toggleField(id: string) { setPending((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  const grouped = fields.filter((field) => !selectedIds.includes(field.id)).reduce<Record<string, ReportParameterField[]>>((groups, field) => { (groups[field.group] ??= []).push(field); return groups; }, {});

  return <Popover open={open} onOpenChange={handleOpenChange}>
    <PopoverTrigger render={children as never} />
    <PopoverContent align="end" sideOffset={8} className="w-[min(28rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-lg">
      <div className="flex flex-col gap-4 p-4">
        <h3 className="text-lg font-bold">{t('reports.addFields')}</h3>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3"><Search className="size-5 text-muted-foreground" /><AppInput aria-label={t('reports.searchFields')} value={query} onChange={(event) => { setQuery(event.target.value); void loadFields(event.target.value); }} placeholder={t('reports.searchFields')} size="inline" /></div>
      </div>
      <div className="max-h-[24rem] overflow-y-auto border-y border-border px-4">
        {loading && <p className="py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</p>}
        {error && <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground"><p>{t('reports.fieldsError')}</p><AppButton size="sm" variant="outline" onClick={() => void loadFields(query)}>{t('common.retry')}</AppButton></div>}
        {!loading && !error && Object.keys(grouped).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{t('reports.noFieldsFound')}</p>}
        {!loading && !error && Object.entries(grouped).map(([group, groupFields]) => <section key={group} className="py-3"><div className="flex items-center gap-2 pb-2 text-sm font-bold"><ChevronDown className="size-4" /><Database className="size-5 text-muted-foreground" />{group}</div><div className="flex flex-col gap-1">{groupFields.map((field) => <label key={field.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted"><Checkbox checked={pending.includes(field.id)} onChange={() => toggleField(field.id)} /><span>{field.displayName}</span></label>)}</div></section>)}
      </div>
      <footer className="flex items-center justify-between gap-3 p-4"><span className="text-sm font-semibold text-primary">{pending.length} {t('reports.fieldsSelected')}</span><AppButton variant="primary" size="sm" disabled={!pending.length} onClick={() => { onAdd(fields.filter((field) => pending.includes(field.id))); setOpen(false); }}><Plus data-icon="inline-start" />{t('reports.addSelected')}</AppButton></footer>
    </PopoverContent>
  </Popover>;
}

export function ParameterGroupIcon({ group }: { group: string }) { return group.toLowerCase().includes('audit') ? <FileText className="size-5" /> : group.toLowerCase().includes('branch') ? <ChevronRight className="size-5" /> : <Check className="size-5" />; }
