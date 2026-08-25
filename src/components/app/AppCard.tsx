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

export function AppCard({ variant = 'default', density, className, ...props }: React.ComponentProps<typeof Card> & { variant?: AppCardVariant; density?: 'default' | 'compact' | 'empty' | 'recommendation' | 'modal' | 'widget' | 'report-empty' | 'report-message' | 'report-row' | 'template' | 'builder-report' | 'template-card' | 'report-composer' | 'report-layout' }) {
  const densityClass = density === 'compact' ? 'px-4 py-3' : density === 'empty' ? 'flex min-h-[430px] flex-col items-center justify-center px-6 text-center' : density === 'recommendation' ? 'px-5 py-5' : density === 'modal' ? 'w-full max-w-5xl rounded-xl p-6 shadow-floaty' : density === 'widget' ? 'p-4' : density === 'report-composer' ? 'border-dashed p-4 text-[12px] leading-relaxed text-muted-foreground' : density === 'report-layout' ? 'p-3' : density === 'builder-report' ? 'min-h-[300px]' : density === 'report-empty' ? 'min-h-[255px]' : density === 'report-message' ? 'border-dashed p-4 text-[12px] leading-relaxed text-muted-foreground' : density === 'report-row' ? 'mt-3 p-2' : density === 'template-card' ? 'cursor-pointer overflow-hidden p-0 text-left transition hover:-translate-y-1' : density === 'template' ? 'cursor-pointer overflow-hidden p-0 text-left transition hover:-translate-y-1' : undefined;
  return <Card {...props} className={cn(styles[variant], densityClass, className)} />;
}
