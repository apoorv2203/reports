import { useEffect, useState } from 'react';
import { addWidgetToHome, getHomeWidgets, getWidgetData, removeWidgetFromHome, type HomeWidget, type WidgetData } from '@/services/widgetService';
import { TopNav } from '@/components/TopNav';
import { HomePage } from '@/components/HomePage';
import { ChatPanel } from '@/components/ChatPanel';
import { CanvasPanel } from '@/components/CanvasPanel';
import { ActionsPanel } from '@/components/ActionsPanel';
import { ReportBuilder } from '@/components/ReportBuilder';
import { ReportWorkspace } from '@/components/ReportWorkspace';
import { ReportsHub } from '@/components/ReportsHub';
import { AuthProvider, useAuth } from '@/lib/auth';
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
  useEffect(() => { getHomeWidgets().then(({ widgets }) => { setHomeWidgets(widgets); setHomeWidgetIds(widgets.filter((widget) => widget.isOnHome).map((widget) => widget.id)); Promise.allSettled(widgets.filter((widget) => widget.isOnHome).map(async (widget) => { setWidgetLoading((current) => ({ ...current, [widget.id]: true })); try { const data = await getWidgetData(widget.id); setWidgetData((current) => ({ ...current, [widget.id]: data })); } catch { setWidgetErrors((current) => ({ ...current, [widget.id]: true })); } finally { setWidgetLoading((current) => ({ ...current, [widget.id]: false })); } })); }); }, []);
  const toggleHomeWidget = (id: string) => { const removing = homeWidgetIds.includes(id); (removing ? removeWidgetFromHome(id) : addWidgetToHome(id)).then(({ widgets }) => { setHomeWidgets(widgets); setHomeWidgetIds(widgets.filter((widget) => widget.isOnHome).map((widget) => widget.id)); if (!removing) { setWidgetLoading((current) => ({ ...current, [id]: true })); getWidgetData(id).then((data) => setWidgetData((current) => ({ ...current, [id]: data }))).catch(() => setWidgetErrors((current) => ({ ...current, [id]: true }))).finally(() => setWidgetLoading((current) => ({ ...current, [id]: false }))); } }); };

  if (!profile) {
    return <LoginScreen />;
  }

  const firstName = profile.full_name.split(' ')[0];
  const isNewUser = profile.is_new_user;
  const initials = profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <div className="flex h-screen flex-col bg-[#f5f5f7] text-ink-900">
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
          widgetData={widgetData}
          widgetLoading={widgetLoading}
          widgetErrors={widgetErrors}
          onRetryWidget={(id) => getWidgetData(id).then((data) => setWidgetData((current) => ({ ...current, [id]: data })))}
          onRemoveWidget={toggleHomeWidget}
          isNewUser={isNewUser}
          userName={firstName}
        />
      )}

      {view.kind === 'workspace' && (
        <ResizableThreePane left={<ChatPanel empty={view.newWidget} initialQuestion={initialQuestion} />} center={<CanvasPanel empty={view.newWidget} />} right={<ActionsPanel disabled={view.newWidget} onConvertToReport={() => setView({ kind: 'builder' })} />} leftLabel="Chat pane" rightLabel="Actions pane" />
      )}

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
