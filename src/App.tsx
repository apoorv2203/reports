import { useEffect, useState } from 'react';
import { addWidgetToHome, getHomeWidgets, getWidgetData, getWidgetRecommendations, removeWidgetFromHome, type HomeWidget, type WidgetData, type WidgetRecommendation } from '@/api/services/widgetService';
import { apiConfig, apiDefinitions } from '@/api/config/apiConfig';
import { getPinnedReports } from '@/api/services/reportService';
import type { PinnedReport } from '@/api/types/report';
import { getScheduledDeliveries, downloadScheduledDelivery } from '@/api/services/scheduledDeliveryService';
import type { ScheduledDelivery } from '@/api/types/scheduledDelivery';
import { appConfig } from '@/config/appConfig';
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
import { GlobalPopupProvider, useGlobalPopup } from '@/providers/GlobalPopupProvider';
import { LoginScreen } from '@/components/LoginScreen';
import { WidgetsPage } from '@/components/WidgetsPage';
import { AdminTablesPage } from '@/components/AdminTablesPage';
import { AdminAuditTrailPage } from '@/components/AdminAuditTrailPage';
import { PredictiveAnalyticsPage } from '@/components/PredictiveAnalyticsPage';
import { AdminShell } from '@/components/AdminShell';
import { ResizableThreePane } from '@/components/ResizableThreePane';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import { reportTemplates, type ReportTemplate } from '@/data/reportTemplates';

type View =
  | { kind: 'home' }
  | { kind: 'workspace'; newWidget?: boolean }
  | { kind: 'reports' }
  | { kind: 'predictive' }
  | { kind: 'widgets' }
  | { kind: 'builder'; template?: ReportTemplate }
  | { kind: 'run'; template: ReportTemplate }
  | { kind: 'admin' }
  | { kind: 'audit' };

const VIEW_ALLOW_LIST: Record<View['kind'], string[]> = {
  home: ['*'],
  workspace: ['*'],
  reports: ['*'],
  predictive: ['*'],
  widgets: ['*'],
  builder: ['*'],
  run: ['*'],
  admin: ['ADMIN', 'BANK_ADMIN'],
  audit: ['ADMIN', 'BANK_ADMIN'],
};

const canAccessView = (profile: { role: string; roles: string[] } | null, view: View['kind']) => {
  if (!profile) return false;
  const allowedRoles = VIEW_ALLOW_LIST[view] ?? ['*'];
  if (allowedRoles.includes('*')) return true;

  const normalizedRole = profile.role.toUpperCase();
  const normalizedRoles = profile.roles.map((role) => role.toUpperCase());
  return allowedRoles.some((allowedRole) => allowedRole === normalizedRole || normalizedRoles.includes(allowedRole));
};

