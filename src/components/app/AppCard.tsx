import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type AppCardVariant = 'default' | 'widget' | 'report' | 'recommendation' | 'admin';

const styles: Record<AppCardVariant, string> = {
  default: '',
  widget: 'group relative flex min-h-[300px] flex-col rounded-xl border border-border bg-card p-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-mint-300 hover:shadow-floaty',
  report: 'rounded-[14px] border border-border bg-card shadow-card-alt',
  recommendation: 'rounded-xl border border-border bg-card shadow-card-alt',
  admin: 'rounded-[14px] border border-border bg-card shadow-card-alt',
};

export function AppCard({ variant = 'default', density, className, ...props }: React.ComponentProps<typeof Card> & { variant?: AppCardVariant; density?: 'default' | 'compact' | 'empty' | 'recommendation' }) {
  const densityClass = density === 'compact' ? 'px-4 py-3' : density === 'empty' ? 'flex min-h-[430px] flex-col items-center justify-center px-6 text-center' : density === 'recommendation' ? 'px-5 py-5' : undefined;
  return <Card {...props} className={cn(styles[variant], densityClass, className)} />;
}
