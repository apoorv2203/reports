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

export function AppBadge({ variant = 'table', size, className, ...props }: Omit<React.ComponentProps<typeof Badge>, 'variant'> & { variant?: AppBadgeVariant; size?: 'default' | 'format' | 'status' | 'category' }) {
  const sizeClass = size === 'format' ? 'flex size-7 shrink-0 items-center justify-center p-0 text-[8px]' : size === 'status' ? 'rounded-md px-2 py-1 text-[9px] font-bold' : size === 'category' ? 'rounded-full px-3 py-1 text-[12px] font-bold' : undefined;
  return <Badge {...props} className={cn(styles[variant], sizeClass, className)} />;
}
