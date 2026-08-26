import { useState } from 'react';
import type { LibraryReport } from '@/data/reportTemplates';
import type { ReportTemplateResponse } from '@/api/types/report';
import { ReportTemplatePicker } from './ReportTemplatePicker';
import { ReportWorkspace } from './ReportWorkspace';
import { BuilderReportsLibrary } from './BuilderReportsLibrary';

export function ReportBuilder({ onClose, onBrowseReports, initialTemplate }: { onClose: () => void; onBrowseReports: () => void; initialTemplate?: ReportTemplateResponse }) {
  const [template, setTemplate] = useState<ReportTemplateResponse | undefined>(initialTemplate);
  const [selectedReport, setSelectedReport] = useState<LibraryReport | undefined>();
  const [showLibrary, setShowLibrary] = useState(false);

  if (showLibrary) {
    return (
      <BuilderReportsLibrary
        onBack={() => setShowLibrary(false)}
        onOpenReport={(nextTemplate, report) => {
          setTemplate(nextTemplate);
          setSelectedReport(report);
          setShowLibrary(false);
        }}
      />
    );
  }

  if (!template) {
    return <ReportTemplatePicker onSelect={setTemplate} onClose={onClose} onBrowseReports={onBrowseReports} />;
  }

  return <ReportWorkspace template={template} report={selectedReport} onBack={() => { setTemplate(undefined); setSelectedReport(undefined); }} onBrowseReports={onBrowseReports} />;
}
