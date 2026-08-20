import { ArrowRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { reportTemplates, type ReportTemplate } from '@/data/reportTemplates';

export function ReportTemplatePicker({
  onSelect,
  onClose,
  onBrowseReports,
}: {
  onSelect: (template: ReportTemplate) => void;
  onClose: () => void;
  onBrowseReports: () => void;
}) {
  return (
    <div className="rb-overlay fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f7]" role="dialog" aria-modal="true">
      <header className="flex h-16 items-center justify-between border-b border-[#e5e5e7] bg-white px-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-[17px] font-bold tracking-[-0.03em] text-ink-900">Build a report</span>
          <span className="h-5 w-px bg-[#d2d2d7]" />
          <span className="text-[13px] text-ink-500">Choose a starting point</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBrowseReports} className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-white px-4 py-2 text-[13px] font-bold text-ink-700 hover:border-mint-300 hover:bg-mint-50 hover:text-mint-700">
            <BookOpen className="h-4 w-4" /> Browse reports
          </button>
          <button onClick={onClose} className="rounded-full px-3 py-2 text-[13px] font-semibold text-ink-500 hover:bg-[#f5f5f7] hover:text-ink-900">
            Cancel
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <div className="max-w-2xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mint-700">ReportIQ templates</p>
          <h1 className="mt-2 font-display text-[32px] font-bold tracking-[-0.04em] text-ink-900">Start with a shell, then make it yours.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            Pick a prepared layout and use natural language to shape every section. You can add charts, KPIs, tables, and explanations as you go.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-[12px] border border-[#e5e5e7] bg-white px-3 py-2 text-ink-300 shadow-soft">
            <Search className="h-4 w-4" />
            <input className="w-52 bg-transparent text-[13px] text-ink-900 outline-none placeholder:text-ink-300" placeholder="Search templates" />
          </div>
          <span className="text-[12px] font-medium text-ink-500">{reportTemplates.length} templates</span>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-5">
          {reportTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onSelect={onSelect} />
          ))}
        </div>

        <div className="mt-9 flex items-center gap-3 rounded-[16px] border border-mint-200 bg-mint-50 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-mint-400 text-navy-900"><Sparkles className="h-4 w-4" /></div>
          <div className="flex-1">
            <div className="text-[13px] font-bold text-ink-900">Not sure where to start?</div>
            <div className="text-[12px] text-ink-500">Start from blank and describe the report you need in the conversation.</div>
          </div>
          <button onClick={() => onSelect(reportTemplates.find((t) => t.id === 'blank')!)} className="text-[12px] font-bold text-mint-700 hover:text-mint-600">Start blank <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button>
        </div>
      </main>
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: ReportTemplate; onSelect: (template: ReportTemplate) => void }) {
  return (
    <button onClick={() => onSelect(template)} className="group flex flex-col overflow-hidden rounded-lg border border-[#e5e5e7] bg-white text-left shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:-translate-y-1 hover:border-mint-300 hover:shadow-floaty">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#e5e5e7] bg-[#f5f5f7]">
        <img
          src={template.preview || "/placeholder.svg"}
          alt={`${template.name} template preview`}
          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-navy-900 shadow-soft backdrop-blur-sm">{template.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink-900">{template.name}</h3>
        <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-500">{template.description}</p>
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-ink-300">
          <span>{template.updated}</span>
          <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-1 group-hover:text-mint-600" />
        </div>
      </div>
    </button>
  );
}
