import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AppInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn('rounded-[10px] border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-muted disabled:text-muted-foreground data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20', className)} />;
}