function AppContent() {
  const { profile, signOut, refreshNow, sessionExpiryAt, isHydrated } = useAuth();
  const { popup, openPopup, closePopup } = useGlobalPopup();
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
  const shouldBypassSessionTimeout = apiDefinitions.authLogin.mode === 'mock' && apiConfig.sessionTimeoutBypassWhenMock;

  const { remainingSeconds, warning } = useSessionTimeout({
    enabled: Boolean(profile) && appConfig.sessionTimeoutEnabled && !shouldBypassSessionTimeout,
    expiresAt: sessionExpiryAt,
    fallbackTimeoutMs: appConfig.sessionTimeoutMs,
    warningMs: appConfig.sessionWarningMs,
    onExpire: () => {
      setTimeout(() => {
        void signOut();
      }, appConfig.sessionExpiredLogoutDelayMs);
    },
  });

  useEffect(() => {
    if (!profile) return;
    if (!warning) {
      if (popup?.id === 'session-warning') closePopup();
      return;
    }

    openPopup({
      id: 'session-warning',
      title: 'Session Expiry Warning',
      message: `Your session will expire in ${remainingSeconds}s. Click Continue Journey to stay signed in.`,
      confirmText: 'Continue Journey',
      cancelText: 'Logout Now',
      onConfirm: async () => {
        const ok = await refreshNow();
        if (!ok) await signOut();
      },
      onCancel: () => {
        void signOut();
      },
    });
  }, [warning, remainingSeconds, popup?.id, openPopup, closePopup, refreshNow, signOut]);

  const greetingForTime = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  })();

  const { isUpdating, message: updateMessage } = useVersionCheck({
    enabled: appConfig.autoUpdateEnabled,
    intervalMs: appConfig.versionCheckInterval,
    showNotification: appConfig.showUpdateNotification,
    onVersionChanged: () => {
      void (async () => {
        await signOut();
        window.location.reload();
      })();
    },
  });

  useEffect(() => {
    if (!profile) return;
    setView({ kind: 'home' });
  }, [profile?.id]);

  useEffect(() => {
    if (!profile) return;
    if (!canAccessView(profile, view.kind)) {
      setView({ kind: 'home' });
    }
  }, [profile, view.kind]);

  useEffect(() => {
    if (!profile) return;
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
  }, [profile?.id]);
  useEffect(() => {
    if (!profile) return;
    getScheduledDeliveries().then(({ deliveries }) => setScheduledDeliveries(deliveries)).catch(() => setScheduledDeliveriesError(true)).finally(() => setScheduledDeliveriesLoading(false));
  }, [profile?.id]);
  const handleDownloadDelivery = async (deliveryId: string) => {
    setDownloadingDeliveryId(deliveryId); setDeliveryDownloadError(false);
    try {
      const result = await downloadScheduledDelivery(deliveryId);
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.fileName || scheduledDeliveries.find((item) => item.id === deliveryId)?.fileName || 'scheduled-delivery'; anchor.click(); URL.revokeObjectURL(url);
    } catch { setDeliveryDownloadError(true); } finally { setDownloadingDeliveryId(undefined); }
  };
  const toggleHomeWidget = (id: string) => { const removing = homeWidgetIds.includes(id); (removing ? removeWidgetFromHome(id) : addWidgetToHome(id)).then(({ widgets }) => { setHomeWidgets(widgets); setHomeWidgetIds(widgets.filter((widget) => widget.isOnHome).map((widget) => widget.id)); if (!removing) { setWidgetLoading((current) => ({ ...current, [id]: true })); getWidgetData(id).then((data) => setWidgetData((current) => ({ ...current, [id]: data }))).catch(() => setWidgetErrors((current) => ({ ...current, [id]: true }))).finally(() => setWidgetLoading((current) => ({ ...current, [id]: false }))); } }); };

  useEffect(() => {
    if (!profile && window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
  }, [profile]);

  if (!isHydrated) {
    return <div className="flex h-screen items-center justify-center bg-background text-sm font-semibold text-ink-500">Loading session...</div>;
  }

  if (!profile) {
    return <LoginScreen />;
  }

  const isNewUser = profile.is_new_user;
  const initials = profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  const hasAdminAccess = profile.role === 'admin' || profile.roles.some(r => r.toUpperCase() === 'BANK_ADMIN');

  return (
    <div className="flex h-screen flex-col bg-background text-ink-900">
      {isUpdating && (
        <div className="flex items-center justify-center bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900">
          {updateMessage || 'A new version is available. Updating...'}
        </div>
      )}
      <TopNav
        onOpenHome={() => setView({ kind: 'home' })}
        onOpenReports={() => setView({ kind: 'reports' })}
        onOpenWidgets={() => setView({ kind: 'widgets' })}
        onOpenSessions={() => setView({ kind: 'workspace' })}
        userName={profile.full_name}
        userEmail={profile.email}
        userRoles={profile.roles}
        userInitials={initials}
        onSignOut={() => {
          openPopup({
            id: 'confirm-signout',
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            confirmText: 'Logout',
            cancelText: 'Cancel',
            tone: 'danger',
            onConfirm: async () => {
              await signOut();
            },
          });
        }}
        isAdmin={hasAdminAccess}
        onOpenSettings={() => setView({ kind: 'admin' })}
        sessionSecondsLeft={shouldBypassSessionTimeout ? undefined : remainingSeconds}
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
          userName={profile.full_name}
          greeting={greetingForTime}
        />
      )}

      {view.kind === 'workspace' && (
        <ResizableThreePane left={<ChatPanel empty={view.newWidget} initialQuestion={initialQuestion} />} center={<CanvasPanel empty={view.newWidget} />} right={<ActionsPanel disabled={view.newWidget} onConvertToReport={() => setView({ kind: 'builder' })} />} leftLabel="Chat pane" rightLabel="Actions pane" />
      )}

      {view.kind === 'predictive' && <PredictiveAnalyticsPage onBack={() => setView({ kind: 'home' })} />}

      {view.kind === 'widgets' && <WidgetsPage onBack={() => setView({ kind: 'home' })} onEditWidget={() => setView({ kind: 'workspace' })} onNewWidget={() => setView({ kind: 'workspace', newWidget: true })} homeWidgetIds={homeWidgetIds} onToggleHomeWidget={toggleHomeWidget} />}

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
          <GlobalPopupProvider>
            <AppContent />
          </GlobalPopupProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;