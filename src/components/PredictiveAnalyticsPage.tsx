import { AlertTriangle, Brain, Target, TrendingUp } from 'lucide-react';

type PredictiveAnalyticsPageProps = {
  onBack: () => void;
};

const models = [
  { title: 'Loan Default Risk', accuracy: '94.2%', status: 'Active', icon: AlertTriangle, tone: 'text-red-700 bg-red-50 border-red-200' },
  { title: 'Customer Lifetime Value', accuracy: '89.7%', status: 'Active', icon: Target, tone: 'text-blue-700 bg-blue-50 border-blue-200' },
  { title: 'Demand Forecasting', accuracy: '87.3%', status: 'Training', icon: TrendingUp, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

const insights = [
  '12 loan applications flagged for manual review by risk score threshold.',
  'Home loan demand forecast indicates +25% volume in next quarter.',
  '8 high-value borrowers show churn risk signals requiring engagement.',
];

export function PredictiveAnalyticsPage({ onBack }: PredictiveAnalyticsPageProps) {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-white to-surface-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-surface-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
              <Brain className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900">Predictive Analytics</h2>
              <p className="text-sm text-ink-500">AI-driven forecasting and risk intelligence</p>
            </div>
          </div>
          <button onClick={onBack} type="button" className="rounded-lg border border-surface-200 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-surface-50">
            Back to Home
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {models.map((model) => (
            <article key={model.title} className={`rounded-2xl border p-4 ${model.tone}`}>
              <div className="mb-3 flex items-center justify-between">
                <model.icon className="h-5 w-5" />
                <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold">{model.status}</span>
              </div>
              <h3 className="text-sm font-bold">{model.title}</h3>
              <p className="mt-2 text-xs">Model accuracy: {model.accuracy}</p>
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-surface-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-bold text-navy-900">Latest AI Insights</h3>
          <ul className="mt-4 space-y-3">
            {insights.map((insight) => (
              <li key={insight} className="rounded-xl bg-surface-50 px-4 py-3 text-sm text-ink-600">{insight}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
