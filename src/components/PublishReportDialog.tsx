import { useState } from "react";
import { useT } from "@/providers/I18nProvider";
import { AppButton } from "@/components/app/AppButton";
import { AppInput } from "@/components/app/AppInput";
import { AppCard } from "@/components/app/AppCard";
import { AppEmptyState } from "@/components/app/AppEmptyState";
import { ParameterFieldsPopover } from "@/components/ParameterFieldsPopover";
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
}: {
  onClose: () => void;
  onPublished: (parameters: ReportParameter[]) => void;
}) {
  const t = useT();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFields, setSelectedFields] = useState<ReportParameterField[]>(
    [],
  );
  const [parameters, setParameters] = useState<ReportParameter[]>([]);
  const [formats, setFormats] = useState<Record<string, ParameterInputType>>(
    {},
  );

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
      })),
    );

    setStep(2);
  }

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col bg-muted"
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
        <ol
          className="mt-6 flex items-center justify-between text-[12px]"
          aria-label={t("reports.publishProgress")}
        >
          <li className="flex items-center gap-2 font-semibold text-primary">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              1
            </span>
            {t("reports.defineParameters")}
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full border border-border bg-card">
              2
            </span>
            {t("reports.test")}
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full border border-border bg-card">
              3
            </span>
            {t("reports.publish")}
          </li>
        </ol>
      </header>
      <div className="min-h-0 flex-1 flex flex-col">
        <div className="px-5 py-6 overflow-y-auto flex-1 min-h-0">
          <div>
          <h3 className="font-display text-[18px] font-bold text-foreground">
            {step === 1 ? t("reports.defineParameters") : "Configure inputs"}
          </h3>
          {step === 1 ? (
            <div>
              <p className="text-[13px] leading-relaxed text-ink-500">
                {t("reports.defineParametersHelp")}
              </p>
              <AppCard variant="report" className="mt-5 p-4">
                <div className="flex items-start justify-end">
                  <ParameterFieldsPopover
                    reportId="draft"
                    selectedIds={selectedFields.map((field) => field.id)}
                    onAdd={(fields) =>
                      setSelectedFields((current) => [
                        ...current,
                        ...fields.filter(
                          (field) => !current.some((item) => item.id === field.id),
                        ),
                      ])
                    }
                  >
                    <AppButton
                      type="button"
                      variant="success-outline"
                      size="action-sm"
                      className="flex items-center justify-center gap-2"
                    >
                      <Plus className="size-4" />
                      {t("reports.addParameters")}
                    </AppButton>
                  </ParameterFieldsPopover>
                </div>
                {selectedFields.length === 0 ? (
                  <div className="flex flex-col items-center">
                    <AppEmptyState className="w-full max-w-xl p-4">
                      <div className="flex items-center justify-center rounded-xl bg-success-bg text-success p-2 mb-2">
                        <SlidersHorizontal className="size-7" aria-hidden="true" />
                      </div>
                      <h4 className="text-[16px] font-bold text-ink-900">
                        {t("reports.noParameters")}
                      </h4>
                      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-500">
                        {t("reports.addFieldsHelp")}
                      </p>
                    </AppEmptyState>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-col gap-3">
                    {selectedFields.map((field) => {
                      const isDate = field.dataType === "DATE";
                      const isNumber = field.dataType === "NUMBER";
                      const currentFormat =
                        formats[field.id] ??
                        (isDate ? "date-range" : isNumber ? "number" : "text");
                      const options: {
                        value: ParameterInputType;
                        label: string;
                      }[] = isDate
                        ? [
                            { value: "date", label: t("reports.singleValue") },
                            { value: "date-range", label: t("reports.range") },
                          ]
                        : isNumber
                          ? [
                              {
                                value: "number",
                                label: t("reports.singleValue"),
                              },
                              {
                                value: "date-range",
                                label: t("reports.range"),
                              },
                            ]
                          : [
                              {
                                value: "text",
                                label: t("reports.singleValue"),
                              },
                              {
                                value: "multi-select",
                                label: t("reports.multipleValues"),
                              },
                            ];
                      const Icon = isDate
                        ? CalendarDays
                        : isNumber
                          ? Hash
                          : SlidersHorizontal;
                      return (
                        <div
                          key={field.id}
                          className="relative rounded-md border border-surface-200 px-3 py-3 bg-card/50 hover:bg-card transition"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`flex size-10 shrink-0 items-center justify-center rounded-md ${isDate ? 'bg-success-bg text-success' : isNumber ? 'bg-warning-bg text-warning' : 'bg-info-bg text-info'}`}>
                                <Icon className="size-5" aria-hidden="true" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[14px] font-semibold text-foreground leading-tight">
                                  {field.displayName}
                                </p>
                                <p className="mt-0.5 text-[12px] text-muted-foreground">
                                  {field.dataType}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <AppButton
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={t("reports.removeParameter", {
                                  name: field.displayName,
                                })}
                                onClick={() =>
                                  setSelectedFields((current) =>
                                    current.filter((item) => item.id !== field.id),
                                  )
                                }
                              >
                                <Trash2 className="size-5" />
                              </AppButton>
                            </div>
                          </div>

                          <div className="mt-3">
                            <fieldset>
                              <legend className="mb-2 text-[12px] font-semibold text-muted-foreground">
                                {t("reports.inputFormat")}
                              </legend>
                              <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                                {options.map((option) => (
                                  <label
                                    key={option.value}
                                    className="flex cursor-pointer items-center gap-2 text-[13px] text-foreground"
                                  >
                                    <input
                                      type="radio"
                                      name={`format-${field.id}`}
                                      checked={currentFormat === option.value}
                                      onChange={() =>
                                        setFormats((current) => ({
                                          ...current,
                                          [field.id]: option.value,
                                        }))
                                      }
                                      className="size-4 accent-primary"
                                    />
                                    {option.label}
                                  </label>
                                ))}
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-start gap-3 rounded-lg border border-info/30 bg-info-bg px-4 py-3 text-[13px] text-info">
                      <span aria-hidden="true">i</span>
                      <p>
                        {t("reports.requiredNotice")}
                        <br />
                        {t("reports.savedNotice")}
                      </p>
                    </div>
                  </div>
                )}
              </AppCard>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {parameters.map((parameter, index) => (
                <div
                  key={parameter.id}
                  className="grid gap-3 rounded-[14px] border border-surface-200 p-4 md:grid-cols-[1fr_170px_auto]"
                >
                  <label className="text-[11px] font-bold text-ink-500">
                    Display label
                    <input
                      value={parameter.label}
                      onChange={(event) =>
                        setParameters((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, label: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="input mt-1.5 text-[12px]"
                    />
                  </label>
                  <label className="text-[11px] font-bold text-ink-500">
                    Input type
                    <select
                      value={parameter.type}
                      onChange={(event) =>
                        setParameters((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...item,
                                  type: event.target
                                    .value as ParameterInputType,
                                }
                              : item,
                          ),
                        )
                      }
                      className="input mt-1.5 text-[12px]"
                    >
                      <option value="date">Date</option>
                      <option value="date-range">Date range</option>
                      <option value="single-select">Single select</option>
                      <option value="multi-select">Multi select</option>
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 self-end pb-2 text-[11px] font-bold text-ink-700">
                    <input
                      type="checkbox"
                      checked={parameter.required}
                      onChange={(event) =>
                        setParameters((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, required: event.target.checked }
                              : item,
                          ),
                        )
                      }
                      className="accent-emerald-500"
                    />
                    Required
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        <footer className="mt-auto flex items-center justify-between border-t border-border bg-card px-5 py-4">
          <AppButton
            className={step === 1 ? "invisible" : ""}
            onClick={() => (step === 2 ? setStep(1) : onClose())}
            variant="ghost"
            size="action-md"
          >
            <ArrowLeft />
            {step === 2 ? "Back" : "Cancel"}
          </AppButton>
          {step === 1 ? (
            <AppButton
              disabled={selectedFields.length === 0}
              onClick={configure}
              variant="primary"
              size="report-publish"
              className="justify-center"
            >
              {t("reports.saveAndTest")}
              <ArrowRight />
            </AppButton>
          ) : (
            <AppButton
              onClick={() => onPublished(parameters)}
              variant="primary"
              size="action-md"
            >
              <Check />
              Publish report
            </AppButton>
          )}
        </footer>
      </div>
    </div>
  );
}
