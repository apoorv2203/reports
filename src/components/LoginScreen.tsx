import { useState } from 'react';
import { ChartBar as BarChart3, Eye, EyeOff, Lock, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { LogoMark, Wordmark } from './Logo';
import { useT } from '@/providers/I18nProvider';

export function LoginScreen() {
  const t = useT();
  const { signIn } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(userId.trim(), password);
    if (error) {
      setError(error);
      setLoading(false);
    }
  }

  function fillDemo(user: 'new' | 'experienced' | 'admin') {
    if (user === 'new') {
      setUserId('rahul.new@reportiq.dev');
      setPassword('welcome123');
    } else if (user === 'experienced') {
      setUserId('anita.experienced@reportiq.dev');
      setPassword('welcome123');
    } else {
      setUserId('admin@reportiq.dev');
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
            {t('login.tagline1')}<br />{t('login.tagline2')}
          </h1>
          <p className="mt-4 max-w-[380px] text-[15px] leading-relaxed text-white/60">
            {t('login.description')}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              { icon: Sparkles, text: t('login.feature1') },
              { icon: BarChart3, text: t('login.feature2') },
              { icon: Sparkles, text: t('login.feature3') },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] text-white/70">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-mint-400"><item.icon className="h-4 w-4" /></span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[12px] text-white/40">{t('login.copyright')}</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-5 py-10 lg:w-[55%]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <LogoMark />
            <Wordmark />
          </div>

          <h2 className="font-display text-[24px] font-bold tracking-[-0.03em] text-navy-900">{t('login.welcomeBack')}</h2>
          <p className="mt-1.5 text-[13px] text-ink-500">{t('login.signInSubtitle')}</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-ink-700">{t('login.email')}</span>
              <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-ink-300 transition focus-within:border-mint-400 focus-within:ring-2 focus-within:ring-mint-100">
                <User className="h-4 w-4 shrink-0" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-navy-900 outline-none placeholder:text-ink-300"
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-ink-700">{t('login.password')}</span>
              <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-ink-300 transition focus-within:border-mint-400 focus-within:ring-2 focus-within:ring-mint-100">
                <Lock className="h-4 w-4 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-navy-900 outline-none placeholder:text-ink-300"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-ink-500 hover:text-navy-900" aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}>
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
              {loading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] font-medium text-ink-300">
            <span className="h-px flex-1 bg-surface-200" />
            {t('login.tryDemo')}
            <span className="h-px flex-1 bg-surface-200" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => fillDemo('new')}
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-3 text-left transition hover:border-mint-300 hover:bg-mint-50"
            >
              <div className="text-[12px] font-bold text-navy-900">{t('login.demoNew')}</div>
              <div className="mt-0.5 text-[10px] text-ink-500">{t('login.demoNewDesc')}</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-3 text-left transition hover:border-mint-300 hover:bg-mint-50"
            >
              <div className="text-[12px] font-bold text-navy-900">{t('login.demoAdmin')}</div>
              <div className="mt-0.5 text-[10px] text-ink-500">{t('login.demoAdminDesc')}</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('experienced')}
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-3 text-left transition hover:border-mint-300 hover:bg-mint-50"
            >
              <div className="text-[12px] font-bold text-navy-900">{t('login.demoExperienced')}</div>
              <div className="mt-0.5 text-[10px] text-ink-500">{t('login.demoExperiencedDesc')}</div>
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-ink-300">{t('login.passwordHint')}</p>
        </div>
      </div>
    </div>
  );
}
