import { useState } from 'react';
import { ChartBar as BarChart3, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { LogoMark, Wordmark } from './Logo';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setError(error);
      setLoading(false);
    }
  }

  function fillDemo(user: 'new' | 'experienced') {
    if (user === 'new') {
      setEmail('rahul.new@reportiq.dev');
      setPassword('welcome123');
    } else {
      setEmail('anita.experienced@reportiq.dev');
      setPassword('welcome123');
    }
    setError(null);
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left brand panel */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-navy-900 p-10 lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-mint-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-mint-500/10 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-400 text-navy-900"><BarChart3 className="h-5 w-5" strokeWidth={2.5} /></span>
          <Wordmark light />
        </div>
        <div className="relative">
          <h1 className="font-display text-[34px] font-extrabold leading-[1.15] tracking-[-0.04em] text-white">
            Talk to your banking data.<br />Get answers in seconds.
          </h1>
          <p className="mt-4 max-w-[380px] text-[15px] leading-relaxed text-white/60">
            ReportIQ turns natural-language questions into instant insights — charts, tables, and reports your whole team can use.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              { icon: Sparkles, text: 'Ask in plain English, get visual answers' },
              { icon: BarChart3, text: 'Build reusable reports from any session' },
              { icon: Sparkles, text: 'Pin widgets to your personal dashboard' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] text-white/70">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-mint-400"><item.icon className="h-4 w-4" /></span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[12px] text-white/40">© 2026 ReportIQ · Digital Banking Reporting Workspace</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-5 py-10 lg:w-[55%]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <LogoMark />
            <Wordmark />
          </div>

          <h2 className="font-display text-[24px] font-bold tracking-[-0.03em] text-navy-900">Welcome back</h2>
          <p className="mt-1.5 text-[13px] text-ink-500">Sign in to your ReportIQ workspace.</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-ink-700">Email</span>
              <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-ink-300 transition focus-within:border-mint-400 focus-within:ring-2 focus-within:ring-mint-100">
                <Mail className="h-4 w-4 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-navy-900 outline-none placeholder:text-ink-300"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-ink-700">Password</span>
              <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-ink-300 transition focus-within:border-mint-400 focus-within:ring-2 focus-within:ring-mint-100">
                <Lock className="h-4 w-4 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-navy-900 outline-none placeholder:text-ink-300"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-ink-500 hover:text-navy-900" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[12px] font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-[13px] font-bold text-white transition hover:bg-navy-800 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] font-medium text-ink-300">
            <span className="h-px flex-1 bg-surface-200" />
            Try a demo account
            <span className="h-px flex-1 bg-surface-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemo('new')}
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-3 text-left transition hover:border-mint-300 hover:bg-mint-50"
            >
              <div className="text-[12px] font-bold text-navy-900">New user</div>
              <div className="mt-0.5 text-[10px] text-ink-500">Rahul · empty dashboard</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('experienced')}
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-3 text-left transition hover:border-mint-300 hover:bg-mint-50"
            >
              <div className="text-[12px] font-bold text-navy-900">Experienced user</div>
              <div className="mt-0.5 text-[10px] text-ink-500">Anita · full dashboard</div>
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-ink-300">Password for both: welcome123</p>
        </div>
      </div>
    </div>
  );
}
