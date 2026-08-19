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
        <div className="grid flex-1 grid-cols-[280px_1fr_210px] overflow-hidden border-t border-surface-200">
          <div className="border-r border-surface-200">
            <ChatPanel />
          </div>
          <CanvasPanel onBuildAReport={() => setView({ kind: 'builder' })} />
          <div className="border-l border-surface-200">
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
