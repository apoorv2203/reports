import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChartBar as BarChart3,
  Bookmark,
  BookmarkMinus,
  Check,
  ChevronDown,
  CreditCard as Edit3,
  Ellipsis,
  Eye,
  Grid2x2X as Grid2X2,
  LayoutList,
  MoveHorizontal as MoreHorizontal,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { getWidgetData, getWidgets, type Widget } from "@/api/services/widgetService";
import type { WidgetMutationResponse } from "@/api/types/widget";
import { useT } from "@/providers/I18nProvider";
import { AppButton } from "@/components/app/AppButton";
import { AppBadge } from "@/components/app/AppBadge";
import { AppCard } from "@/components/app/AppCard";
import { AppInput } from "@/components/app/AppInput";
import { AppPageHeader } from "@/components/app/AppPageHeader";
import { AppSectionHeader } from "@/components/app/AppSectionHeader";
import { AppTextarea } from "@/components/app/AppForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  onBack: () => void;
  onEditWidget: (widget: Widget) => void;
  onNewWidget: () => void;
  onToggleHomeWidget: (id: string, isOnHome: boolean) => Promise<WidgetMutationResponse>;
};
type Category =
  "All" | "Lending" | "Risk" | "Collections" | "Sales" | "Operations";
const categories: Category[] = [
  "All",
  "Lending",
  "Risk",
  "Collections",
  "Sales",
  "Operations",
];

