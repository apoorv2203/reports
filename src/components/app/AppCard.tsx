import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type AppCardVariant = 'default' | 'widget' | 'report' | 'recommendation' | 'admin';

const styles: Record<AppCardVariant, string> = {
  default: '',
  widget: 'rounded-[14px] shadow-card-alt',
  report: 'rounded-[14px] shadow-card-alt',
  recommendation: 'rounded-[14px] shadow-card-alt',
  admin: 'rounded-[14px] shadow-card-alt',
};

export function AppCard({ variant = 'default', className, ...props }: React.ComponentProps<typeof Card> & { variant?: AppCardVariant }) {
  return <Card {...props} className={cn(styles[variant], className)} />;
}
