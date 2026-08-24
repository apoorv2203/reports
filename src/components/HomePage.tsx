import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChartBar as BarChart3,
  ChartLine as LineChart,
  ChevronDown,
  Eye,
  Clock3,
  CreditCard as Edit3,
  Ellipsis,
  FileText,
  Info,
  RefreshCw,
  Trash2,
  LockKeyhole,
  MessageSquareText,
  Pin,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import {
  myWidgets,
  pinnedReports,
  recentSessions,
  recommendedWidgets,
  scheduledDeliveries,
  type Widget,
} from "@/data/homeData";
import type { HomeWidget, WidgetData } from "@/services/widgetService";
import { useFormat, useT } from "@/providers/I18nProvider";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppBadge } from "@/components/app/AppBadge";
import { AppInput } from "@/components/app/AppInput";
import { AppPageHeader } from "@/components/app/AppPageHeader";
import { AppSectionHeader } from "@/components/app/AppSectionHeader";

type HomePageProps = {
  onNewSession: (question?: string) => void;
  onRunPinnedReport: (reportName: string) => void;
  onOpenReports: () => void;
  onCreateReport: () => void;
  onOpenWidgets: () => void;
  onEditWidget: (widget: Widget) => void;
  homeWidgetIds: string[];
  homeWidgets?: HomeWidget[];
  widgetData?: Record<string, WidgetData | undefined>;
  widgetLoading?: Record<string, boolean>;
  widgetErrors?: Record<string, boolean>;
  onRetryWidget?: (id: string) => void;
  onRemoveWidget: (id: string) => void;
  isNewUser?: boolean;
  userName?: string;
};

