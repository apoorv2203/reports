import { useState } from 'react';
import { TopNav } from '@/components/TopNav';
import { ChatPanel } from '@/components/ChatPanel';
import { CanvasPanel } from '@/components/CanvasPanel';
import { ActionsPanel } from '@/components/ActionsPanel';
import { ReportBuilder } from '@/components/ReportBuilder';
import { ReportsHub } from '@/components/ReportsHub';
import type { ReportTemplate } from '@/data/reportTemplates';

type View =
  | { kind: 'workspace' }
  | { kind: 'reports' }
  | { kind: 'builder'; template?: ReportTemplate };

function App() {
  const [view, setView] = useState<View>({ kind: 'workspace' });

  return (
    <div className="flex h-screen flex-col bg-[#f5f5f7] text-ink-900">
      <TopNav onOpenReports={() => setView({ kind: 'reports' })} />

      {view.kind === 'workspace' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden border-t border-surface-200 sm:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_220px]">
          <div className="hidden min-h-0 border-r border-surface-200 sm:block">
            <ChatPanel />
          </div>
          <CanvasPanel onBuildAReport={() => setView({ kind: 'builder' })} />
          <div className="hidden min-h-0 border-l border-surface-200 xl:block">
            <ActionsPanel />
          </div>
        </div>
      )}

      {view.kind === 'reports' && (
        <ReportsHub
          onBack={() => setView({ kind: 'workspace' })}
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

export default App;
