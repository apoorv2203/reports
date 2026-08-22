import { useState } from 'react';
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
import type { ReportTemplate } from '@/data/reportTemplates';

type View =
  | { kind: 'home' }
  | { kind: 'workspace'; newWidget?: boolean }
  | { kind: 'reports' }
  | { kind: 'widgets' }
  | { kind: 'builder'; template?: ReportTemplate }
  | { kind: 'run'; template: ReportTemplate }
  | { kind: 'admin' };

function AppContent() {
  const { profile, signOut } = useAuth();
  const [view, setView] = useState<View>({ kind: 'home' });
  const [homeWidgetIds, setHomeWidgetIds] = useState<string[]>(['disbursed', 'approval', 'npa-trend']);
  const toggleHomeWidget = (id: string) => setHomeWidgetIds((current) => current.includes(id) ? current.filter((widgetId) => widgetId !== id) : [...current, id]);

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

      {view.kind === 'admin' && <AdminTablesPage onBack={() => setView({ kind: 'home' })} />}

      {view.kind === 'home' && (
        <HomePage
          onNewSession={() => setView({ kind: 'workspace' })}
          onOpenReports={() => setView({ kind: 'reports' })}
          onOpenWidgets={() => setView({ kind: 'widgets' })}
          onEditWidget={() => setView({ kind: 'workspace' })}
          homeWidgetIds={homeWidgetIds}
          onRemoveWidget={toggleHomeWidget}
          isNewUser={isNewUser}
          userName={firstName}
        />
      )}

      {view.kind === 'workspace' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden border-t border-surface-200 sm:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_220px]">
          <div className="hidden min-h-0 border-r border-surface-200 sm:block">
            <ChatPanel empty={view.newWidget} />
          </div>
          <CanvasPanel empty={view.newWidget} />
          <div className="hidden min-h-0 border-l border-surface-200 xl:block">
            <ActionsPanel disabled={view.newWidget} onConvertToReport={() => setView({ kind: 'builder' })} />
          </div>
        </div>
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
