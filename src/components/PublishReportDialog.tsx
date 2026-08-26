import { useState } from "react";
import { useT } from "@/providers/I18nProvider";
import { AppButton } from "@/components/app/AppButton";
import { AppInput } from "@/components/app/AppInput";
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
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <div>
          <h3 className="font-display text-[18px] font-bold text-foreground">
            {step === 1 ? t("reports.defineParameters") : "Configure inputs"}
          </h3>
          {step === 1 ? (
            <div>
              <p className="text-[13px] leading-relaxed text-ink-500">
                {t("reports.defineParametersHelp")}
              </p>
              <section className="mt-5 min-h-[420px] rounded-[14px] border border-surface-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-ink-900">
                    {t("reports.reportParameters")} ({selectedFields.length})
                  </h3>
                  <ParameterFieldsPopover
                    reportId="draft"
                    selectedIds={selectedFields.map((field) => field.id)}
                    onAdd={(fields) =>
                      setSelectedFields((current) => [
                        ...current,
                        ...fields.filter(
                          (field) =>
                            !current.some((item) => item.id === field.id),
                        ),
                      ])
                    }
                  >
                    <AppButton
                      type="button"
                      variant="success-outline"
                      size="action-md"
                    >
                      {selectedFields.length
                        ? t("reports.addMore")
                        : t("reports.addParameters")}
                    </AppButton>
                  </ParameterFieldsPopover>
                </div>
                {selectedFields.length === 0 ? (
                  <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex size-24 items-center justify-center rounded-xl border-2 border-surface-300 text-[44px] text-surface-400">
                      ☷
                    </div>
                    <h4 className="text-[16px] font-bold text-ink-900">
                      {t("reports.noParameters")}
                    </h4>
                    <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-500">
                      {t("reports.addFieldsHelp")}
                    </p>
                    <ParameterFieldsPopover
                      reportId="draft"
                      selectedIds={selectedFields.map((field) => field.id)}
                      onAdd={(fields) =>
                        setSelectedFields((current) => [
                          ...current,
                          ...fields.filter(
                            (field) =>
                              !current.some((item) => item.id === field.id),
                          ),
                        ])
                      }
                    >
                      <AppButton
                        type="button"
                        variant="success"
                        size="action-md"
                        className="mt-6"
                      >
                        {t("reports.addParameters")}
                      </AppButton>
                    </ParameterFieldsPopover>
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
                          className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 rounded-[14px] border border-surface-200 px-4 py-4"
                        >
                          <GripVertical
                            className="size-5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <div
                            className={`flex size-14 shrink-0 items-center justify-center rounded-lg ${isDate ? "bg-success-bg text-success" : isNumber ? "bg-warning-bg text-warning" : "bg-info-bg text-info"}`}
                          >
                            <Icon className="size-7" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 self-center">
                            <p className="text-[15px] font-bold text-foreground">
                              {field.displayName}
                            </p>
                            <p className="mt-2 text-[13px] text-muted-foreground">
                              {field.dataType}
                            </p>
                          </div>
                          <fieldset className="min-w-0 self-center">
                            <legend className="mb-2 text-[12px] font-semibold text-muted-foreground">
                              {t("reports.inputFormat")}
                            </legend>
                            <div className="flex min-w-0 flex-col gap-2">
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
              </section>
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
              size="action-md"
              className="w-full justify-center"
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
