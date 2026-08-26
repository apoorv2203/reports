import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type AppCardVariant = 'default' | 'widget' | 'report' | 'recommendation' | 'admin';

const styles: Record<AppCardVariant, string> = {
  default: '',
  widget: 'group relative flex min-h-[300px] flex-col rounded-lg border border-border bg-card p-3.5 shadow-card ring-0 transition hover:-translate-y-0.5 hover:border-border hover:shadow-floaty focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2',
  report: 'rounded-[14px] border border-border bg-card p-6 shadow-card-alt ring-0 transition hover:border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2',
  recommendation: 'rounded-xl border border-border bg-card shadow-card-alt',
  admin: 'rounded-[14px] border border-border bg-card shadow-card-alt',
};

export function AppCard({ variant = 'default', density, className, ...props }: React.ComponentProps<typeof Card> & { variant?: AppCardVariant; density?: 'default' | 'compact' | 'empty' | 'recommendation' | 'modal' | 'widget' }) {
  const densityClass = density === 'compact' ? 'px-4 py-3' : density === 'empty' ? 'flex min-h-[430px] flex-col items-center justify-center px-6 text-center' : density === 'recommendation' ? 'px-5 py-5' : density === 'modal' ? 'w-full max-w-5xl rounded-xl p-6 shadow-floaty bg-white' : density === 'widget' ? 'p-4' : undefined;
  return <Card {...props} className={cn(styles[variant], densityClass, className)} />;
}
