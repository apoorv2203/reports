import { useEffect, useMemo, useState } from "react";
import { getReports } from "@/api/services/reportService";
import type { ReportRecord } from "@/api/types/report";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  BookOpen,
  CalendarClock,
  ChevronDown,
  ExternalLink,
  FileText,
  Filter,
  Grid2X2,
  List,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Search,
  Play,
  Share2,
  Trash2,
  Pencil,
  Copy,
  type LucideIcon,
} from "lucide-react";
import { reportTemplates, type ReportTemplate } from "@/data/reportTemplates";
import { useT } from "@/providers/I18nProvider";
import { AppButton } from "@/components/app/AppButton";
import { AppInput } from "@/components/app/AppInput";
import { AppCard } from "@/components/app/AppCard";
import { AppBadge } from "@/components/app/AppBadge";

type Report = {
  id: string;
  title: string;
  description: string;
  owner: string;
  initials: string;
  updated: string;
  status: "Published" | "Draft";
  icon: "file" | "chart" | "grid";
};
const reports: Report[] = [
  {
    id: "q2",
    title: "Q2 branch review",
    description:
      "Comprehensive review of branch performance and key metrics for Q2.",
    owner: "You",
    initials: "RA",
    updated: "2h ago",
    status: "Published",
    icon: "file",
  },
  {
    id: "loan",
    title: "Loan portfolio summary",
    description: "Summary of loan portfolio performance and key trends.",
    owner: "You",
    initials: "RA",
    updated: "yesterday",
    status: "Draft",
    icon: "chart",
  },
  {
    id: "npa",
    title: "NPA trend analysis",
    description: "Trend of gross and net NPA across time periods.",
    owner: "Anita Gupta",
    initials: "AG",
    updated: "1d ago",
    status: "Published",
    icon: "grid",
  },
  {
    id: "collections",
    title: "Collection efficiency report",
    description: "Analysis of collection efficiency and bucket performance.",
    owner: "Rohit Mehta",
    initials: "RM",
    updated: "2d ago",
    status: "Published",
    icon: "chart",
  },
  {
    id: "segments",
    title: "Customer segment performance",
    description: "Performance of customer segments across key metrics.",
    owner: "Sneha Banerjee",
    initials: "SB",
    updated: "3d ago",
    status: "Draft",
    icon: "file",
  },
  {
    id: "risk",
    title: "High risk accounts overview",
    description: "Overview of high risk accounts and outstanding amounts.",
    owner: "Rohit Mehta",
    initials: "RM",
    updated: "4d ago",
    status: "Published",
    icon: "chart",
  },
  {
    id: "mix",
    title: "Product mix analysis",
    description: "Distribution of disbursals by product category.",
    owner: "Anita Gupta",
    initials: "AG",
    updated: "5d ago",
    status: "Published",
    icon: "grid",
  },
  {
    id: "ops",
    title: "Operational KPI dashboard",
    description: "Key operational KPIs and performance tracker.",
    owner: "You",
    initials: "RA",
    updated: "6d ago",
    status: "Draft",
    icon: "chart",
  },
];

