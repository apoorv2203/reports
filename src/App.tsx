import { useEffect, useState } from 'react';
import { addWidgetToHome, getHomeWidgets, getWidgetData, getWidgetRecommendations, removeWidgetFromHome, type HomeWidget, type WidgetData, type WidgetRecommendation } from '@/api/services/widgetService';
import { getPinnedReports } from '@/api/services/reportService';
import type { PinnedReport } from '@/api/types/report';
import { getScheduledDeliveries, downloadScheduledDelivery } from '@/api/services/scheduledDeliveryService';
import type { ScheduledDelivery } from '@/api/types/scheduledDelivery';
import { TopNav } from '@/components/TopNav';
import { HomePage } from '@/components/HomePage';
import { ChatPanel } from '@/components/ChatPanel';
import { CanvasPanel } from '@/components/CanvasPanel';
import { ActionsPanel } from '@/components/ActionsPanel';
import { ReportBuilder } from '@/components/ReportBuilder';
import { ReportWorkspace } from '@/components/ReportWorkspace';
import { ReportsHub } from '@/components/ReportsHub';
import { AuthProvider, useAuth } from '@/lib/auth';
import { I18nProvider } from '@/providers/I18nProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LoginScreen } from '@/components/LoginScreen';
import { WidgetsPage } from '@/components/WidgetsPage';
import { AdminTablesPage } from '@/components/AdminTablesPage';
import { AdminAuditTrailPage } from '@/components/AdminAuditTrailPage';
import { AdminShell } from '@/components/AdminShell';
import { ResizableThreePane } from '@/components/ResizableThreePane';
import { reportTemplates, type ReportTemplate } from '@/data/reportTemplates';

type View =
  | { kind: 'home' }
  | { kind: 'workspace'; newWidget?: boolean }
  | { kind: 'reports' }
  | { kind: 'widgets' }
  | { kind: 'builder'; template?: ReportTemplate }
  | { kind: 'run'; template: ReportTemplate }
  | { kind: 'admin' }
  | { kind: 'audit' };

