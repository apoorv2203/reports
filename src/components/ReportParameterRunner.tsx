import { useMemo, useState } from 'react';
import { Check, Filter, Play, RefreshCw } from 'lucide-react';
import { AppButton } from '@/components/app/AppButton';
import { AppInput } from '@/components/app/AppInput';
import { AppBadge } from '@/components/app/AppBadge';
import type { ReportParameter } from '@/data/reportTemplates';

type ParameterValues = Record<string, string | string[]>;

export function ReportParameterRunner({ parameters, reportTitle }: { parameters: ReportParameter[]; reportTitle: string }) {
  const initialValues = useMemo(() => Object.fromEntries(parameters.map((parameter) => [parameter.id, parameter.defaultValue ?? (parameter.type === 'multi-select' || parameter.type === 'date-range' ? [] : '')])), [parameters]);
  const [values, setValues] = useState<ParameterValues>(initialValues);
  const [appliedValues, setAppliedValues] = useState<ParameterValues | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function runReport() {
    const nextErrors: Record<string, string> = {};
    parameters.forEach((parameter) => {
      const value = values[parameter.id];
      if (parameter.required && (!value || (Array.isArray(value) && (value.length === 0 || value.some((item) => !item))))) nextErrors[parameter.id] = 'This parameter is required.';
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setAppliedValues({ ...values });
  }

  return (
    <div className="mb-5 rounded-[16px] border border-border-strong bg-surface-secondary p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-mint-700"><Filter className="h-4 w-4" /> Report parameters</div><p className="mt-1 text-[12px] text-ink-500">Set the inputs used to generate {reportTitle}.</p></div>
        {appliedValues && <AppBadge variant="success" size="status" className="rounded-full"><Check className="h-3.5 w-3.5" /> Results generated</AppBadge>}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {parameters.map((parameter) => <ParameterField key={parameter.id} parameter={parameter} value={values[parameter.id]} error={errors[parameter.id]} onChange={(value) => setValues((current) => ({ ...current, [parameter.id]: value }))} />)}
      </div>
      <AppButton onClick={runReport} variant="primary" size="action-md" className="mt-4">{appliedValues ? <RefreshCw className="h-4 w-4" /> : <Play className="h-4 w-4" />}{appliedValues ? 'Run again' : 'Run report'}</AppButton>
      {appliedValues && <div className="mt-4 border-t border-border-strong pt-4"><div className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">Applied filters</div><div className="mt-2 flex flex-wrap gap-2">{parameters.map((parameter) => <span key={parameter.id} className="rounded-full border border-border-light bg-white px-3 py-1.5 text-[11px] text-ink-700"><strong>{parameter.label}:</strong> {formatValue(appliedValues[parameter.id])}</span>)}</div></div>}
    </div>
  );
}

function ParameterField({ parameter, value, error, onChange }: { parameter: ReportParameter; value: string | string[]; error?: string; onChange: (value: string | string[]) => void }) {
  const label = <span className="text-[11px] font-bold text-ink-700">{parameter.label}{parameter.required && <span className="text-red-600"> *</span>}</span>;
  if (parameter.type === 'date-range') {
    const range = Array.isArray(value) ? value : ['', ''];
    return <label className="flex flex-col gap-1.5">{label}<div className="grid grid-cols-2 gap-2"><input aria-label={`${parameter.label} start`} type="date" value={range[0] ?? ''} onChange={(event) => onChange([event.target.value, range[1] ?? ''])} className="text-[12px]" /><input aria-label={`${parameter.label} end`} type="date" value={range[1] ?? ''} onChange={(event) => onChange([range[0] ?? '', event.target.value])} className="text-[12px]" /></div>{error && <span className="text-[11px] text-red-600">{error}</span>}</label>;
  }
  if (parameter.type === 'multi-select') {
    const selected = Array.isArray(value) ? value : [];
    return <fieldset className="flex flex-col gap-1.5"><legend className="mb-1.5">{label}</legend><div className="flex flex-wrap gap-1.5">{parameter.options?.map((option) => <AppButton type="button" key={option} size="pill" active={selected.includes(option)} onClick={() => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])}>{option}</AppButton>)}</div>{error && <span className="text-[11px] text-red-600">{error}</span>}</fieldset>;
  }
  if (parameter.type === 'single-select') return <label className="flex flex-col gap-1.5">{label}<select value={String(value)} onChange={(event) => onChange(event.target.value)} className="text-[12px]"><option value="">All</option>{parameter.options?.map((option) => <option key={option}>{option}</option>)}</select>{error && <span className="text-[11px] text-red-600">{error}</span>}</label>;
  return <label className="flex flex-col gap-1.5">{label}<input type={parameter.type === 'number' ? 'number' : parameter.type === 'date' ? 'date' : 'text'} value={String(value)} onChange={(event) => onChange(event.target.value)} className="text-[12px]" />{error && <span className="text-[11px] text-red-600">{error}</span>}</label>;
}

function formatValue(value: string | string[]) { return Array.isArray(value) ? value.filter(Boolean).join(' – ') || 'All' : value || 'All'; }