export function ReportsHub({
  onBack,
  onBuild,
  onOpenTemplate,
}: {
  onBack: () => void;
  onBuild: (template?: ReportTemplate) => void;
  onOpenTemplate: (template: ReportTemplate) => void;
}) {
  const t = useT();
  const [tab, setTab] = useState<"mine" | "catalogue" | "shared">("mine");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [apiReports, setApiReports] = useState<ReportRecord[]>([]);
  const [homeReports, setHomeReports] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    const scope = tab === "mine" ? "MY_REPORTS" : tab === "shared" ? "SHARED_WITH_ME" : undefined;
    getReports({ search: query || undefined, scope, page: 0, pageSize: 20, sortBy: "updatedAt", sortOrder: "desc" })
      .then((response) => { setApiReports(response.items); setTotal(response.total); setError(false); })
      .catch(() => { setApiReports([]); setTotal(0); setError(true); });
  }, [tab, query]);
  const filtered = useMemo(() => apiReports.map((report, index) => ({
    ...report,
    updated: new Date(report.updatedAt).toLocaleDateString(),
    status: report.status === "PUBLISHED" ? "Published" as const : "Draft" as const,
    icon: index % 3 === 1 ? "chart" as const : index % 3 === 2 ? "grid" as const : "file" as const,
  })), [apiReports]);
  const categoryLabels = [
    t("common.category"),
    t("common.owner"),
    t("common.created"),
    t("common.updated"),
  ];
  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <header className="border-b border-border bg-card px-6 pb-0 pt-5 lg:px-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <AppButton
                variant="ghost"
                size="report-back"
                onClick={onBack}
                aria-label={t("common.back")}
              >
                <ArrowLeft />
              </AppButton>
              <h1 className="font-display text-[25px] font-bold tracking-[-0.04em]">
                {t("reports.browse")}
              </h1>
            </div>
            <p className="mt-1 pl-9 text-[13px] text-muted-foreground">
              {t("reports.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden w-[380px] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-muted-foreground md:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("reports.searchLabel")}</span>
<AppInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("reports.searchPlaceholder")}
            size="inline"
          />
            </label>
<AppButton
          variant="primary"
          size="action-md"
          onClick={() => onBuild()}
        >
              <Plus className="h-4 w-4" /> {t("reports.newReport")}
            </AppButton>
          </div>
        </div>
        <nav className="mt-7 flex gap-7">
          <Tab active={tab === "mine"} onClick={() => setTab("mine")}>
            {t("reports.myReports")}
          </Tab>
          <Tab active={tab === "catalogue"} onClick={() => setTab("catalogue")}>
            {t("reports.catalogue")}
          </Tab>
          <Tab active={tab === "shared"} onClick={() => setTab("shared")}>
            {t("reports.sharedWithMe")}
          </Tab>
        </nav>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-5 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <AppButton variant="secondary" size="filter">
              <Filter className="h-4 w-4" /> {t("common.filters")}
          </AppButton>
          {categoryLabels.map((label) => (
<AppButton
            key={label}
            variant="secondary"
            size="pill"
          >
              {label}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </AppButton>
          ))}
          <div className="ml-auto flex items-center gap-2 text-[12px] text-muted-foreground">
            {t("common.sortBy")}
            <AppButton variant="secondary" size="filter">
              {t("common.recentlyUpdated")}
              <ChevronDown />
            </AppButton>
            <AppButton variant="secondary" size="toggle" active>
              <Grid2X2 />
            </AppButton>
            <AppButton variant="secondary" size="toggle">
              <List />
            </AppButton>
          </div>
        </div>
        <p className="mt-5 text-[13px] text-muted-foreground">
          {t("reports.reportCount")}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((report, index) => (
            <ReportCard
              key={report.id}
              report={report}
              menuOpen={menu === report.id}
              onMenu={() => setMenu(menu === report.id ? null : report.id)}
              onOpen={() =>
                onOpenTemplate(reportTemplates[index % reportTemplates.length])
              }
              onRun={() =>
                onOpenTemplate(reportTemplates[index % reportTemplates.length])
              }
              onEdit={() =>
                onBuild(reportTemplates[index % reportTemplates.length])
              }
              added={homeReports.includes(report.id)}
              onAdd={() =>
                setHomeReports((current) =>
                  current.includes(report.id)
                    ? current
                    : [...current, report.id],
                )
              }
            />
          ))}
        </div>
        <div className="flex items-center justify-between py-7 text-[12px] text-muted-foreground">
          <span>{t("reports.showingRange")}</span>
          <div className="flex items-center gap-2">
            <AppButton variant="secondary" size="pagination">
              <ArrowLeft />
            </AppButton>
            <AppButton variant="secondary" size="pagination" active>
              1
            </AppButton>
            {["2", "3", "…", "6"].map((page) => (
              <AppButton
                key={page}
                variant="secondary"
                size="pagination"
              >
                {page}
              </AppButton>
            ))}
            <AppButton variant="secondary" size="pagination">
              <ArrowRight />
            </AppButton>
          </div>
        </div>
      </main>
    </div>
  );
}
function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <AppButton size="tab" active={active} onClick={onClick}>
      {children}
    </AppButton>
  );
}
function ReportCard({
  report,
  menuOpen,
  onMenu,
  onOpen,
  onRun,
  onEdit,
  added,
  onAdd,
}: {
  report: Report;
  menuOpen: boolean;
  onMenu: () => void;
  onOpen: () => void;
  onRun: () => void;
  onEdit: () => void;
  added: boolean;
  onAdd: () => void;
}) {
  const t = useT();
  const icon =
    report.icon === "chart" ? (
      <BarChart3 className="h-5 w-5" />
    ) : report.icon === "grid" ? (
      <Grid2X2 className="h-5 w-5" />
    ) : (
      <FileText className="h-5 w-5" />
    );
  return (
    <AppCard variant="report" density="report-empty">
      <div className="flex items-start justify-between">
        <AppBadge variant={report.icon === "chart" ? "chart" : "success"} size="format">
          {icon}
        </AppBadge>
        <div className="flex items-start gap-3">
<AppBadge variant={report.status === "Published" ? "success" : "warning"} size="status">
            {report.status === "Published"
              ? t("reports.published")
              : t("reports.draft")}
          </AppBadge>
          <AppButton
            onClick={onRun}
            aria-label={t("reports.runReportName", { name: report.title })}
            size="run-icon"
            title={t("reports.runReport")}
          >
            <Play />
          </AppButton>
        </div>
      </div>
      <h2 className="mt-3 text-[14px] font-bold tracking-[-0.02em] text-foreground">
        {report.title}
      </h2>
      <p className="mt-1 min-h-8 text-[11px] leading-4 text-muted-foreground">
        {report.description}
      </p>
      <div className="mt-auto flex flex-col gap-3 pt-3 text-[9px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[8px] font-bold text-foreground">
              {report.initials}
            </span>
            <span className="font-semibold text-muted-foreground">
              {report.owner} ·{" "}
              {t("reports.updatedMeta", { time: report.updated })}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-primary">
            <LockKeyhole className="h-3.5 w-3.5" /> {t("reports.private")}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
          <AppButton
            type="button"
            onClick={onEdit}
            variant="secondary" size="report-action"
          >
            <Pencil /> {t("common.edit")}
          </AppButton>
          <AppButton
            type="button"
            onClick={onAdd}
            variant="secondary" size="report-action" active={added}
          >
            <Bookmark className="h-5 w-5" />{" "}
            {added ? t("reports.added") : t("reports.addToHome")}
          </AppButton>
          <AppButton
            type="button"
            onClick={onMenu}
            aria-label={t("reports.moreOptions", { name: report.title })}
            size="toggle"
          >
            <MoreHorizontal />
          </AppButton>
        </div>
      </div>
      {menuOpen && <ReportMenu onOpen={onOpen} />}
      </AppCard>
    );
}
function ReportMenu({ onOpen }: { onOpen: () => void }) {
  const t = useT();
  const items: Array<[string, LucideIcon]> = [
    [t("common.duplicate"), Copy],
    [t("common.share"), Share2],
    [t("reports.scheduleReport"), CalendarClock],
    [t("widgets.publishToCatalogue"), BookOpen],
    [t("common.delete"), Trash2],
  ];
  return (
    <div className="absolute bottom-14 right-4 z-20 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-floaty">
      {items.map(([label, Icon]) => (
        <AppButton
          key={String(label)}
          size="menu-item"
          variant={label === t("common.delete") ? "danger" : "ghost"}
          onClick={label === t("common.duplicate") ? onOpen : undefined}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </AppButton>
      ))}
    </div>
  );
}