export function HomePage({
  onNewSession,
  onRunPinnedReport,
  onOpenReports,
  onCreateReport,
  onOpenWidgets,
  onEditWidget,
  homeWidgetIds,
  homeWidgets,
  widgetData = {},
  widgetLoading = {},
  widgetErrors = {},
  onRetryWidget,
  onRemoveWidget,
  isNewUser = false,
  userName = "Rahul",
}: HomePageProps) {
  const t = useT();
  const { relativeLabel } = useFormat();
  const [addedWidgets, setAddedWidgets] = useState<string[]>([]);
  const [removedWidgets, setRemovedWidgets] = useState<string[]>([]);
  const [maximizedWidget, setMaximizedWidget] = useState<Widget | null>(null);
  const [question, setQuestion] = useState("");
  const [pinnedVisible, setPinnedVisible] = useState(5);

  function addWidget(id: string) {
    setAddedWidgets((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto bg-surface">
        <div className="mx-auto max-w-[1480px] px-5 py-6 sm:px-8 lg:px-10">
          <AppPageHeader
            title={isNewUser ? t("home.welcomeNew", { name: userName }) : t("home.goodMorning", { name: userName })}
            description={isNewUser ? t("home.subtitleNew") : t("home.subtitleReturning")}
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (question.trim()) onNewSession(question.trim());
            }}
            className="mt-6 flex h-10 w-[67.5%] items-center gap-2 rounded-lg border border-mint-300 bg-surface px-3 shadow-card"
          >
            <Sparkles className="h-5 w-5 shrink-0 text-mint-600" />
            <AppInput
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t("home.askAnything")}
              className="min-w-0 flex-1 border-0 bg-transparent text-[13px] shadow-none outline-none placeholder:text-ink-500 focus-visible:ring-0"
              aria-label={t("home.askAnythingLabel")}
            />
            <AppButton variant="primary" type="submit" aria-label={t("home.submitQuestion")} className="size-8 rounded-lg">
              <Send data-icon="inline-start" />
            </AppButton>
          </form>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              t("home.exampleQ1"),
              t("home.exampleQ2"),
              t("home.exampleQ3"),
              t("home.exampleQ4"),
            ].map((example) => (
              <AppButton
                variant="secondary"
                type="button"
                key={example}
                onClick={() => {
                  setQuestion(example);
                  onNewSession(example);
                }}
                className="h-auto px-3 py-1.5 text-[11px] text-ink-500"
              >
                {example}
              </AppButton>
            ))}
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-[275px_minmax(0,1fr)]">
            <aside className="flex flex-col gap-4">
              <SideCard
                title={t("home.scheduledDeliveries")}
                icon={<Clock3 className="h-4 w-4" />}
                onViewAll={onOpenReports}
              >
                {isNewUser ? (
                  <EmptySideState
                    icon={<Clock3 className="h-9 w-9" />}
                    title={t("home.noScheduledDeliveries")}
                    text={t("home.scheduledEmpty")}
                    action={t("home.scheduleReport")}
                    onAction={onOpenReports}
                  />
                ) : (
                  <>
                    <div className="divide-y divide-surface-100">
                      {scheduledDeliveries.map((delivery) => (
                        <div
                          key={delivery.name}
                          className="flex items-center gap-2.5 py-2.5"
                        >
                          <AppBadge variant={delivery.format === "PDF" ? "danger" : "success"} className="flex size-7 shrink-0 items-center justify-center p-0 text-[8px]">
                            {delivery.format === "PDF"
                              ? t("common.pdf")
                              : t("common.xlsx")}
                          </AppBadge>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[11px] font-bold text-navy-900">
                              {delivery.name}
                            </span>
                            <span className="mt-0.5 block text-[10px] text-ink-500">
                              {delivery.time}
                            </span>
                          </span>
                          <AppBadge variant="success" className="rounded-md px-2 py-1 text-[9px] font-bold">
                            {t("common.delivered")}
                          </AppBadge>
                        </div>
                      ))}
                    </div>
                    <AppButton
                      variant="ghost"
                      type="button"
                      onClick={onOpenReports}
                      className="mt-2 h-auto w-full justify-center border-t border-surface-100 pt-3 text-[11px] font-bold"
                    >
                      <Plus data-icon="inline-start" /> {t("home.scheduleReport")}
                    </AppButton>
                  </>
                )}
              </SideCard>
              <SideCard
                title={t("home.pinnedReports")}
                icon={<Pin className="h-4 w-4" />}
                onViewAll={onOpenReports}
              >
                {isNewUser ? (
                  <EmptySideState
                    icon={<FileText className="h-9 w-9" />}
                    title={t("home.noPinnedReports")}
                    text={t("home.pinEmpty")}
                    action={t("home.exploreReports")}
                    onAction={onOpenReports}
                  />
                ) : (
                  <div className="divide-y divide-surface-100">
                    {pinnedReports.slice(0, pinnedVisible).map((report) => (
                      <AppButton
                        variant="ghost"
                        type="button"
                        key={report.name}
                        onClick={() => onRunPinnedReport(report.name)}
                        className="h-auto w-full justify-start gap-2.5 py-2.5 text-left"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mint-50 text-mint-700">
                          <FileText className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-bold text-navy-900">
                            {report.name}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-ink-500">
                            {relativeLabel(report.updated)}
                          </span>
                        </span>
                        <Star
                          className={`h-3.5 w-3.5 shrink-0 ${report.pinned ? "fill-amber-400 text-amber-400" : "text-ink-300"}`}
                        />
                      </AppButton>
                    ))}
                  </div>
                )}
                {pinnedVisible < pinnedReports.length && (
                  <AppButton
                    variant="ghost"
                    type="button"
                    onClick={() => setPinnedVisible((count) => Math.min(count + 5, pinnedReports.length))}
                    className="mt-3 h-auto w-full justify-center border-t border-surface-100 pt-3 text-[11px] font-bold text-mint-700"
                  >
                    {t("common.viewMore")} <ChevronDown data-icon="inline-end" />
                  </AppButton>
                )}
                <AppButton
                  variant="ghost"
                  type="button"
                  onClick={onCreateReport}
                  className="mt-3 h-auto w-full justify-center border-t border-surface-100 pt-3 text-[11px] font-bold text-mint-700"
                >
                  <Plus data-icon="inline-start" /> {t("home.createReportFromTemplate")}
                </AppButton>
              </SideCard>
            </aside>

            <div className="min-w-0">
              <AppSectionHeader
                title={t("home.myWidgets")}
                action={<AppButton variant="ghost" type="button" onClick={onOpenWidgets} className="h-auto px-0 text-[11px] font-bold text-mint-700">{t("home.addWidget")}</AppButton>}
              />
              {isNewUser ? (
                <EmptyDashboard onAddWidget={onOpenWidgets} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    homeWidgets ??
                    myWidgets
                      .filter(
                        (widget) =>
                          homeWidgetIds.includes(widget.id) &&
                          !removedWidgets.includes(widget.id),
                      )
                      .map((widget) => ({
                        ...widget,
                        isOnHome: true,
                        dataApi: `/api/widgets/${widget.id}/data`,
                      }))
                  )
                    .filter((widget) => widget.isOnHome)
                    .map((widget) => (
                      <WidgetCard
                        key={widget.id}
                        widget={widget}
                        onEdit={() => onEditWidget(widget)}
                        onRemove={() => {
                          onRemoveWidget(widget.id);
                          setRemovedWidgets((current) => [
                            ...current,
                            widget.id,
                          ]);
                        }}
                        onMaximize={() => setMaximizedWidget(widget)}
                        data={widgetData[widget.id]}
                        loading={widgetLoading[widget.id]}
                        error={widgetErrors[widget.id]}
                        onRetry={() => onRetryWidget?.(widget.id)}
                      />
                    ))}
                </div>
              )}
              <div className="mt-8">
                <SectionHeading
                  title={t("home.recommendedForYou")}
                  onViewAll={onOpenWidgets}
                />
                {isNewUser ? (
                  <AppCard variant="recommendation" className="rounded-xl px-5 py-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-100 text-mint-700">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-[12px] font-bold text-navy-900">
                          {t("home.recommendationsNewTitle")}
                        </h3>
                        <p className="mt-1 text-[11px] text-ink-500">
                          {t("home.recommendationsNewText")}
                        </p>
                      </div>
                    </div>
                  </AppCard>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {recommendedWidgets.map((widget) => (
                      <WidgetCard
                        key={widget.id}
                        widget={widget}
                        recommended
                        added={addedWidgets.includes(widget.id)}
                        onAdd={() => {
                          addWidget(widget.id);
                          onRemoveWidget(widget.id);
                        }}
                        onMaximize={() => setMaximizedWidget(widget)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {maximizedWidget && (
        <MaximizedWidget
          widget={maximizedWidget}
          onClose={() => setMaximizedWidget(null)}
          onEdit={() => {
            setMaximizedWidget(null);
            onEditWidget(maximizedWidget);
          }}
        />
      )}
    </>
  );
}

function SideCard({
  title,
  icon,
  onViewAll,
  children,
}: {
  title: string;
  icon: ReactNode;
  onViewAll: () => void;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <AppCard variant="admin" className="rounded-xl px-4 py-3 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-navy-900">
          {icon}
          <h2 className="font-display text-[12px] font-bold">{title}</h2>
        </div>
        <AppButton variant="ghost" type="button" onClick={onViewAll} className="h-auto px-0 text-[10px] font-bold text-mint-700">
          {t("common.viewAll")} <span aria-hidden>›</span>
        </AppButton>
      </div>
      <div className="mt-2">{children}      </div>
    </AppCard>
  );
}
function SectionHeading({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll: () => void;
}) {
  const t = useT();
  return (
    <AppSectionHeader
      title={title}
      action={<AppButton variant="ghost" type="button" onClick={onViewAll} className="h-auto px-0 text-[11px] font-bold text-mint-700 hover:text-mint-600">{t("common.viewAll")} <span aria-hidden>›</span></AppButton>}
    />
  );
}
function EmptySideState({
  icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-7 text-center">
      <span className="text-mint-300">{icon}</span>
      <h3 className="mt-3 text-[12px] font-bold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-[190px] text-[11px] leading-5 text-ink-500">
        {text}
      </p>
      <AppButton variant="secondary" type="button" onClick={onAction} className="mt-3 px-3 py-2 text-[11px] font-bold text-mint-700">
        {action}
      </AppButton>
    </div>
  );
}
function EmptyDashboard({ onAddWidget }: { onAddWidget: () => void }) {
  const t = useT();
  return (
    <AppCard variant="recommendation" className="flex min-h-[430px] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-50 text-mint-600">
        <LineChart className="h-9 w-9" />
      </span>
      <h3 className="mt-5 font-display text-[17px] font-bold text-navy-900">
        {t("home.emptyDashboardTitle")}
      </h3>
      <p className="mt-2 max-w-[320px] text-[12px] leading-5 text-ink-500">
        {t("home.emptyDashboardDesc")}
      </p>
      <AppButton variant="primary" type="button" onClick={onAddWidget} className="mt-5 px-4 py-2.5 text-[12px] font-bold">
        <Plus data-icon="inline-start" /> {t("home.addFirstWidget")}
      </AppButton>
      <div className="my-4 flex w-full max-w-[280px] items-center gap-3 text-[11px] text-ink-300">
        <span className="h-px flex-1 bg-surface-200" />
        {t("home.or")}
        <span className="h-px flex-1 bg-surface-200" />
      </div>
      <AppButton variant="secondary" type="button" onClick={onAddWidget} className="px-4 py-2.5 text-[11px] font-bold text-navy-900">
        <BarChart3 data-icon="inline-start" /> {t("home.exploreWidgetCatalogue")}
      </AppButton>
    </AppCard>
  );
}

function WidgetCard({
  widget,
  recommended = false,
  added = false,
  onAdd,
  onEdit,
  onRemove,
  onMaximize,
  data,
  loading,
  error,
  onRetry,
}: {
  widget: Widget;
  recommended?: boolean;
  added?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  onMaximize?: () => void;
  data?: WidgetData;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return (
    <AppCard variant="widget">
      <div className="flex items-start justify-between gap-2">
        <AppBadge variant={widget.kind === "TABLE" ? "table" : "chart"} className="">
          {widget.kind}
        </AppBadge>
        <div ref={menuRef} className="relative flex items-center gap-2">
          <>
            <AppButton
              variant="icon"
              type="button"
              onClick={onMaximize}
              aria-label={t("home.previewWidgetName", { name: widget.title })}
              title={t("home.previewWidget")}
              className="size-6 text-navy-900"
            >
              {recommended ? (
                <Eye className="h-4 w-4" aria-hidden="true" />
              ) : (
                <span
                  className="text-[14px] font-semibold leading-none"
                  aria-hidden="true"
                >
                  [ ]
                </span>
              )}
            </AppButton>
            {!recommended && (
              <>
                <AppButton
                  variant="icon"
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label={t("home.moreOptions", { name: widget.title })}
                  aria-expanded={menuOpen}
                  className="size-6 text-navy-900"
                >
                  <Ellipsis />
                </AppButton>
                {menuOpen && (
                  <div className="absolute right-0 top-7 z-30 w-44 rounded-lg border border-surface-200 bg-surface p-1.5 shadow-floaty">
                    <AppButton
                      variant="ghost"
                      type="button"
                      onClick={closeMenu}
                      className="h-auto w-full justify-start gap-2 px-2.5 py-2 text-left text-[11px] font-semibold"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />{" "}
                      {t("home.refreshData")}
                    </AppButton>
                    <AppButton
                      variant="danger"
                      type="button"
                      onClick={() => {
                        onRemove?.();
                        closeMenu();
                      }}
                      className="h-auto w-full justify-start gap-2 border-t border-surface-100 px-2.5 py-2 text-left text-[11px] font-semibold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />{" "}
                      {t("home.removeFromHome")}
                    </AppButton>
                    <AppButton
                      variant="ghost"
                      type="button"
                      onClick={closeMenu}
                      className="h-auto w-full justify-start gap-2 border-t border-surface-100 px-2.5 py-2 text-left text-[11px] font-semibold"
                    >
                      <Info data-icon="inline-start" /> {t("home.viewDetails")}
                    </AppButton>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      </div>
      <h3 className="mt-2 text-[12px] font-bold text-navy-900">
        {widget.title}
      </h3>
      <p className="mt-1 min-h-4 text-[10px] text-ink-500">
        {widget.description}
      </p>
      {loading ? (
        <div className="mt-4 flex flex-1 items-center justify-center text-[11px] text-ink-500">
          {t("home.loadingWidget")}
        </div>
      ) : error ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 text-center text-[11px] text-ink-500">
          <span>{t("home.unableToLoad")}</span>
          <AppButton variant="ghost" type="button" onClick={onRetry} className="h-auto p-0 font-bold text-mint-700">
            {t("common.retry")}
          </AppButton>
        </div>
      ) : (
        <WidgetPreview widget={widget} data={data} />
      )}
      <div className="mt-2 flex items-center gap-1.5 text-[9px] text-ink-500">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-surface-100 text-[7px] font-bold text-navy-900">
          {widget.initials}
        </span>
        <span className="truncate">{widget.owner}</span>
        <span>·</span>
        <span className="truncate">{widget.updated}</span>
      </div>
      {recommended ? (
        <AppButton
          variant="secondary"
          type="button"
          onClick={onAdd}
          disabled={added}
          className="mt-3 h-auto w-full gap-1.5 py-1.5 text-[10px] font-bold"
        >
          {added ? (
            <>
              <LockKeyhole className="h-3 w-3" /> {t("home.addedToHome")}
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> {t("home.addToHome")}
            </>
          )}
        </AppButton>
      ) : (
        <div className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-mint-700">
          {widget.privacy === "Private" ? (
            <LockKeyhole className="h-3 w-3" />
          ) : (
            <UsersRound className="h-3 w-3" />
          )}
          {widget.privacy}
        </div>
      )}
    </AppCard>
  );
}

function MaximizedWidget({
  widget,
  onClose,
  onEdit,
}: {
  widget: Widget;
  onClose: () => void;
  onEdit: () => void;
}) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-light p-4">
      <AppCard
        variant="report"
        className="w-full max-w-5xl rounded-xl p-6 shadow-floaty"
        role="dialog"
        aria-modal="true"
        aria-label={t("home.previewWidgetName", { name: widget.title })}
      >
        <div className="flex items-start justify-between">
          <div>
            <AppBadge variant={widget.kind === "TABLE" ? "table" : "chart"} className="">
              {widget.kind}
            </AppBadge>
            <h2 className="mt-3 font-display text-[24px] font-bold text-navy-900">
              {widget.title}
            </h2>
            <p className="mt-1 text-[13px] text-ink-500">
              {widget.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AppButton variant="secondary" type="button" onClick={onEdit} className="px-3 py-2 text-[12px] font-bold">
              <Edit3 data-icon="inline-start" /> {t("home.editWidget")}
            </AppButton>
            <AppButton variant="icon" type="button" onClick={onClose} className="size-9 text-ink-500" aria-label={t("home.close")}>
              <X />
            </AppButton>
          </div>
        </div>
        <div className="mt-7 rounded-lg border border-surface-200 bg-surface-50 p-6">
          <WidgetPreview widget={widget} />
        </div>
        <div className="mt-4 text-[11px] text-ink-500">
          {widget.owner} · {widget.updated} · {t("common.readOnlyView")}
        </div>
      </AppCard>
    </div>
  );
}


function WidgetPreview({
  widget,
  data,
}: {
  widget: Widget;
  data?: WidgetData;
}) {
  const t = useT();
  const { percentage } = useFormat();
  if (data?.type === "TABLE")
    return (
      <div className="mt-3 overflow-hidden rounded-md border border-surface-100 text-[9px]">
        <div className="grid grid-cols-3 bg-surface-50 px-2 py-1 font-bold text-ink-500">
          {data.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {data.rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-3 border-t border-surface-100 px-2 py-1 text-ink-700"
          >
            {row.map((cell, cellIndex) => (
              <span key={cellIndex} className="truncate">
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  if (data?.type === "CHART")
    return (
      <div className="mt-3 flex h-32 items-end gap-1.5 px-1">
        {data.series[0].data.map((value, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-sm bg-chart-blue"
            style={{
              height: `${Math.max(12, (value / Math.max(...data.series[0].data)) * 100)}%`,
            }}
          />
        ))}
      </div>
    );
  if (widget.preview === "table")
    return (
      <div className="mt-3 overflow-hidden rounded-md border border-surface-100 text-[8px]">
        <div className="grid grid-cols-3 bg-surface-50 px-2 py-1 font-bold text-ink-500">
          <span>{t("common.product")}</span>
          <span>{t("common.approval")}</span>
          <span>{t("common.trend")}</span>
        </div>
        {[
          t("common.personalLoan"),
          t("common.homeLoan"),
          t("common.vehicleLoan"),
          t("common.businessLoan"),
        ].map((row, index) => (
          <div
            key={row}
            className="grid grid-cols-3 border-t border-surface-100 px-2 py-1 text-ink-700"
          >
            <span className="truncate">{row}</span>
            <span>{percentage([83.6, 76.4, 72.1, 68.3][index])}</span>
            <span className="text-mint-600">{t("common.trendUp")}</span>
          </div>
        ))}
      </div>
    );
  if (widget.preview === "donut")
    return (
      <div className="mt-3 flex items-center justify-center gap-3">
        <div className={`donut-chart ${widget.accent}`} />
        <div className="space-y-1 text-[8px] text-ink-500">
          <div>
            <i className="legend-dot bg-chart-accent" /> {t("common.north42")}
          </div>
          <div>
            <i className="legend-dot bg-chart-accent-light" />{" "}
            {t("common.west28")}
          </div>
          <div>
            <i className="legend-dot bg-chart-accent-lighter" />{" "}
            {t("common.south19")}
          </div>
        </div>
      </div>
    );
  if (widget.preview === "bars")
    return (
      <div className="mt-3 flex h-14 items-end gap-1.5 px-1">
        {[20, 39, 28, 52, 64, 43, 31].map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-sm bg-chart-blue"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  return (
    <div className="mt-3 flex h-14 items-end">
      <MiniLine large />
    </div>
  );
}
function MiniLine({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={large ? "h-14 w-full" : "h-12 w-20"}
      viewBox="0 0 120 50"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 43C15 39 17 34 28 35C38 36 40 28 51 29C63 30 65 18 75 22C85 26 89 15 99 18C106 20 111 10 118 5V50H2Z"
        fill="var(--color-chart-green-fill)"
      />
      <path
        d="M2 43C15 39 17 34 28 35C38 36 40 28 51 29C63 30 65 18 75 22C85 26 89 15 99 18C106 20 111 10 118 5"
        stroke="var(--color-chart-green-stroke)"
        strokeWidth="2"
      />
    </svg>
  );
}
