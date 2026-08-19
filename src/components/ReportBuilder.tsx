import { useState } from 'react';
import type { ReportTemplate } from '@/data/reportTemplates';
import { ReportTemplatePicker } from './ReportTemplatePicker';
import { ReportWorkspace } from './ReportWorkspace';

export function ReportBuilder({ onClose, initialTemplate }: { onClose: () => void; initialTemplate?: ReportTemplate }) {
  const [template, setTemplate] = useState<ReportTemplate | undefined>(initialTemplate);

  if (!template) {
    return <ReportTemplatePicker onSelect={setTemplate} onClose={onClose} />;
  }

  return <ReportWorkspace template={template} onBack={() => setTemplate(undefined)} />;
}
