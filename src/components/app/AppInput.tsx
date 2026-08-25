import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AppInputProps = Omit<React.ComponentProps<typeof Input>, 'size'> & { size?: 'default' | 'inline' | 'report-search' };

export function AppInput({ size = 'default', className, ...props }: AppInputProps) {
  const sizeClass = size === 'inline' ? 'min-w-0 flex-1 border-0 bg-transparent text-[13px] shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0' : size === 'report-search' ? 'w-52' : undefined;
  return <Input {...props} className={cn('rounded-[10px] border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-muted disabled:text-muted-foreground data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20', sizeClass, className)} />;
}
