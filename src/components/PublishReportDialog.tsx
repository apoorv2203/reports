import { useState, useEffect } from "react";
import { publishReport, runReport, parameterizeReport, DRAFT_ID } from "@/api/services/reportService";
import { useT } from "@/providers/I18nProvider";
import { AppButton } from "@/components/app/AppButton";
import { AppInput } from "@/components/app/AppInput";
import { AppTextarea } from "@/components/app/AppForm";
import { AppCard } from "@/components/app/AppCard";
import { AppEmptyState } from "@/components/app/AppEmptyState";
import { ParameterFieldsPopover } from "@/components/ParameterFieldsPopover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CalendarDays,
  GripVertical,
  Hash,
  SlidersHorizontal,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import type { ReportParameterField } from "@/api/types/report";
import type {
  ParameterInputType,
  ReportParameter,
} from "@/data/reportTemplates";

export function PublishReportDialog({
  onClose,
  onPublished,
  reportId,
  onTested,
}: {
  onClose: () => void;
  onPublished: (parameters: ReportParameter[]) => void;
  reportId?: string;
  onTested?: (parameters: ReportParameter[], values: Record<string, unknown>) => Promise<void>;
}) {
  const t = useT();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFields, setSelectedFields] = useState<ReportParameterField[]>(
    [],
  );
  const [parameters, setParameters] = useState<ReportParameter[]>([]);
  const [formats, setFormats] = useState<Record<string, ParameterInputType>>({});
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [runState, setRunState] = useState<'idle' | 'running' | 'success'>('idle');
  const [runError, setRunError] = useState(false);
  const [lastRunPayload, setLastRunPayload] = useState<Record<string, unknown> | null>(null);
  const [lastRunResponse, setLastRunResponse] = useState<unknown | null>(null);
  const [lastRunError, setLastRunError] = useState<string | null>(null);
  const missingParameters = parameters.filter((parameter) => {
    const value = values[parameter.id] ?? parameter.defaultValue;
    if (Array.isArray(value)) return value.length === 0 || value.some((v) => !v);
    return !value;
  });
  const canRun = runState !== 'running' && missingParameters.length === 0;
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [publishTitle, setPublishTitle] = useState<string>(reportId ?? '');
  const [publishDescription, setPublishDescription] = useState<string>('');
  const [publishTitleError, setPublishTitleError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [shouldParameterize, setShouldParameterize] = useState(false);
  useEffect(() => {
    setApplied(false);
    setApplyError(null);
  }, [selectedFields]);

  function configure() {
    setParameters(
      selectedFields.map((field) => ({
        id: field.id,
        table: field.group,
        column: field.id,
        label: field.displayName,
        type:
          formats[field.id] ??
          (field.dataType === "DATE"
            ? "date-range"
            : field.dataType === "NUMBER"
              ? "number"
              : "text"),
        required: true,
        defaultValue: field.dataType === "DATE" ? [] : "",
        options: field.dataType === "STRING" ? undefined : undefined,
      })),
    );

    setStep(3);
  }

  async function autoTestAndAdvance() {
    // when user chooses not to parameterize, run a test and advance to publish on success
    setStep(3);
    setRunState('running'); setRunError(false); setLastRunError(null);
    try {
      const payload = { parameters: {} } as Record<string, unknown>;
      setLastRunPayload(payload);
      let resp: unknown = null;
      if (onTested) {
        await onTested(parameters, values);
        resp = { mocked: 'onTested handler used' };
      } else {
        const targetId = reportId ?? DRAFT_ID;
        resp = await runReport(targetId, payload as any);
      }
      setLastRunResponse(resp);
      setRunState('success');
      // advance to publish step automatically
      setStep(4);
    } catch (e) {
      setLastRunError(e instanceof Error ? e.message : String(e));
      setRunError(true);
      setRunState('idle');
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setPublishError(null);
    try {
      const targetId = reportId ?? DRAFT_ID;
      await publishReport(targetId, { title: publishTitle, description: publishDescription });
      // show success UI and keep dialog open (do not navigate away)
      setPublished(true);
      setPublishError(null);
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : String(e));
    } finally {
      setPublishing(false);
    }
  }

  // Load existing report details when dialog opens if reportId is provided
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!reportId) return;
      try {
        const resp = await import('@/api/services/reportService').then((m) => m.getReport(reportId));
        if (!mounted) return;
        setPublishTitle((resp as any).title ?? publishTitle);
        setPublishDescription((resp as any).description ?? publishDescription);
      } catch (e) {
        // ignore; leave defaults
      }
    })();
    return () => { mounted = false; };
  }, [reportId]);

  async function handleApply() {
    const targetId = reportId ?? DRAFT_ID;
    setApplying(true); setApplyError(null);
    try {
      const payload = {
        parameters: selectedFields.map((field) => ({
          id: field.id,
          table: field.group,
          column: field.id,
          label: field.displayName,
          type: formats[field.id] ?? (field.dataType === 'DATE' ? 'date-range' : field.dataType === 'NUMBER' ? 'number' : 'text'),
        })),
      };
      await parameterizeReport(targetId, payload);
      setApplied(true);
    } catch (err) {
      setApplyError('Unable to apply parameters.');
    } finally { setApplying(false); }
  }

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col bg-white overflow-x-hidden w-full"
      role="region"
      aria-labelledby="publish-title"
    >
      <header className="relative z-30 shrink-0 border-b border-border bg-card px-5 py-5">
        <div className="flex items-center justify-between">
          <h2
            id="publish-title"
            className="font-display text-[16px] font-bold uppercase tracking-[0.08em] text-foreground"
          >
            {t("reports.publishReport")}
          </h2>
          <AppButton
            variant="ghost"
            size="icon-sm"
            className="absolute end-3 top-4 z-40 h-9 w-9 border border-border bg-card text-foreground shadow-sm hover:bg-muted"
            onClick={onClose}
            aria-label={t("reports.closePublish")}
          >
            <X />
          </AppButton>
        </div>
        <nav className="mt-6 flex items-center text-[12px]" aria-label={t('reports.publishProgress')}>
          {/* Step 1 */}
          <div className="flex items-center min-w-0">
            <div className="flex flex-col items-center gap-1 min-w-0 text-center">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${step > 1 ? 'border-[var(--color-success-medium)] bg-white' : step === 1 ? 'bg-[var(--color-success-medium)]' : 'border border-border bg-card'}`}>
                <span className={`${'text-[10px] font-semibold'} ${step > 1 ? 'text-[var(--color-success-medium)]' : step === 1 ? 'text-white' : 'text-foreground'}`}>1</span>
              </div>
              <div className="min-w-0 text-xs text-foreground leading-tight">
                <div className={step > 1 ? 'text-success font-semibold' : step === 1 ? 'text-[var(--color-success-medium)] font-semibold' : 'text-foreground'}>{t('reports.reportDetails')}</div>
              </div>
            </div>
          </div>

          <div className={`flex-1 h-[2px] mx-3 ${step > 1 ? 'bg-success-bg' : 'bg-border'}`} />

          {/* Step 2 */}
          <div className="flex items-center min-w-0">
            <div className="flex flex-col items-center gap-1 min-w-0 text-center">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${step > 2 ? 'border-[var(--color-success-medium)] bg-white' : step === 2 ? 'bg-[var(--color-success-medium)]' : 'border border-border bg-card'}`}>
                <span className={`${'text-[10px] font-semibold'} ${step > 2 ? 'text-[var(--color-success-medium)]' : step === 2 ? 'text-white' : 'text-foreground'}`}>2</span>
              </div>
              <div className="min-w-0 text-xs leading-tight">
                <div className={step > 2 ? 'text-success font-semibold' : step === 2 ? 'text-[var(--color-success-medium)] font-semibold' : 'text-foreground'}>{t('reports.defineParameters')}</div>
              </div>
            </div>
          </div>

          <div className={`flex-1 h-[2px] mx-3 ${step > 2 ? 'bg-success-bg' : 'bg-border'}`} />

          {/* Step 3 */}
          <div className="flex items-center min-w-0">
            <div className="flex flex-col items-center gap-1 min-w-0 text-center">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${step > 3 ? 'border-[var(--color-success-medium)] bg-white' : step === 3 ? 'bg-[var(--color-success-medium)]' : 'border border-border bg-card'}`}>
                <span className={`${'text-[10px] font-semibold'} ${step > 3 ? 'text-[var(--color-success-medium)]' : step === 3 ? 'text-white' : 'text-foreground'}`}>3</span>
              </div>
              <div className="min-w-0 text-xs leading-tight">
                <div className={step > 3 ? 'text-success font-semibold' : step === 3 ? 'text-[var(--color-success-medium)] font-semibold' : 'text-foreground'}>{t('reports.test')}</div>
              </div>
            </div>
          </div>

          <div className={`flex-1 h-[2px] mx-3 ${step > 3 ? 'bg-success-bg' : 'bg-border'}`} />

          {/* Step 4 */}
          <div className="flex items-center min-w-0">
            <div className="flex flex-col items-center gap-1 min-w-0 text-center">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${step === 4 ? 'bg-[var(--color-success-medium)]' : 'border border-border bg-card'}`}>
                <span className={`${'text-[10px] font-semibold'} ${step > 4 ? 'text-[var(--color-success-medium)]' : step === 4 ? 'text-white' : 'text-foreground'}`}>4</span>
              </div>
              <div className="min-w-0 text-xs leading-tight">
                <div className={step === 4 ? 'text-[var(--color-success-medium)] font-semibold' : 'text-foreground'}>{t('reports.publish')}</div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="min-h-0 flex-1 flex flex-col min-w-0">
        <div className="px-5 py-6 overflow-y-auto flex-1 min-h-0 min-w-0">
          <div>
            {step === 4 ? null : (
              <h3 className="font-display text-[18px] font-bold text-foreground">
                {step === 1 ? t('reports.reportDetails') : step === 2 ? t('reports.defineParameters') : t('reports.runReport')}
              </h3>
            )}
              
            {step === 1 && (
              <div>
                <p className="text-[13px] leading-relaxed text-ink-500">{t('reports.reportDetailsHelp')}</p>
                <AppCard variant="report" className="mt-5 p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground">{t('reports.reportName')} <span className="text-destructive">*</span></label>
                      <AppInput value={publishTitle} onChange={(e) => { setPublishTitle(e.target.value); setPublishTitleError(null); }} aria-label={t('reports.reportName')} className="!bg-white !rounded-sm" />
                      {publishTitleError && <p className="text-destructive text-sm mt-1">{publishTitleError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground">{t('reports.description')} <span className="text-muted-foreground">({t('reports.optional')})</span></label>
                      <AppTextarea value={publishDescription} onChange={(e) => setPublishDescription(e.target.value)} className="min-h-[120px]" aria-label={t('reports.description')} />
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={shouldParameterize} onChange={(e) => setShouldParameterize(e.target.checked)} className="size-4" />
                          <span className="text-[12px] font-semibold leading-tight text-foreground">{t('reports.parameterizeBeforePublish') || 'Parameterize this report'}</span>
                        </label>
                    </div>
                  </div>
                </AppCard>
              </div>
            )}
            {step === 2 && (
              <div>
                <p className="text-[13px] leading-relaxed text-ink-500">{t('reports.defineParametersHelp')}</p>
                {/* existing parameters UI (unchanged) */}
                <div className="mt-5">
                  <div className="flex items-start justify-end">
                    <ParameterFieldsPopover
                      reportId={DRAFT_ID}
                      selectedIds={selectedFields.map((field) => field.id)}
                      onAdd={(fields) =>
                        setSelectedFields((current) => [
                          ...current,
                          ...fields.filter((field) => !current.some((item) => item.id === field.id)),
                        ])
                      }
                    >
                      <AppButton type="button" variant="success-outline" size="action-sm" className="flex items-center justify-center gap-2">
                        <Plus className="size-4" />
                        {t('reports.addParameters')}
                      </AppButton>
                    </ParameterFieldsPopover>
                  </div>
                  {selectedFields.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <AppEmptyState className="w-full max-w-xl p-4">
                        <div className="flex items-center justify-center rounded-xl bg-success-bg text-success p-2 mb-2">
                          <SlidersHorizontal className="size-7" aria-hidden="true" />
                        </div>
                        <h4 className="text-[16px] font-bold text-ink-900">{t('reports.noParameters')}</h4>
                        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-500">{t('reports.addFieldsHelp')}</p>
                      </AppEmptyState>
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-col gap-3">
                      {/* reuse existing selectedFields rendering */}
                      {selectedFields.map((field) => {
                        const isDate = field.dataType === 'DATE';
                        const isNumber = field.dataType === 'NUMBER';
                        const currentFormat = formats[field.id] ?? (isDate ? 'date-range' : isNumber ? 'number' : 'text');
                        const options: { value: ParameterInputType; label: string }[] = isDate
                          ? [
                              { value: 'date', label: t('reports.singleValue') },
                              { value: 'date-range', label: t('reports.range') },
                            ]
                          : isNumber
                          ? [
                              { value: 'number', label: t('reports.singleValue') },
                              { value: 'date-range', label: t('reports.range') },
                            ]
                          : [
                              { value: 'text', label: t('reports.singleValue') },
                              { value: 'multi-select', label: t('reports.multipleValues') },
                            ];
                        const Icon = isDate ? CalendarDays : isNumber ? Hash : SlidersHorizontal;
                        return (
                          <div key={field.id} className="relative rounded-md border border-surface-200 px-3 py-3 bg-card/50 hover:bg-card transition">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-md ${isDate ? 'bg-success-bg text-success' : isNumber ? 'bg-warning-bg text-warning' : 'bg-info-bg text-info'}`}>
                                  <Icon className="size-5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[14px] font-semibold text-foreground leading-tight">{field.displayName}</p>
                                  <p className="mt-0.5 text-[12px] text-muted-foreground">{field.dataType}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <AppButton type="button" variant="ghost" size="icon-sm" aria-label={t('reports.removeParameter', { name: field.displayName })} onClick={() => setSelectedFields((current) => current.filter((item) => item.id !== field.id))}>
                                  <Trash2 className="size-5" />
                                </AppButton>
                              </div>
                            </div>
                            <div className="mt-3">
                              <fieldset>
                                <legend className="mb-2 text-[12px] font-semibold text-muted-foreground">{t('reports.inputFormat')}</legend>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                                  {options.map((option) => (
                                    <label key={option.value} className="flex cursor-pointer items-center gap-2 text-[13px] text-foreground">
                                      <input type="radio" name={`format-${field.id}`} checked={currentFormat === option.value} onChange={() => setFormats((current) => ({ ...current, [field.id]: option.value }))} className="size-4 accent-primary" />
                                      {option.label}
                                    </label>
                                  ))}
                                </div>
                              </fieldset>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t('reports.runReportHelp')}</p>
                </div>
                {parameters.map((parameter) => {
                  const value = values[parameter.id] ?? parameter.defaultValue ?? (parameter.type === 'date-range' || parameter.type === 'multi-select' ? [] : '');
                  const setValue = (next: string | string[]) => setValues((current) => ({ ...current, [parameter.id]: next }));
                  return (
                    <label
                      key={parameter.id}
                      className="flex flex-col gap-1 text-[12px] font-semibold text-foreground bg-white rounded-md border border-surface-200 p-3"
                    >
                      <span className="text-[13px] font-medium">
                        {parameter.label} <span className="text-destructive" aria-hidden="true">*</span>
                      </span>
                      {parameter.type === 'date-range' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <AppInput className="h-9 rounded-md" type="date" value={Array.isArray(value) ? value[0] ?? '' : ''} onChange={(event) => setValue([event.target.value, Array.isArray(value) ? value[1] ?? '' : ''])} aria-label={`${parameter.label} start`} />
                          <AppInput className="h-9 rounded-md" type="date" value={Array.isArray(value) ? value[1] ?? '' : ''} onChange={(event) => setValue([Array.isArray(value) ? value[0] ?? '' : '', event.target.value])} aria-label={`${parameter.label} end`} />
                        </div>
                      ) : parameter.type === 'number' ? (
                        <AppInput className="h-9 rounded-md" type="number" value={typeof value === 'string' ? value : ''} onChange={(event) => setValue(event.target.value)} />
                      ) : parameter.type === 'multi-select' ? (
                        <div className="flex flex-col gap-2" aria-label={parameter.label}>
                          {(parameter.options ?? []).map((option) => (
                            <label key={option} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={Array.isArray(value) ? value.includes(option) : false} onChange={() => {
                                const next = Array.isArray(value) ? [...value] : [];
                                if (next.includes(option)) {
                                  setValue(next.filter((v) => v !== option));
                                } else {
                                  next.push(option);
                                  setValue(next);
                                }
                              }} />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : parameter.type === 'single-select' ? (
                        <Select value={typeof value === 'string' ? value : ''} onValueChange={(next) => setValue(String(next))}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('reports.selectValue')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('reports.selectValue')}</SelectItem>
                            {(parameter.options ?? []).map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <AppInput className="h-9 rounded-md" value={typeof value === 'string' ? value : ''} onChange={(event) => setValue(event.target.value)} />
                      )}
                    </label>
                  );
                })}
                <AppButton type="button" disabled={!canRun} onClick={async () => {
                  setRunState('running'); setRunError(false);
                  try {
                    setLastRunError(null);
                    const payload = { parameters: Object.fromEntries(parameters.map((p) => [p.id, values[p.id] ?? p.defaultValue])) } as Record<string, unknown>;
                    setLastRunPayload(payload);
                    let resp: unknown = null;
                    if (onTested) {
                      await onTested(parameters, values);
                      resp = { mocked: 'onTested handler used' };
                    } else {
                      const targetId = reportId ?? DRAFT_ID;
                      resp = await runReport(targetId, payload);
                    }
                    setLastRunResponse(resp);
                    console.log('runReport response', resp);
                    setRunState('success');
                    // Do NOT advance to publish step automatically — show inline success only
                  } catch (e) {
                    setLastRunError(e instanceof Error ? e.message : String(e));
                    setRunError(true);
                    setRunState('idle');
                  }
                }} variant="dark" size="action-md" className="self-start disabled:opacity-75">
                  {runState === 'running' ? t('reports.running') : t('reports.runReport')}
                  <ArrowRight />
                </AppButton>
                {missingParameters.length > 0 && (<p className="mt-2 text-sm text-muted-foreground">{t('reports.missingParameters')}: {missingParameters.map((p) => p.label).join(', ')}</p>)}
                {runError && <p role="alert" className="text-sm text-destructive">{t('reports.runError')}</p>}
                {runState === 'success' && (
                  <div className="mt-3 rounded-lg border border-[var(--color-success-medium)] bg-[var(--color-success-bg)] px-3 py-2 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                        <Check className="h-3 w-3 text-[var(--color-success-medium)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-success-medium)] text-[13px] leading-tight">{published ? t('reports.reportPublished') : t('reports.reportExecuted')}</p>
                        <p className="mt-1 text-xs text-foreground/70">{t('reports.resultsInPreview')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-display text-[18px] font-bold text-foreground">{t('reports.publishReport')}</h2>
                  {published ? (
                    <div className="mt-4 rounded-lg border border-[var(--color-success-medium)] bg-[var(--color-success-bg)] px-3 py-2 text-xs">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                          <Check className="h-3 w-3 text-[var(--color-success-medium)]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-success-medium)] text-[13px] leading-tight">{t('reports.reportPublished')}</p>
                          <p className="mt-1 text-xs text-foreground/70">{t('reports.reportPublishedHelp')}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg border border-[var(--color-success-medium)] bg-[var(--color-success-bg)] px-3 py-2 text-xs">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                          <Check className="h-3 w-3 text-[var(--color-success-medium)]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-success-medium)] text-[13px] leading-tight">{t('reports.reportReadyToPublish')}</p>
                          <p className="mt-1 text-xs text-foreground/70">{t('reports.reportReadyToPublishHelp')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <AppCard variant="report" className="p-4">
                  <dl className="divide-y divide-border">
                    <div className="grid grid-cols-[minmax(7rem,0.7fr)_minmax(0,1.5fr)] gap-4 py-3 first:pt-0 last:pb-0"><dt className="font-semibold text-muted-foreground">{t('reports.reportName')}</dt><dd className="min-w-0 text-foreground">{publishTitle || reportId || t('reports.notAvailable')}</dd></div>
                    <div className="grid grid-cols-[minmax(7rem,0.7fr)_minmax(0,1.5fr)] gap-4 py-3"><dt className="font-semibold text-muted-foreground">{t('reports.description')}</dt><dd className="min-w-0 text-foreground">{publishDescription || t('reports.notAvailable')}</dd></div>
                    <div className="grid grid-cols-[minmax(7rem,0.7fr)_minmax(0,1.5fr)] gap-4 py-3"><dt className="font-semibold text-muted-foreground">{t('reports.reportParameters')}</dt><dd className="min-w-0 text-foreground">{t('reports.parametersConfigured', { count: parameters.length })}</dd></div>
                    <div className="grid grid-cols-[minmax(7rem,0.7fr)_minmax(0,1.5fr)] gap-4 py-3 last:pb-0"><dt className="font-semibold text-muted-foreground">{t('reports.lastTest')}</dt><dd className="min-w-0 text-foreground"><span className="text-success">{t('reports.successful')}</span><span className="mx-2" aria-hidden="true">·</span>{t('reports.lastTestDate')}</dd></div>
                  </dl>
                </AppCard>
              </div>
            )}
          </div>
        </div>
        <footer className="mt-auto flex items-center justify-between border-t border-border bg-card px-5 py-4 overflow-x-hidden">
          <AppButton
            className={step === 1 ? 'invisible' : ''}
            onClick={() => {
              if (step === 2) setStep(1);
              else if (step === 3) setStep(2);
              else if (step === 4) setStep(3);
              else onClose();
            }}
            variant="ghost"
            size="action-md"
          >
            <ArrowLeft />
            {step === 1 ? t('reports.cancel') : t('reports.back')}
          </AppButton>

          {step === 1 ? (
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap sm:justify-end w-full">
              <AppButton
                variant="primary"
                size="action-md"
                className=""
                onClick={async () => {
                  if (!publishTitle || !publishTitle.trim()) {
                    setPublishTitleError(t('reports.validation.reportNameRequired'));
                    return;
                  }
                  // if user wants to parameterize, go to step 2; otherwise run an automatic test and advance
                  if (shouldParameterize) {
                    setStep(2);
                  } else {
                    await autoTestAndAdvance();
                  }
                }}
              >
                {t('reports.continue')}
                <ArrowRight />
              </AppButton>
            </div>
          ) : step === 2 ? (
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap sm:justify-end w-full">
              <AppButton
                disabled={selectedFields.length === 0 || applying}
                onClick={handleApply}
                variant="outline"
                size="action-md"
                className="px-4 flex items-center gap-2"
              >
                {applying ? t('reports.applying') : applied ? (
                  <>
                    <Check className="h-4 w-4 text-success" />
                    {t('reports.applied')}
                  </>
                ) : t('reports.validate')}
              </AppButton>
              {applyError && <div className="text-destructive text-sm">{applyError}</div>}
              <AppButton
                disabled={!applied || selectedFields.length === 0}
                onClick={configure}
                variant="primary"
                size="report-publish"
                className="justify-center w-auto"
              >
                {t('reports.testAndPublish')}
                <ArrowRight />
              </AppButton>
            </div>
          ) : (
            <>
              <AppButton
                onClick={handlePublish}
                variant="dark"
                size="action-md"
                disabled={!(step === 4 || (step === 3 && runState === 'success')) || publishing || published}
                className="disabled:opacity-75"
              >
                {publishing ? t('common.loading') : published ? <><Check />{t('reports.published')}</> : <><Check />{t('reports.publishReport')}</>}
              </AppButton>
              {publishError && <div className="text-destructive text-sm">{publishError}</div>}
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
