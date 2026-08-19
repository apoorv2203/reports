import { useState } from 'react';
import type { ReportTemplate } from '@/data/reportTemplates';
import { ReportTemplatePicker } from './ReportTemplatePicker';
import { ReportWorkspace } from './ReportWorkspace';
import { BuilderReportsLibrary } from './BuilderReportsLibrary';

export function ReportBuilder({ onClose, initialTemplate }: { onClose: () => void; initialTemplate?: ReportTemplate }) {
  const [template, setTemplate] = useState<ReportTemplate | undefined>(initialTemplate);
  const [showLibrary, setShowLibrary] = useState(false);

  if (showLibrary) {
    return (
      <BuilderReportsLibrary
        onBack={() => setShowLibrary(false)}
        onOpenTemplate={(nextTemplate) => {
          setTemplate(nextTemplate);
          setShowLibrary(false);
        }}
      />
    );
  }

  if (!template) {
    return <ReportTemplatePicker onSelect={setTemplate} onClose={onClose} onBrowseReports={() => setShowLibrary(true)} />;
  }

  return <ReportWorkspace template={template} onBack={() => setTemplate(undefined)} onBrowseReports={() => setShowLibrary(true)} />;
}
