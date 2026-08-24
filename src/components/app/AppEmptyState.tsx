import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export function AppEmptyState({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card {...props} className={cn('flex min-h-40 flex-col items-center justify-center gap-3 border-dashed p-6 text-center text-ink-500', className)} />;
}
