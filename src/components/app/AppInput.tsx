import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AppInput({ size = 'default', className, ...props }: React.ComponentProps<typeof Input> & { size?: 'default' | 'inline' }) {
  const sizeClass = size === 'inline' ? 'min-w-0 flex-1 border-0 bg-transparent text-[13px] shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0' : undefined;
  return <Input {...props} className={cn('rounded-[10px] border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-muted disabled:text-muted-foreground data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20', sizeClass, className)} />;
}