function AppContent() {
  const { profile, signOut } = useAuth();
  const [view, setView] = useState<View>({ kind: 'home' });
  const [initialQuestion, setInitialQuestion] = useState('');
  const [homeWidgetIds, setHomeWidgetIds] = useState<string[]>([]);
  const [homeWidgets, setHomeWidgets] = useState<HomeWidget[]>([]);
  const [widgetData, setWidgetData] = useState<Record<string, WidgetData | undefined>>({});
  const [widgetLoading, setWidgetLoading] = useState<Record<string, boolean>>({});
  const [widgetErrors, setWidgetErrors] = useState<Record<string, boolean>>({});
  const [pinnedReports, setPinnedReports] = useState<PinnedReport[]>([]);
  const [recommendedWidgets, setRecommendedWidgets] = useState<WidgetRecommendation[]>([]);
  const [scheduledDeliveries, setScheduledDeliveries] = useState<ScheduledDelivery[]>([]);
  const [scheduledDeliveriesLoading, setScheduledDeliveriesLoading] = useState(true);
  const [scheduledDeliveriesError, setScheduledDeliveriesError] = useState(false);
  const [downloadingDeliveryId, setDownloadingDeliveryId] = useState<string>();
  const [deliveryDownloadError, setDeliveryDownloadError] = useState(false);
  useEffect(() => {
    Promise.allSettled([getHomeWidgets(), getPinnedReports(), getWidgetRecommendations()]).then(([homeResult, pinnedResult, recommendationsResult]) => {
      if (homeResult.status === 'fulfilled') {
        const { widgets } = homeResult.value;
        setHomeWidgets(widgets);
        setHomeWidgetIds(widgets.filter((widget) => widget.isOnHome).map((widget) => widget.id));
        Promise.allSettled(widgets.filter((widget) => widget.isOnHome).map(async (widget) => {
          setWidgetLoading((current) => ({ ...current, [widget.id]: true }));
          try { const data = await getWidgetData(widget.id); setWidgetData((current) => ({ ...current, [widget.id]: data })); } catch { setWidgetErrors((current) => ({ ...current, [widget.id]: true })); } finally { setWidgetLoading((current) => ({ ...current, [widget.id]: false })); }
        }));
      }
      if (pinnedResult.status === 'fulfilled') setPinnedReports(pinnedResult.value.reports);
      if (recommendationsResult.status === 'fulfilled') setRecommendedWidgets(recommendationsResult.value.widgets);
    });
  }, []);
  useEffect(() => {
    getScheduledDeliveries().then(({ deliveries }) => setScheduledDeliveries(deliveries)).catch(() => setScheduledDeliveriesError(true)).finally(() => setScheduledDeliveriesLoading(false));
  }, []);
  const handleDownloadDelivery = async (deliveryId: string) => {
    setDownloadingDeliveryId(deliveryId); setDeliveryDownloadError(false);
    try {
      const result = await downloadScheduledDelivery(deliveryId);
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.fileName || scheduledDeliveries.find((item) => item.id === deliveryId)?.fileName || 'scheduled-delivery'; anchor.click(); URL.revokeObjectURL(url);
    } catch { setDeliveryDownloadError(true); } finally { setDownloadingDeliveryId(undefined); }
  };
  const toggleHomeWidget = async (id: string) => { const removing = homeWidgetIds.includes(id); const { widgets } = await (removing ? removeWidgetFromHome(id) : addWidgetToHome(id)); setHomeWidgets(widgets); setHomeWidgetIds(widgets.filter((widget) => widget.isOnHome).map((widget) => widget.id)); if (!removing) { setWidgetLoading((current) => ({ ...current, [id]: true })); getWidgetData(id).then((data) => setWidgetData((current) => ({ ...current, [id]: data }))).catch(() => setWidgetErrors((current) => ({ ...current, [id]: true }))).finally(() => setWidgetLoading((current) => ({ ...current, [id]: false }))); } };

  if (!profile) {
    return <LoginScreen />;
  }

  const firstName = profile.full_name.split(' ')[0];
  const isNewUser = profile.is_new_user;
  const initials = profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <div className="flex h-screen flex-col bg-background text-ink-900">
      <TopNav
        onOpenHome={() => setView({ kind: 'home' })}
        onOpenReports={() => setView({ kind: 'reports' })}
        onOpenWidgets={() => setView({ kind: 'widgets' })}
        onOpenSessions={() => setView({ kind: 'workspace' })}
        userName={firstName}
        userInitials={initials}
        onSignOut={signOut}
        isAdmin={profile.role === 'admin'}
        onOpenSettings={() => setView({ kind: 'admin' })}
      />

      {view.kind === 'admin' && <AdminShell section="tables" onNavigate={(section) => setView({ kind: section === 'audit' ? 'audit' : 'admin' })}><AdminTablesPage onBack={() => setView({ kind: 'home' })} onAudit={() => setView({ kind: 'audit' })} shellManaged /></AdminShell>}
      {view.kind === 'audit' && <AdminShell section="audit" onNavigate={(section) => setView({ kind: section === 'audit' ? 'audit' : 'admin' })}><AdminAuditTrailPage onReplay={() => setView({ kind: 'workspace' })} shellManaged /></AdminShell>}

      {view.kind === 'home' && (
        <HomePage
          onNewSession={(question) => { setInitialQuestion(question ?? ''); setView({ kind: 'workspace' }); }}
          onRunPinnedReport={(reportName) => { const template = reportTemplates.find((item) => item.name.toLowerCase().includes(reportName.toLowerCase().split(' ')[0])) ?? reportTemplates[0]; setView({ kind: 'run', template }); }}
          onOpenReports={() => setView({ kind: 'reports' })}
          onCreateReport={() => setView({ kind: 'builder' })}
          onOpenWidgets={() => setView({ kind: 'widgets' })}
          onEditWidget={() => setView({ kind: 'workspace' })}
          homeWidgetIds={homeWidgetIds}
          homeWidgets={homeWidgets}
          pinnedReports={pinnedReports}
          recommendedWidgets={recommendedWidgets}
          scheduledDeliveries={scheduledDeliveries}
          scheduledDeliveriesLoading={scheduledDeliveriesLoading}
          scheduledDeliveriesError={scheduledDeliveriesError}
          downloadingDeliveryId={downloadingDeliveryId}
          deliveryDownloadError={deliveryDownloadError}
          onDownloadDelivery={handleDownloadDelivery}
          widgetData={widgetData}
          widgetLoading={widgetLoading}
          widgetErrors={widgetErrors}
          onRetryWidget={(id) => getWidgetData(id).then((data) => setWidgetData((current) => ({ ...current, [id]: data })))}
          onPreviewWidget={getWidgetData}
          onRemoveWidget={toggleHomeWidget}
          isNewUser={isNewUser}
          userName={firstName}
        />
      )}

      {view.kind === 'workspace' && (
        <ResizableThreePane left={<ChatPanel empty={view.newWidget} initialQuestion={initialQuestion} />} center={<CanvasPanel empty={view.newWidget} />} right={<ActionsPanel disabled={view.newWidget} onConvertToReport={() => setView({ kind: 'builder' })} />} leftLabel="Chat pane" rightLabel="Actions pane" />
      )}

      {view.kind === 'widgets' && <WidgetsPage onBack={() => setView({ kind: 'home' })} onEditWidget={() => setView({ kind: 'workspace' })} onNewWidget={() => setView({ kind: 'workspace', newWidget: true })} onToggleHomeWidget={toggleHomeWidget} />}

      {view.kind === 'reports' && (
        <ReportsHub
          onBack={() => setView({ kind: 'home' })}
          onBuild={(template) => setView({ kind: 'builder', template })}
          onOpenTemplate={(template) => setView({ kind: 'run', template })}
        />
      )}

      {view.kind === 'run' && <ReportWorkspace template={view.template} onBack={() => setView({ kind: 'reports' })} onBrowseReports={() => setView({ kind: 'reports' })} readOnly />}

      {view.kind === 'builder' && (
        <ReportBuilder
          initialTemplate={view.template}
          onClose={() => setView({ kind: 'workspace' })}
          onBrowseReports={() => setView({ kind: 'reports' })}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
