import { Mountain } from 'lucide-react';

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-navy-900 text-mint-400 ${className}`}
      aria-hidden
    >
      <Mountain className="h-[18px] w-[18px]" strokeWidth={2.5} />
    </span>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-display text-[19px] font-extrabold tracking-tight ${
        light ? 'text-white' : 'text-ink-900'
      }`}
    >
      Report<span className="text-mint-400">IQ</span>
    </span>
  );
}
