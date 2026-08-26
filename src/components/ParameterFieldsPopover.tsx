import { useState } from 'react';
import { ChevronDown, Database, FileText, Plus, Search, X } from 'lucide-react';
import { AppButton } from '@/components/app/AppButton';
import { AppInput } from '@/components/app/AppInput';
import { Checkbox } from '@/components/ui/checkbox';
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
  function toggleOpen() { const next = !open; setOpen(next); if (next) { setPending([]); void loadFields(query); } }
  function toggleField(id: string) { setPending((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  const grouped = fields.reduce<Record<string, ReportParameterField[]>>((groups, field) => { (groups[field.group] ??= []).push(field); return groups; }, {});

  return <div className="w-full">
    <div onClick={toggleOpen}>{children}</div>
    {open && <div className="mt-3 overflow-hidden rounded-xl border border-primary bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-3 p-3"><span className="text-sm font-semibold">{t('reports.addFields')}</span><AppButton variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label={t('reports.closeFieldPicker')}><X /></AppButton></div>
      <div className="flex items-center gap-2 px-3 pb-3"><Search className="size-4 text-muted-foreground" /><AppInput aria-label={t('reports.searchFields')} value={query} onChange={(event) => { setQuery(event.target.value); void loadFields(event.target.value); }} placeholder={t('reports.searchFields')} size="inline" /></div>
      <div className="max-h-64 overflow-y-auto border-y border-border px-3">
        {loading && <p className="py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</p>}
        {error && <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground"><p>{t('reports.fieldsError')}</p><AppButton size="sm" variant="outline" onClick={() => void loadFields(query)}>{t('common.retry')}</AppButton></div>}
        {!loading && !error && Object.keys(grouped).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{t('reports.noFieldsFound')}</p>}
        {!loading && !error && Object.entries(grouped).map(([group, groupFields]) => <section key={group} className="py-2"><div className="flex items-center gap-2 pb-1 text-sm font-bold"><ChevronDown className="size-4" /><Database className="size-4 text-muted-foreground" />{group}</div><div className="flex flex-col gap-1">{groupFields.map((field) => { const selected = selectedIds.includes(field.id); return <label key={field.id} className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${selected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'}`}><Checkbox checked={pending.includes(field.id)} disabled={selected} onChange={() => toggleField(field.id)} /><span>{field.displayName}</span>{selected && <span className="ms-auto text-xs text-muted-foreground">{t('reports.alreadyAdded')}</span>}</label>; })}</div></section>)}
      </div>
      <footer className="flex items-center justify-between gap-3 p-3"><span className="text-sm font-semibold text-primary">{pending.length} {t('reports.fieldsSelected')}</span><AppButton variant="primary" size="sm" disabled={!pending.length} onClick={() => { onAdd(fields.filter((field) => pending.includes(field.id))); setPending([]); setOpen(false); }}><Plus data-icon="inline-start" />{t('reports.addSelected')}</AppButton></footer>
    </div>}
  </div>;
}

export function ParameterGroupIcon({ group }: { group: string }) { return group.toLowerCase().includes('audit') ? <FileText className="size-5" /> : <Database className="size-5" />; }
