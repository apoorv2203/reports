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
  // no pending selection state — checking adds immediately
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function loadFields(search = '') {
    setLoading(true); setError(false);
    try { const response = await getReportParameterFields(reportId, search); setFields(response.items); }
    catch { setError(true); }
    finally { setLoading(false); }
  }
  function toggleOpen() { const next = !open; setOpen(next); if (next) { void loadFields(query); } }
  function handleAddById(id: string) {
    const field = fields.find((f) => f.id === id);
    if (field) onAdd([field]);
  }
  const grouped = fields.reduce<Record<string, ReportParameterField[]>>((groups, field) => { (groups[field.group] ??= []).push(field); return groups; }, {});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  function toggleGroup(name: string) { setExpandedGroups((cur) => ({ ...cur, [name]: !cur[name] })); }

  return <div className="w-full">
    <div onClick={toggleOpen}>{children}</div>
    {open && <div className="mt-3 rounded-lg border border-border bg-white text-foreground shadow-sm max-h-[calc(100vh-260px)] flex flex-col min-h-0 max-w-full overflow-x-hidden">
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 pt-2 pb-2 flex-shrink-0">
          <Search className="size-4 text-muted-foreground" />
          <AppInput aria-label={t('reports.searchFields')} value={query} onChange={(event) => { setQuery(event.target.value); void loadFields(event.target.value); }} placeholder={t('reports.searchFields')} size="inline" />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto border-t border-b border-border px-3 min-w-0">
          {loading && <p className="py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</p>}
          {error && <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground"><p>{t('reports.fieldsError')}</p><AppButton size="sm" variant="outline" onClick={() => void loadFields(query)}>{t('common.retry')}</AppButton></div>}
          {!loading && !error && Object.keys(grouped).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{t('reports.noFieldsFound')}</p>}
          {!loading && !error && Object.entries(grouped).map(([group, groupFields]) => {
            const expanded = !!expandedGroups[group];
            return (
              <section key={group} className="py-2">
                <button type="button" onClick={() => toggleGroup(group)} aria-expanded={expanded} className="flex w-full items-center gap-2 pb-1 text-sm font-bold hover:opacity-90">
                  <ChevronDown className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  <Database className="size-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">{group}</span>
                </button>
                <div className={`flex flex-col gap-1 ${expanded ? '' : 'hidden'}`}>
                  {groupFields.map((field) => {
                    const selected = selectedIds.includes(field.id);
                    return (
                      <label key={field.id} className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${selected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'}`}>
                        <Checkbox checked={selected} disabled={selected} onChange={() => handleAddById(field.id)} />
                        <span>{field.displayName}</span>
                        {selected && <span className="ms-auto text-xs text-muted-foreground">{t('reports.alreadyAdded')}</span>}
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        {/* footer removed: checking a field adds it immediately */}
      </div>
    </div>}
  </div>;
}

export function ParameterGroupIcon({ group }: { group: string }) { return group.toLowerCase().includes('audit') ? <FileText className="size-5" /> : <Database className="size-5" />; }
