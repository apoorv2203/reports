import { useState } from 'react';
import { TopNav } from '@/components/TopNav';
import { HomePage } from '@/components/HomePage';
import { ChatPanel } from '@/components/ChatPanel';
import { CanvasPanel } from '@/components/CanvasPanel';
import { ActionsPanel } from '@/components/ActionsPanel';
import { ReportBuilder } from '@/components/ReportBuilder';
import { ReportsHub } from '@/components/ReportsHub';
import { AuthProvider, useAuth } from '@/lib/auth';
import { LoginScreen } from '@/components/LoginScreen';
import type { ReportTemplate } from '@/data/reportTemplates';

type View =
  | { kind: 'home' }
  | { kind: 'workspace' }
  | { kind: 'reports' }
  | { kind: 'builder'; template?: ReportTemplate };

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [view, setView] = useState<View>({ kind: 'home' });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-mint-200 border-t-mint-500" />
          <span className="text-[13px] font-medium text-ink-500">Loading your workspace…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const isNewUser = profile?.is_new_user ?? false;

  return (
    <div className="flex h-screen flex-col bg-[#f5f5f7] text-ink-900">
      <TopNav
        onOpenHome={() => setView({ kind: 'home' })}
        onOpenReports={() => setView({ kind: 'reports' })}
        onOpenSessions={() => setView({ kind: 'workspace' })}
        userName={firstName}
        userInitials={profile?.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? 'U'}
        onSignOut={signOut}
      />

      {view.kind === 'home' && (
        <HomePage
          onNewSession={() => setView({ kind: 'workspace' })}
          onOpenReports={() => setView({ kind: 'reports' })}
          isNewUser={isNewUser}
          userName={firstName}
        />
      )}

      {view.kind === 'workspace' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden border-t border-surface-200 sm:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_220px]">
          <div className="hidden min-h-0 border-r border-surface-200 sm:block">
            <ChatPanel />
          </div>
          <CanvasPanel />
          <div className="hidden min-h-0 border-l border-surface-200 xl:block">
            <ActionsPanel onConvertToReport={() => setView({ kind: 'builder' })} />
          </div>
        </div>
      )}

      {view.kind === 'reports' && (
        <ReportsHub
          onBack={() => setView({ kind: 'home' })}
          onBuild={() => setView({ kind: 'builder' })}
          onOpenTemplate={(template) => setView({ kind: 'builder', template })}
        />
      )}

      {view.kind === 'builder' && (
        <ReportBuilder
          initialTemplate={view.template}
          onClose={() => setView({ kind: 'workspace' })}
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
