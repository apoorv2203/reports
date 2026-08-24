import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type AppCardVariant = 'default' | 'widget' | 'report' | 'recommendation' | 'admin';

const styles: Record<AppCardVariant, string> = {
  default: '',
  widget: 'group relative flex min-h-[300px] flex-col rounded-xl border border-surface-200 bg-surface p-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-mint-300 hover:shadow-floaty',
  report: 'rounded-[14px] border border-surface-200 bg-surface shadow-card-alt',
  recommendation: 'rounded-xl border border-surface-200 bg-surface shadow-card-alt',
  admin: 'rounded-[14px] border border-surface-200 bg-surface shadow-card-alt',
};

export function AppCard({ variant = 'default', className, ...props }: React.ComponentProps<typeof Card> & { variant?: AppCardVariant }) {
  return <Card {...props} className={cn(styles[variant], className)} />;
}