export function WidgetsPage({
  onBack,
  onEditWidget,
  onNewWidget,
  onToggleHomeWidget,
}: Props) {
  const t = useT();
  const [tab, setTab] = useState<"mine" | "catalogue" | "shared">("mine");
  const [apiWidgets, setApiWidgets] = useState<Widget[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(t("common.recentlyUpdated"));
  const [list, setList] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [shareWidget, setShareWidget] = useState<Widget | null>(null);
  const [publishWidget, setPublishWidget] = useState<Widget | null>(null);
  const [viewWidget, setViewWidget] = useState<Widget | null>(null);
  const [viewData, setViewData] = useState<import('@/api/types/widget').WidgetData>();
  const [viewLoading, setViewLoading] = useState(false);
  const [homeActionId, setHomeActionId] = useState<string | null>(null);
  const [homeActionError, setHomeActionError] = useState<string | null>(null);
  useEffect(() => {
    const scope = tab === "mine" ? "MY_WIDGETS" : tab === "catalogue" ? "CATALOGUE" : "SHARED_WITH_ME";
    setLoading(true); setError(false); setPage(0);
    getWidgets(scope, { search: query || undefined, page: 0, pageSize: 20 }).then(({ items, page: responsePage, pageSize: responsePageSize, total: responseTotal }) => { setApiWidgets(items); setPage(responsePage); setPageSize(responsePageSize); setTotal(responseTotal); }).catch(() => { setApiWidgets([]); setError(true); }).finally(() => setLoading(false));
  }, [tab, query]);
  const loadMore = async () => {
    if (loadingMore || apiWidgets.length >= total) return;
    setLoadingMore(true);
    try {
      const scope = tab === "mine" ? "MY_WIDGETS" : tab === "catalogue" ? "CATALOGUE" : "SHARED_WITH_ME";
      const response = await getWidgets(scope, { search: query || undefined, page: page + 1, pageSize });
      setApiWidgets((current) => [...current, ...response.items.filter((item) => !current.some((existing) => existing.id === item.id))]);
      setPage(response.page); setTotal(response.total);
    } catch { setError(true); } finally { setLoadingMore(false); }
  };
  const source = apiWidgets;
  const toggleWidgetHome = async (widget: Widget) => {
    if (homeActionId) return;
    setHomeActionId(widget.id); setHomeActionError(null);
    try {
      const result = await onToggleHomeWidget(widget.id, Boolean(widget.isOnHome));
      setApiWidgets((current) => current.map((item) => item.id === result.widgetId ? { ...item, isOnHome: result.isOnHome } : item));
    } catch { setHomeActionError(widget.id); } finally { setHomeActionId(null); }
  };
  const widgets = useMemo(() => source, [source]);

  return (
    <main
      className="min-h-0 flex-1 overflow-y-auto bg-surface"
      onClick={() => menuId && setMenuId(null)}
    >
      <div className="mx-auto max-w-[1480px] px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <AppPageHeader title={t("widgets.title")} description={t("widgets.subtitle")} />
          <div className="flex items-center gap-3">
            <label className="hidden w-[380px] items-center gap-2 rounded-lg border border-surface-200 bg-surface px-3 py-2.5 text-ink-300 md:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("widgets.searchLabel")}</span>
              <AppInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("widgets.searchPlaceholder")}
                size="inline"
              />
            </label>
            <AppButton type="button" onClick={onNewWidget}>
              <Plus data-icon="inline-start" /> {t("widgets.newWidget")}
            </AppButton>
          </div>
        </header>
        <div className="mt-6 border-b border-border shadow-none">
          <div className="flex items-end gap-7">
            <AppButton
              variant="ghost"
              type="button"
              onClick={() => setTab("mine")}
              size="tab" active={tab === "mine"}
            >
              {t("widgets.myWidgets")}
            </AppButton>
            <AppButton
              variant="ghost"
              type="button"
              onClick={() => setTab("catalogue")}
              size="tab" active={tab === "catalogue"}
            >
              {t("widgets.catalogue")}
            </AppButton>
            <AppButton
              variant="ghost"
              type="button"
              onClick={() => setTab("shared")}
              size="tab" active={tab === "shared"}
            >
              {t("widgets.sharedWithMe")}
            </AppButton>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <AppButton variant="secondary" type="button" size="filter">
            <SlidersHorizontal data-icon="inline-start" /> {t("common.filters")}
          </AppButton>
          {[
            t("common.category"),
            t("common.owner"),
            t("common.created"),
            t("common.updated"),
          ].map((label) => (
            <AppButton
              variant="secondary"
              type="button"
              key={label}
              size="pill"
            >
              {label}
              <ChevronDown data-icon="inline-end" />
            </AppButton>
          ))}
          <div className="start-auto flex items-center gap-2 text-[12px] text-ink-500">
            {t("common.sortBy")}
            <Select value={sort} onValueChange={(value) => value && setSort(value)}>
              <SelectTrigger size="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={t("common.recentlyUpdated")}>{t("common.recentlyUpdated")}</SelectItem>
                <SelectItem value={t("common.nameAZ")}>{t("common.nameAZ")}</SelectItem>
                <SelectItem value={t("common.type")}>{t("common.type")}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border border-surface-200 p-0.5">
              <AppButton variant="icon" size="toggle" active={!list} type="button" onClick={() => setList(false)} aria-label={t("widgets.gridView")}>
                <Grid2X2 />
              </AppButton>
              <AppButton variant="icon" size="toggle" active={list} type="button" onClick={() => setList(true)} aria-label={t("widgets.listView")}>
                <LayoutList />
              </AppButton>
            </div>
          </div>
        </div>
        {loading && <AppCard variant="default" className="mt-5 px-6 py-12 text-center text-[13px] text-ink-500">{t("widgets.loading")}</AppCard>}
        {error && <AppCard variant="default" className="mt-5 px-6 py-12 text-center text-[13px] text-ink-500">{t("widgets.loadError")}</AppCard>}
        {homeActionError && <p role="alert" className="mt-3 text-[11px] text-danger-600">{t("widgets.homeUpdateError")}</p>}
        {!loading && !error && <div className={`mt-5 grid gap-4 ${list ? "grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              menuOpen={menuId === widget.id}
              onMenu={(event) => {
                event.stopPropagation();
                setMenuId(menuId === widget.id ? null : widget.id);
              }}
              added={Boolean(widget.isOnHome)}
              pending={homeActionId === widget.id}
              onAdd={() => toggleWidgetHome(widget)}
              onShare={() => {
                setMenuId(null);
                setShareWidget(widget);
              }}
              onPublish={() => {
                setMenuId(null);
                setPublishWidget(widget);
              }}
              onView={() => { setViewWidget(widget); setViewLoading(true); getWidgetData(widget.id).then(setViewData).finally(() => setViewLoading(false)); }}
              onEdit={() => onEditWidget(widget)}
              onRemove={() => toggleWidgetHome(widget)}
            />
          ))}
        </div>}
        {!loading && !error && !widgets.length && (
          <AppCard variant="default" className="mt-5 rounded-lg border-dashed px-6 py-16 text-center text-[13px] text-ink-500">
            {t("widgets.noMatch")}
          </AppCard>
        )}
        <div className="flex items-center justify-between gap-4 py-7 text-[11px] text-ink-500">
          <div className="text-[11px] text-ink-500">{t('widgets.showingOf', { count: String(widgets.length), total: String(total) })}</div>
          <div>
            {widgets.length < total && (
              <AppButton variant="secondary" type="button" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? t("widgets.loading") : t("common.loadMore")} <ChevronDown data-icon="inline-end" />
              </AppButton>
            )}
          </div>
        </div>
      </div>
      {shareWidget && (
        <ShareWidgetModal
          widget={shareWidget}
          onClose={() => setShareWidget(null)}
        />
      )}
      {publishWidget && (
        <ShareToCatalogueModal
          widget={publishWidget}
          onClose={() => setPublishWidget(null)}
        />
      )}
      {viewWidget && (
        <WidgetReadOnlyView
          widget={viewWidget}
          onClose={() => setViewWidget(null)}
          onEdit={() => onEditWidget(viewWidget)}
        />
      )}
    </main>
  );
}

function WidgetCard({
  widget,
  menuOpen,
  onMenu,
  onAdd,
  onShare,
  onPublish,
  onView,
  onEdit,
  onRemove,
  added,
  pending,
}: {
  widget: Widget;
  menuOpen: boolean;
  onMenu: (event: React.MouseEvent) => void;
  onAdd: () => void;
  onShare: () => void;
  onPublish: () => void;
  onView: () => void;
  onEdit: () => void;
  onRemove: () => void;
  added: boolean;
  pending: boolean;
}) {
  const t = useT();
  return (
    <AppCard
      variant="widget"
      density="widget"
      onClick={onView}
      className="cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between gap-2">
        <AppBadge variant={widget.kind === "TABLE" ? "table" : "chart"}>
          {widget.kind}
        </AppBadge>
        <div className="flex items-center gap-2">
          <AppButton
            variant="icon"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onView();
            }}
            aria-label={t("home.previewWidgetName", { name: widget.title })}
            title={t("home.previewWidget")}
            size="icon-sm"
          >
            <Eye aria-hidden="true" />
          </AppButton>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold tracking-[-0.02em] text-navy-900">
            {widget.title}
          </h2>
        </div>
        {added && (
          <AppBadge variant="success" size="status">
            {t("home.addedToHome")}
          </AppBadge>
        )}
      </div>
      <p className="mt-1 min-h-8 text-[11px] leading-4 text-ink-500">
        {widget.description}
      </p>
      <Preview widget={widget} />
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[9px] text-ink-500">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-100 text-[8px] font-bold text-navy-900">
            {widget.initials}
          </span>
          <span className="truncate">
            {widget.owner} · {widget.updated}
          </span>
        </span>
        <span
          className={`flex shrink-0 items-center gap-1 font-bold ${widget.privacy === "Private" ? "text-mint-700" : "text-badge-purple-text"}`}
        >
          {widget.privacy === "Private" ? (
            <Sparkles className="h-3 w-3" />
          ) : (
            <UsersRound className="h-3 w-3" />
          )}
          {widget.privacy}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <AppButton
          variant={added ? "success-outline" : "secondary"}
          type="button"
          disabled={pending}
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          size="widget-home"
        >
          <Edit3 data-icon="inline-start" /> {t("common.edit")}
        </AppButton>
        <AppButton
          variant={added ? "success-outline" : "secondary"}
          type="button"
          disabled={pending}
          onClick={(event) => {
            event.stopPropagation();
            onAdd();
          }}
          size="widget-home"
        >
          <Bookmark data-icon="inline-start" /> {pending ? t("widgets.updatingHome") : added ? t("home.addedToHome") : t("home.addToHome")}
        </AppButton>
        <AppButton variant="icon" size="widget-icon" type="button" onClick={onMenu} aria-label={t("widgets.openMenu")}>
          <Ellipsis />
        </AppButton>
      </div>
      {menuOpen && (
        <WidgetMenu
          onShare={onShare}
          onPublish={onPublish}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
    </AppCard>
  );
}
function WidgetMenu({
  onShare,
  onPublish,
  onEdit,
  onRemove,
}: {
  onShare: () => void;
  onPublish: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const t = useT();
  const items: Array<[string, (() => void) | undefined]> = [
    [t("common.share"), onShare],
    [t("widgets.publishToCatalogue"), onPublish],
    [t("common.duplicate"), undefined],
  ];
  return (
    <div
      className="absolute right-3 top-11 z-20 w-48 overflow-hidden rounded-lg border border-surface-200 bg-surface py-1 shadow-floaty"
      onClick={(event) => event.stopPropagation()}
    >
      {items.map(([label, handler]) => (
        <AppButton variant="ghost" type="button" key={label} onClick={handler} size="menu-item">
          <Edit3 data-icon="inline-start" /> {label}
        </AppButton>
      ))}
      <div className="my-1 h-px bg-surface-100" />
      <AppButton variant="danger" size="menu-danger" type="button">
        <Trash2 data-icon="inline-start" /> {t("common.delete")}
      </AppButton>
    </div>
  );
}
function WidgetReadOnlyView({
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
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="widget-view-title"
        className="relative w-full max-w-5xl rounded-lg border border-surface-200 bg-surface p-6 shadow-floaty"
      >
        <div className="flex items-start justify-between">
          <div>
            <AppBadge variant={widget.kind === "TABLE" ? "table" : "chart"}>
              {widget.kind}
            </AppBadge>
            <h2
              id="widget-view-title"
              className="mt-3 font-display text-[24px] font-bold text-navy-900"
            >
              {widget.title}
            </h2>
            <p className="mt-1 text-[14px] text-ink-500">
              {widget.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AppButton variant="secondary" size="action-sm" type="button" onClick={onEdit}>
              <Edit3 data-icon="inline-start" /> {t("home.editWidget")}
            </AppButton>
            <AppButton variant="icon" size="modal-icon" type="button" onClick={onClose} aria-label={t("widgets.closeView")}>
              <X />
            </AppButton>
          </div>
        </div>
        <div className="mt-8 min-h-[360px] rounded-lg border border-surface-200 bg-surface-50 p-6">
          <Preview widget={widget} />
        </div>
        <div className="mt-4 flex items-center justify-between text-[12px] text-ink-500">
          <span>
            {widget.owner} · {widget.updated}
          </span>
          <span className="font-semibold text-mint-700">
            {t("common.readOnlyView")}
          </span>
        </div>
      </section>
    </div>
  );
}

function ShareWidgetModal({
  widget,
  onClose,
}: {
  widget: Widget;
  onClose: () => void;
}) {
  const t = useT();
  const [search, setSearch] = useState("");
  const [recipients, setRecipients] = useState([
    t("widgets.retailLendingTeam"),
    t("widgets.amitSharma"),
  ]);
  const [message, setMessage] = useState("");
  const [notify, setNotify] = useState(true);
  const allSuggestions = [
    t("widgets.retailLendingTeam"),
    t("widgets.amitSharma"),
    t("widgets.riskComplianceTeam"),
    t("widgets.anitaGupta"),
  ];
  const suggestions = allSuggestions.filter(
    (item) =>
      item.toLowerCase().includes(search.toLowerCase()) &&
      !recipients.includes(item),
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-medium p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-widget-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-surface-200 bg-surface p-6 shadow-floaty"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="share-widget-title"
              className="font-display text-[22px] font-bold text-navy-900"
            >
              {t("widgets.shareWidget")}
            </h2>
            <p className="mt-1 text-[16px] text-ink-500">{widget.title}</p>
          </div>
          <AppButton variant="icon" size="modal-icon" type="button" onClick={onClose} aria-label={t("common.close")}>
            <X />
          </AppButton>
        </div>
        <div className="mt-7">
          <h3 className="text-[15px] font-bold text-navy-900">
            {t("widgets.shareWith")}
          </h3>
          <p className="mt-1 text-[13px] text-ink-500">
            {t("widgets.shareDesc")}
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-surface-200 px-3 py-3">
            <Search className="h-4 w-4 text-ink-400" />
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("widgets.searchPeople")}
              className="min-w-0 flex-1 border-0 bg-transparent text-[13px] shadow-none outline-none placeholder:text-ink-400 focus-visible:ring-0"
            />
          </div>
          {search && suggestions.length > 0 && (
            <div className="mt-1 rounded-lg border border-surface-200 bg-surface p-1 shadow-floaty">
              {suggestions.map((item) => (
                <AppButton
                  variant="ghost"
                  type="button"
                  key={item}
                  onClick={() => {
                    setRecipients((current) => [...current, item]);
                    setSearch("");
                  }}
                  className="h-auto w-full justify-start rounded-md px-3 py-2 text-left text-[12px] font-semibold"
                >
                  {item}
                  <span className="ml-2 text-ink-400">
                    {item.includes("Team")
                      ? t("widgets.team")
                      : t("widgets.person")}
                  </span>
                </AppButton>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {recipients.map((recipient) => (
              <span
                key={recipient}
                className="inline-flex items-center gap-2 rounded-md border border-surface-200 bg-surface-50 px-3 py-2 text-[12px] font-semibold text-navy-900"
              >
                {recipient}
                <AppButton
                  variant="icon"
                  type="button"
                  onClick={() =>
                    setRecipients((current) =>
                      current.filter((item) => item !== recipient),
                    )
                  }
                  className="size-5 text-ink-400 hover:text-navy-900"
                  aria-label={t("widgets.removeRecipient", { name: recipient })}
                >
                  <X />
                </AppButton>
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-[15px] font-bold text-navy-900">
            {t("widgets.permission")}
          </h3>
          <p className="mt-1 text-[13px] text-ink-500">
            {t("widgets.permissionDesc")}
          </p>
          <RadioGroup defaultValue="use" className="mt-3">
          <label className="flex items-start gap-3">
            <RadioGroupItem value="use" className="mt-1" />
            <span>
              <span className="block text-[13px] font-bold text-navy-900">
                {t("widgets.canUseAdd")}
              </span>
              <span className="block text-[12px] text-ink-500">
                {t("widgets.canUseDesc")}
              </span>
            </span>
          </label>
        </RadioGroup>
        </div>
        <label className="mt-6 block text-[15px] font-bold text-navy-900">
          {t("widgets.message")}{" "}
          <span className="font-normal text-ink-500">
            {t("common.optional")}
          </span>
          <AppTextarea
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, 200))}
            placeholder={t("widgets.addMessage")}
            className="mt-2 h-24 w-full resize-none text-[13px] font-normal"
          />
          <span className="block text-right text-[11px] font-normal text-ink-400">
            {t("widgets.charsCount", { count: String(message.length) })}
          </span>
        </label>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-navy-900">
              {t("widgets.notifyEmail")}
            </h3>
            <p className="mt-1 text-[12px] text-ink-500">
              {t("widgets.notifyDesc")}
            </p>
          </div>
          <AppButton
            variant="ghost"
            type="button"
            onClick={() => setNotify((value) => !value)}
            aria-pressed={notify}
            className={`relative h-6 w-11 rounded-full p-0 transition ${notify ? "bg-mint-500" : "bg-surface-300"}`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-surface transition ${notify ? "left-6" : "left-1"}`}
            />
          </AppButton>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[11px] text-ink-500">
            {t("widgets.recipientsSummary", {
              count: String(recipients.length),
            })}
          </p>
          <div className="flex gap-2">
            <AppButton variant="secondary" type="button" onClick={onClose} className="px-4 py-2.5 text-[12px] font-bold">
              {t("common.cancel")}
            </AppButton>
            <AppButton variant="primary" type="button" disabled={!recipients.length} onClick={onClose} className="px-5 py-2.5 text-[12px] font-bold disabled:opacity-40">
              {t("common.share")}
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShareToCatalogueModal({
  widget,
  onClose,
}: {
  widget: Widget;
  onClose: () => void;
}) {
  const t = useT();
  const [category, setCategory] = useState(t("widgets.lending"));
  const [description, setDescription] = useState(widget.description);
  const [permission, setPermission] = useState<"view" | "use">("view");
  const cats = [
    t("widgets.lending"),
    t("widgets.risk"),
    t("widgets.collections"),
    t("widgets.sales"),
    t("widgets.operations"),
  ];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-medium p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-surface-200 bg-surface p-6 shadow-floaty"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="catalogue-title"
              className="font-display text-[22px] font-bold text-navy-900"
            >
              {t("widgets.shareToCatalogue")}
            </h2>
            <p className="mt-1 text-[14px] text-ink-500">
              {t("widgets.catalogueSubtitle")}
            </p>
          </div>
          <AppButton variant="icon" size="modal-icon" type="button" onClick={onClose} aria-label={t("common.close")}>
            <X />
          </AppButton>
        </div>
        <div className="mt-6">
          <h3 className="text-[14px] font-bold text-navy-900">
            {t("widgets.widget")}
          </h3>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 p-3">
            <AppBadge variant={widget.kind === "TABLE" ? "table" : "chart"} className="flex size-10 items-center justify-center rounded-md p-0">
              {widget.kind === "TABLE" ? (
                <Grid2X2 className="h-5 w-5" />
              ) : widget.kind === "CHART" ? (
                <BarChart3 className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </AppBadge>
            <div>
              <div className="text-[14px] font-bold text-navy-900">
                {widget.title}
              </div>
              <div className="mt-1 text-[12px] text-ink-500">
                {widget.kind[0] + widget.kind.slice(1).toLowerCase()} ·{" "}
                {widget.updated}
              </div>
            </div>
          </div>
        </div>
        <label className="mt-5 block text-[14px] font-bold text-navy-900">
          {t("common.category")}
          <Select value={category} onValueChange={(value) => value && setCategory(value as Category)}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cats.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="mt-1 block text-[11px] font-normal text-ink-500">
            {t("widgets.categoryHelp")}
          </span>
        </label>
        <label className="mt-5 block text-[14px] font-bold text-navy-900">
          {t("widgets.description")}{" "}
          <span className="font-normal text-ink-500">
            {t("common.optional")}
          </span>
          <AppTextarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value.slice(0, 200))
            }
            className="mt-2 h-24 w-full resize-none text-[13px] font-normal"
          />
          <span className="block text-right text-[11px] font-normal text-ink-400">
            {t("widgets.charsCount", { count: String(description.length) })}
          </span>
          <span className="mt-1 block text-[11px] font-normal text-ink-500">
            {t("widgets.descriptionHelp")}
          </span>
        </label>
        <RadioGroup className="mt-5">
          <fieldset>
          <legend className="text-[14px] font-bold text-navy-900">
            {t("widgets.permissions")}
          </legend>
          <label className="mt-3 flex cursor-pointer items-start gap-3">
            <RadioGroupItem value="view" checked={permission === "view"} onChange={() => setPermission("view")} className="mt-1" />
            <span>
              <span className="block text-[13px] font-bold text-navy-900">
                {t("widgets.canView")}
              </span>
              <span className="block text-[12px] text-ink-500">
                {t("widgets.canViewDesc")}
              </span>
            </span>
          </label>
          <label className="mt-3 flex cursor-pointer items-start gap-3">
            <RadioGroupItem value="use" checked={permission === "use"} onChange={() => setPermission("use")} className="mt-1" />
            <span>
              <span className="block text-[13px] font-bold text-navy-900">
                {t("widgets.canUseAdd")}
              </span>
              <span className="block text-[12px] text-ink-500">
                {t("widgets.canUseOrgDesc")}
              </span>
            </span>
          </label>
          </fieldset>
        </RadioGroup>
        <div className="mt-5">
          <h3 className="text-[14px] font-bold text-navy-900">
            {t("common.preview")}
          </h3>
          <div className="mt-2 max-w-[420px] rounded-lg border border-surface-200 p-2">
            <Preview widget={widget} />
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-[12px] text-blue-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-500 font-bold">
            i
          </span>
          {t("widgets.publishedInfo")}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <AppButton variant="secondary" type="button" onClick={onClose} className="px-4 py-2.5 text-[12px] font-bold">
            {t("common.cancel")}
          </AppButton>
          <AppButton variant="primary" type="button" onClick={onClose} className="px-5 py-2.5 text-[12px] font-bold">
            {t("widgets.publishButton")}
          </AppButton>
        </div>
      </section>
    </div>
  );
}

function Preview({ widget }: { widget: Widget }) {
  const t = useT();
  if (widget.kind === "TABLE")
    return (
      <div className="mt-3 overflow-hidden rounded-md border border-surface-100 text-[8px]">
        <div className="grid grid-cols-2 bg-surface-50 px-2 py-1 font-bold text-ink-500">
          <span>{t("common.product")}</span>
          <span className="text-right">{t("common.approvalRate")}</span>
        </div>
        {[
          t("common.personalLoan"),
          t("common.homeLoan"),
          t("common.vehicleLoan"),
          t("common.businessLoan"),
        ].map((row, index) => (
          <div
            key={row}
            className="grid grid-cols-2 border-t border-surface-100 px-2 py-1 text-ink-700"
          >
            <span>{row}</span>
            <span className="text-right">
              {["83.6%", "76.4%", "72.1%", "68.3%"][index]}
            </span>
          </div>
        ))}
      </div>
    );
  if (widget.kind === "CHART")
    return (
      <div className="mt-3 flex h-[74px] items-center justify-center gap-3">
        <div className="donut-chart violet" />
        <div className="text-[8px] leading-4 text-ink-500">
          {t("common.north42")}
          <br />
          {t("common.west28")}
          <br />
          {t("common.south19")}
        </div>
      </div>
    );
  if (widget.kind === "CHART")
    return (
      <div className="mt-3 flex h-[74px] items-end gap-2 border-b border-surface-200 px-3">
        {[42, 60, 48, 76, 66, 71].map((height) => (
          <span
            key={height}
            className="flex-1 rounded-t-sm bg-chart-blue-medium"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  return (
    <div className="mt-3 h-[74px]">
      <MiniLine large />
    </div>
  );
}
function MiniLine({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={large ? "h-[74px] w-full" : "h-12 w-20"}
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
