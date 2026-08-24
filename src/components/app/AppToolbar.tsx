import * as React from 'react';
import { cn } from '@/lib/utils';

export function AppToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('flex flex-wrap items-center justify-between gap-3', className)} />;
}
