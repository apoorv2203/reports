import { useMemo, useState } from 'react';
import { Check, Filter, Play, RefreshCw } from 'lucide-react';
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
    <div className="mb-5 rounded-[16px] border border-[#dce5e1] bg-[#f7fbf9] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-mint-700"><Filter className="h-4 w-4" /> Report parameters</div><p className="mt-1 text-[12px] text-ink-500">Set the inputs used to generate {reportTitle}.</p></div>
        {appliedValues && <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1 text-[11px] font-bold text-mint-700"><Check className="h-3.5 w-3.5" /> Results generated</span>}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {parameters.map((parameter) => <ParameterField key={parameter.id} parameter={parameter} value={values[parameter.id]} error={errors[parameter.id]} onChange={(value) => setValues((current) => ({ ...current, [parameter.id]: value }))} />)}
      </div>
      <button onClick={runReport} className="mt-4 inline-flex items-center gap-2 rounded-[11px] bg-navy-900 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-ink-900">{appliedValues ? <RefreshCw className="h-4 w-4" /> : <Play className="h-4 w-4" />}{appliedValues ? 'Run again' : 'Run report'}</button>
      {appliedValues && <div className="mt-4 border-t border-[#dce5e1] pt-4"><div className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">Applied filters</div><div className="mt-2 flex flex-wrap gap-2">{parameters.map((parameter) => <span key={parameter.id} className="rounded-full border border-[#d2d2d7] bg-white px-3 py-1.5 text-[11px] text-ink-700"><strong>{parameter.label}:</strong> {formatValue(appliedValues[parameter.id])}</span>)}</div></div>}
    </div>
  );
}

function ParameterField({ parameter, value, error, onChange }: { parameter: ReportParameter; value: string | string[]; error?: string; onChange: (value: string | string[]) => void }) {
  const label = <span className="text-[11px] font-bold text-ink-700">{parameter.label}{parameter.required && <span className="text-red-600"> *</span>}</span>;
  if (parameter.type === 'date-range') {
    const range = Array.isArray(value) ? value : ['', ''];
    return <label className="flex flex-col gap-1.5">{label}<div className="grid grid-cols-2 gap-2"><input aria-label={`${parameter.label} start`} type="date" value={range[0] ?? ''} onChange={(event) => onChange([event.target.value, range[1] ?? ''])} className="input text-[12px]" /><input aria-label={`${parameter.label} end`} type="date" value={range[1] ?? ''} onChange={(event) => onChange([range[0] ?? '', event.target.value])} className="input text-[12px]" /></div>{error && <span className="text-[11px] text-red-600">{error}</span>}</label>;
  }
  if (parameter.type === 'multi-select') {
    const selected = Array.isArray(value) ? value : [];
    return <fieldset className="flex flex-col gap-1.5"><legend className="mb-1.5">{label}</legend><div className="flex flex-wrap gap-1.5">{parameter.options?.map((option) => <button type="button" key={option} aria-pressed={selected.includes(option)} onClick={() => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])} className={`rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${selected.includes(option) ? 'border-navy-900 bg-navy-900 text-white' : 'border-[#d2d2d7] bg-white text-ink-500'}`}>{option}</button>)}</div>{error && <span className="text-[11px] text-red-600">{error}</span>}</fieldset>;
  }
  if (parameter.type === 'single-select') return <label className="flex flex-col gap-1.5">{label}<select value={String(value)} onChange={(event) => onChange(event.target.value)} className="input text-[12px]"><option value="">All</option>{parameter.options?.map((option) => <option key={option}>{option}</option>)}</select>{error && <span className="text-[11px] text-red-600">{error}</span>}</label>;
  return <label className="flex flex-col gap-1.5">{label}<input type={parameter.type === 'number' ? 'number' : parameter.type === 'date' ? 'date' : 'text'} value={String(value)} onChange={(event) => onChange(event.target.value)} className="input text-[12px]" />{error && <span className="text-[11px] text-red-600">{error}</span>}</label>;
}

function formatValue(value: string | string[]) { return Array.isArray(value) ? value.filter(Boolean).join(' – ') || 'All' : value || 'All'; }
