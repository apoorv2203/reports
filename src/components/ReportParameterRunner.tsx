import { useMemo, useState } from 'react';
import { useT } from '@/providers/I18nProvider';
import { Check, Filter, Play, RefreshCw } from 'lucide-react';
import { AppButton } from '@/components/app/AppButton';
import { AppInput } from '@/components/app/AppInput';
import { AppBadge } from '@/components/app/AppBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ReportParameter } from '@/data/reportTemplates';

type ParameterValues = Record<string, string | string[]>;

export function ReportParameterRunner({ parameters, reportTitle }: { parameters: ReportParameter[]; reportTitle: string }) {
  const t = useT();
  const initialValues = useMemo(() => Object.fromEntries(parameters.map((parameter) => [parameter.id, parameter.defaultValue ?? (parameter.type === 'multi-select' || parameter.type === 'date-range' ? [] : '')])), [parameters]);
  const [values, setValues] = useState<ParameterValues>(initialValues);
  const [appliedValues, setAppliedValues] = useState<ParameterValues | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function runReport() {
    const nextErrors: Record<string, string> = {};
    parameters.forEach((parameter) => {
      const value = values[parameter.id];
      if (parameter.required && (!value || (Array.isArray(value) && (value.length === 0 || value.some((item) => !item))))) nextErrors[parameter.id] = t('reports.requiredParameter');
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setAppliedValues({ ...values });
  }

  return (
    <div className="mb-5 rounded-[16px] border border-border-strong bg-muted p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-primary"><Filter className="h-4 w-4" /> {t('reports.reportParameters')}</div><p className="mt-1 text-[12px] text-muted-foreground">{t('reports.setInputs', { reportTitle })}</p></div>
        {appliedValues && <AppBadge variant="success" size="status"><Check className="h-3.5 w-3.5" /> {t('reports.resultsGenerated')}</AppBadge>}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {parameters.map((parameter) => <ParameterField key={parameter.id} parameter={parameter} value={values[parameter.id]} error={errors[parameter.id]} onChange={(value) => setValues((current) => ({ ...current, [parameter.id]: value }))} />)}
      </div>
      <AppButton onClick={runReport} variant="primary" size="action-md" className="bg-foreground text-background hover:bg-foreground/90">{appliedValues ? <RefreshCw className="h-4 w-4" /> : <Play className="h-4 w-4" />}{appliedValues ? t('reports.runAgain') : t('reports.runReport')}</AppButton>
      {appliedValues && <div className="mt-4 border-t border-border-strong pt-4"><div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{t('reports.appliedFilters')}</div><div className="mt-2 flex flex-wrap gap-2">{parameters.map((parameter) => <span key={parameter.id} className="rounded-full border border-border-light bg-card px-3 py-1.5 text-[11px] text-foreground"><strong>{parameter.label}:</strong> {formatValue(appliedValues[parameter.id])}</span>)}</div></div>}
    </div>
  );
}

function ParameterField({ parameter, value, error, onChange }: { parameter: ReportParameter; value: string | string[]; error?: string; onChange: (value: string | string[]) => void }) {
  const label = <span className="text-[11px] font-bold text-foreground">{parameter.label}{parameter.required && <span className="text-destructive"> *</span>}</span>;
  if (parameter.type === 'date-range') {
    const range = Array.isArray(value) ? value : ['', ''];
    return <label className="flex flex-col gap-1.5">{label}<div className="grid grid-cols-2 gap-2"><AppInput aria-label={`${parameter.label} start`} type="date" value={range[0] ?? ''} onChange={(event) => onChange([event.target.value, range[1] ?? ''])} /><AppInput aria-label={`${parameter.label} end`} type="date" value={range[1] ?? ''} onChange={(event) => onChange([range[0] ?? '', event.target.value])} /></div>{error && <span className="text-[11px] text-destructive">{error}</span>}</label>;
  }
  if (parameter.type === 'multi-select') {
    const selected = Array.isArray(value) ? value : [];
    return <fieldset className="flex flex-col gap-1.5"><legend className="mb-1.5">{label}</legend><div className="flex flex-wrap gap-1.5">{parameter.options?.map((option) => <AppButton type="button" key={option} size="pill" active={selected.includes(option)} onClick={() => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])}>{option}</AppButton>)}</div>{error && <span className="text-[11px] text-destructive">{error}</span>}</fieldset>;
  }
  if (parameter.type === 'single-select') return <label className="flex flex-col gap-1.5">{label}<Select value={String(value)} onValueChange={(next) => next !== null && onChange(next)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All</SelectItem>{parameter.options?.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>{error && <span className="text-[11px] text-destructive">{error}</span>}</label>;
  return <label className="flex flex-col gap-1.5">{label}<AppInput type={parameter.type === 'number' ? 'number' : parameter.type === 'date' ? 'date' : 'text'} value={String(value)} onChange={(event) => onChange(event.target.value)} />{error && <span className="text-[11px] text-destructive">{error}</span>}</label>;
}

function formatValue(value: string | string[]) { return Array.isArray(value) ? value.filter(Boolean).join(' – ') || 'All' : value || 'All'; }
