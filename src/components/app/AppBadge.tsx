import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type AppBadgeVariant = 'table' | 'chart' | 'published' | 'draft' | 'success' | 'warning' | 'danger';
const styles: Record<AppBadgeVariant, string> = {
  table: 'bg-badge-green-bg text-badge-green-text',
  chart: 'bg-badge-purple-bg text-badge-purple-text',
  published: 'bg-badge-green-bg text-badge-green-text',
  draft: 'bg-badge-yellow-bg text-badge-yellow-text',
  success: 'bg-badge-green-bg text-badge-green-text',
  warning: 'bg-badge-yellow-bg text-badge-yellow-text',
  danger: 'bg-badge-red-bg text-badge-red-text',
};

export function AppBadge({ variant = 'table', className, ...props }: Omit<React.ComponentProps<typeof Badge>, 'variant'> & { variant?: AppBadgeVariant }) {
  return <Badge {...props} className={cn(styles[variant], className)} />;
}
